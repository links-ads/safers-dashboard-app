import React, { useEffect, useMemo, useState } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Card } from 'reactstrap';

import 'toastr/build/toastr.min.css';
import 'rc-pagination/assets/index.css';
import BaseMap from 'components/BaseMap/BaseMap';
import { useMap } from 'components/BaseMap/MapContext';
import SearchButton from 'components/SearchButton';
import { PAGE_SIZE, MAP_TYPES } from 'constants/common';
import { getBoundingBox, getIconLayer, getViewState } from 'helpers/mapHelper';
import { dateRangeSelector } from 'store/common.slice';
import {
  fetchNotifications,
  fetchNotificationSources,
  fetchNotificationScopeRestrictions,
  setNewNotificationState,
  setNotificationParams,
  allNotificationsSelector,
  notificationParamsSelector,
} from 'store/notifications.slice';

import NotificationsList from './Components/NotificationsList';
import SortSection from './Components/SortSection';
import Tooltip from './Components/Tooltip';

const Notifications = () => {
  const dispatch = useDispatch();
  const { viewState, setViewState } = useMap();

  const notifications = useSelector(allNotificationsSelector);

  const notificationParams = useSelector(notificationParamsSelector);
  const dateRange = useSelector(dateRangeSelector);

  const [boundingBox, setBoundingBox] = useState(undefined);

  const [filteredNotifications, setFilterdNotifications] = useState([]);
  const [paginatedNotifications, setPaginatedNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [notificationSource, setNotificationSource] = useState('all');
  const [notificationScopeRestriction, setNotificationScopeRestriction] =
    useState('all');
  const [sortOrder, setSortOrder] = useState('-date');
  const [iconLayer, setIconLayer] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(undefined);

  const { t } = useTranslation();

  const mapData = useMemo(
    () =>
      notifications.map(notification => ({
        ...notification,
        geometry: { type: 'Point', coordinates: notification.center },
      })),
    [notifications],
  );

  useEffect(() => {
    setIconLayer(
      getIconLayer(mapData, MAP_TYPES.ALERTS, 'flag', selectedNotification),
    );
  }, [selectedNotification, mapData]);

  useEffect(() => {
    dispatch(fetchNotificationSources());
    dispatch(fetchNotificationScopeRestrictions());
  }, [dispatch]);

  useEffect(() => {
    setFilterdNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    const params = { ...notificationParams };

    if (notificationSource && notificationSource !== 'all') {
      params.source = notificationSource;
    }

    if (
      notificationScopeRestriction &&
      notificationScopeRestriction !== 'all'
    ) {
      params.scopeRestriction = notificationScopeRestriction;
    }

    if (dateRange) {
      params.start_date = dateRange[0];
      params.end_date = dateRange[1];
    } else if (!dateRange) {
      delete params.start_date;
      delete params.end_date;
    }

    if (sortOrder) {
      params.order = sortOrder;
    }

    if (boundingBox) {
      params.default_bbox = false;
      params.bbox = boundingBox.toString();
    }

    dispatch(setNotificationParams(params));
    dispatch(fetchNotifications(params));
    dispatch(setNewNotificationState(false, true));

    return () => {
      dispatch(setNotificationParams(undefined));
      dispatch(setNewNotificationState(false, false));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dateRange,
    boundingBox,
    notificationSource,
    notificationScopeRestriction,
    sortOrder,
    dispatch,
  ]);

  useEffect(() => {
    setCurrentPage(1);
    setPaginatedNotifications(
      _.cloneDeep(filteredNotifications.slice(0, PAGE_SIZE)),
    );
  }, [filteredNotifications]);

  const onNotificationClick = notification => {
    if (notification?.id === selectedNotification?.id) {
      setSelectedNotification(undefined);
    } else {
      setSelectedNotification(notification);

      setViewState(
        getViewState(notification.center, viewState.zoom, notification),
      );
    }
  };

  const onClick = info => {
    if (info.objects) {
      // Prevents clicks on grouped icons
      return;
    } else if (info.picked && info.object) {
      onNotificationClick(info.object.properties);
    }
  };

  const renderTooltip = notification => {
    if (!notification?.id) return null;

    const { center } = notification;
    if (notification) {
      return <Tooltip object={notification} coordinate={center} t={t} />;
    }
  };

  const getNotificationsByArea = () => {
    setBoundingBox(
      getBoundingBox(
        [viewState.longitude, viewState.latitude],
        viewState.zoom,
        viewState.width,
        viewState.height,
      ),
    );
  };

  const getSearchButton = index => {
    return (
      <SearchButton index={index} getInfoByArea={getNotificationsByArea} />
    );
  };

  return (
    <div className="page-content">
      <div className="mx-2 sign-up-aoi-map-bg">
        <Row>
          <Col xl={12} className="d-flex justify-content-between">
            <p className="align-self-baseline alert-title">
              {t('Recommendation List', { ns: 'common' })}
            </p>
          </Col>
        </Row>
        <Row>
          <Col xl={5}>
            <SortSection
              filteredNotifications={filteredNotifications}
              setFilterdNotifications={setFilterdNotifications}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              notificationSource={notificationSource}
              setNotificationSource={setNotificationSource}
              notificationScopeRestriction={notificationScopeRestriction}
              setNotificationScopeRestriction={setNotificationScopeRestriction}
            />
            <Row>
              <Col xl={12} className="px-3">
                <NotificationsList
                  filteredNotifications={filteredNotifications}
                  paginatedNotifications={paginatedNotifications}
                  setPaginatedNotifications={setPaginatedNotifications}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  setSelectedNotification={onNotificationClick}
                  selectedNotification={selectedNotification}
                />
              </Col>
            </Row>
          </Col>
          <Col xl={7} className="mx-auto">
            <Card className="map-card mb-0" style={{ height: 670 }}>
              <BaseMap
                layers={[iconLayer]}
                hoverInfo={selectedNotification}
                // renderTooltip={renderTooltip}
                onClick={onClick}
                widgets={[getSearchButton]}
                // setWidth={setNewWidth}
                // setHeight={setNewHeight}
                screenControlPosition="top-right"
                navControlPosition="bottom-right"
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Notifications;
