import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button } from 'reactstrap';
import _ from 'lodash';
import moment from 'moment';
import toastr from 'toastr';

import 'toastr/build/toastr.min.css'
import 'rc-pagination/assets/index.css';
import SortSection from './Components/SortSection';
import DateComponent from '../../components/DateRangePicker/DateRange';
import MapSection from './Components/Map';
import EventList from './Components/EventList';
import {
  getAllEventAlerts,
  resetEventAlertsResponseState,
  setNewEventState,
  getEventInfo,
  setEventParams,
  setFilteredAlerts
} from '../../store/appAction';
import { getBoundingBox, getIconLayer, getViewState } from '../../helpers/mapHelper';
import { PAGE_SIZE } from '../../store/events/types';

//i18n
import { withTranslation } from 'react-i18next'
import { MAP_TYPES } from '../../constants/common';

const EventAlerts = ({ t }) => {
  const defaultAoi = useSelector(state => state.user.defaultAoi);
  const { allAlerts: alerts, filteredAlerts } = useSelector(state => state.eventAlerts);
  const success = useSelector(state => state.eventAlerts.success);
  const error = useSelector(state => state.eventAlerts.error);
  // eslint-disable-next-line no-unused-vars
  const { params } = useSelector(state => state.eventAlerts);

  const [viewState, setViewState] = useState(undefined);
  const [iconLayer, setIconLayer] = useState(undefined);
  const [sortOrder, setSortOrder] = useState(undefined);
  const [alertSource, setAlertSource] = useState(undefined);
  const [midPoint, setMidPoint] = useState([]);
  const [status, setStatus] = useState('');
  const [boundingBox, setBoundingBox] = useState(undefined);
  const [currentZoomLevel, setCurrentZoomLevel] = useState(undefined);
  const [dateRange, setDateRange] = useState([undefined, undefined]);
  const [alertId, setAlertId] = useState(undefined);
  const [hoverInfo, setHoverInfo] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedAlerts, setPaginatedAlerts] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setNewEventState(false, true));
    return () => {
      dispatch(setEventParams(undefined));
      dispatch(setNewEventState(false, false));
    }
  }, []);

  useEffect(() => {
    getEvents();
  }, [dateRange, alertSource, sortOrder, boundingBox, status])

  // useEffect(() => {
  //   setFilteredAlerts(alerts);
  // }, [alerts]);

  useEffect(() => {
    if (success) {
      toastr.success(success, '');
    } else if (error)
      toastr.error(error, '');

    dispatch(resetEventAlertsResponseState());
  }, [success, error]);

  useEffect(() => {
    if (alerts.length > filteredAlerts.length) {
      toastr.success('New events are received. Please refresh the list.', '', { preventDuplicates: true, });
    }
  }, [alerts]);

  useEffect(() => {
    setIconLayer(getIconLayer(filteredAlerts, MAP_TYPES.EVENTS));
    if (!viewState) {
      setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel));
    }
    setCurrentPage(1);
    hideTooltip();
    setPaginatedAlerts(_.cloneDeep(filteredAlerts.slice(0, PAGE_SIZE)))
  }, [filteredAlerts]);


  const getEvents = () => {
    //setAlertId(undefined);
    const eventParams = {
      order: sortOrder ? sortOrder : '-date',
      source: alertSource,
      start_date: dateRange[0],
      end_date: dateRange[1],
      bbox: boundingBox?.toString(),
      default_date: (!dateRange[0] && !dateRange[1]),
      default_bbox: !boundingBox
    };
    dispatch(setEventParams(eventParams))
    dispatch(getAllEventAlerts(eventParams, true));
  }

  const getAlertsByArea = () => {
    setBoundingBox(getBoundingBox(midPoint, currentZoomLevel));
  }

  const handleDateRangePicker = (dates) => {
    let from = moment(dates[0]).format('YYYY-MM-DD');
    let to = moment(dates[1]).format('YYYY-MM-DD');
    setDateRange([from, to]);
  }
  const clearDates = () => {
    setDateRange([]);
  }

  const handleResetAOI = useCallback(() => {
    setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel))
  }, []);

  const hideTooltip = (e) => {
    if (e && e.viewState) {
      setMidPoint([e.viewState.longitude, e.viewState.latitude]);
      setCurrentZoomLevel(e.viewState.zoom);
    }
    setHoverInfo({});
  };

  const setSelectedAlert = (id, isEdit) => {
    if (id) {
      if (id === alertId) {
        hideTooltip();
      }
      setAlertId(id);
      dispatch(getEventInfo(id))
      let clonedAlerts = _.cloneDeep(filteredAlerts);
      let selectedAlert = _.find(clonedAlerts, { id });
      selectedAlert.isSelected = true;
      !_.isEqual(viewState.midPoint, selectedAlert.center) ?
        setViewState(getViewState(selectedAlert.center, currentZoomLevel, selectedAlert, setHoverInfo, isEdit))
        : setHoverInfo({ object: selectedAlert, coordinate: selectedAlert.center, isEdit });
      setIconLayer(getIconLayer(clonedAlerts, MAP_TYPES.EVENTS));
    } else {
      setAlertId(undefined);
      setIconLayer(getIconLayer(filteredAlerts, MAP_TYPES.EVENTS));
    }
  }

  return (
    <div className='page-content'>
      <div className='mx-2 sign-up-aoi-map-bg'>
        <Row>
          <Col xl={5} className='d-flex justify-content-between'>
            <p className='align-self-baseline alert-title'>{t('Events', { ns: 'common' })}
              <button
                type="button"
                className="btn float-end mt-1 py-0 px-1"
                aria-label='refresh-events'
                onClick={() => {
                  setFilteredAlerts(alerts);
                }}
              >
                <i className="mdi mdi-sync"></i>
              </button>
            </p>
            <Button color='link'
              onClick={handleResetAOI} className='align-self-baseline pe-0'>
              {t('default-aoi')}</Button>
          </Col>
          <Col xl={7} className='d-flex justify-content-end'>
            <DateComponent setDates={handleDateRangePicker} clearDates={clearDates} />
          </Col>
        </Row>
        <Row>
          <Col xl={5}>
            <SortSection
              setAlertId={setAlertId}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              setAlertSource={setAlertSource}
              filteredAlerts={filteredAlerts}
              setFilterdAlerts={setFilteredAlerts}
              status={status}
              setStatus={setStatus}
            />
            <Row>
              <Col xl={12} className='px-3'>
                <EventList
                  alertId={alertId}
                  setAlertId={setAlertId}
                  filteredAlerts={filteredAlerts}
                  paginatedAlerts={paginatedAlerts}
                  currentPage={currentPage}
                  midPoint={midPoint}
                  zoomLevel={currentZoomLevel}
                  setMidpoint={setMidPoint}
                  setZoomLevel={setCurrentZoomLevel}
                  setHoverInfo={setHoverInfo}
                  setCurrentPage={setCurrentPage}
                  setIconLayer={setIconLayer}
                  setPaginatedAlerts={setPaginatedAlerts}
                  setSelectedAlert={setSelectedAlert}
                />
              </Col>
            </Row>
          </Col>
          <Col xl={7} className='mx-auto'>
            <MapSection
              viewState={viewState}
              setViewState={setViewState}
              hoverInfo={hoverInfo}
              iconLayer={iconLayer}
              setHoverInfo={setHoverInfo}
              paginatedAlerts={paginatedAlerts}
              currentPage={currentPage}
              midPoint={midPoint}
              zoomLevel={currentZoomLevel}
              setMidpoint={setMidPoint}
              setZoomLevel={setCurrentZoomLevel}
              setCurrentPage={setCurrentPage}
              setAlertId={setAlertId}
              setSelectedAlert={setSelectedAlert}
              getAlertsByArea={getAlertsByArea}
            />
          </Col>
        </Row>
      </div>
    </div >
  );
}

EventAlerts.propTypes = {
  t: PropTypes.any,
}

export default withTranslation(['common'])(EventAlerts);
