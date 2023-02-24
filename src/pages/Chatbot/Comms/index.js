import React, { useEffect, useState, useCallback } from 'react';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button } from 'reactstrap';
import toastr from 'toastr';

import { useMap } from 'components/BaseMap/MapContext';
import 'toastr/build/toastr.min.css';
import 'rc-pagination/assets/index.css';
import { dateRangeSelector } from 'store/common.slice';
import {
  fetchComms,
  resetCommsResponseState,
  allCommsSelector,
  commsSuccessSelector,
  filteredCommsSelector,
} from 'store/comms.slice';
import { defaultAoiSelector } from 'store/user.slice';

import CommsList from './Components/CommsList';
import CreateMessage from './Components/CreateMessage';
import MapSection from './Components/Map';
import SortSection from './Components/SortSection';
import { MAP_TYPES } from '../../../constants/common';
import useInterval from '../../../customHooks/useInterval';
import {
  getBoundingBox,
  getViewState,
  getIconLayer,
} from '../../../helpers/mapHelper';

const Comms = ({ pollingFrequency }) => {
  const { viewState, setViewState } = useMap();

  const defaultAoi = useSelector(defaultAoiSelector);
  const allComms = useSelector(allCommsSelector);
  const success = useSelector(commsSuccessSelector);
  const filteredComms = useSelector(filteredCommsSelector);
  const dateRange = useSelector(dateRangeSelector);

  const { t } = useTranslation();

  const [commID, setCommID] = useState(undefined);
  const [iconLayer, setIconLayer] = useState(undefined);
  const [sortOrder, setSortOrder] = useState('desc');
  const [commStatus, setcommStatus] = useState('');
  const [target, setTarget] = useState('');
  const [boundingBox, setBoundingBox] = useState(undefined);
  const [newWidth, setNewWidth] = useState(600);
  const [newHeight, setNewHeight] = useState(600);
  const [coordinates, setCoordinates] = useState(null);
  const [togglePolygonMap, setTogglePolygonMap] = useState(false);
  const [toggleCreateNewMessage, setToggleCreateNewMessage] = useState(false);
  const [commsParams, setCommsParams] = useState({});

  const dispatch = useDispatch();

  const allReports = filteredComms || allComms;

  const loadComms = () => {
    setCommID(undefined);
    const params = {
      ...commsParams,
      bbox: boundingBox?.toString(),
      default_date: false,
      default_bbox: !boundingBox,
      ...(dateRange
        ? {
            start: dateRange[0],
            end: dateRange[1],
          }
        : {}),
    };

    setCommsParams(params);
    dispatch(
      fetchComms({
        options: params,
        feFilters: { sortOrder, status: commStatus, target },
      }),
    );
  };

  useInterval(
    () => {
      dispatch(
        fetchComms({
          options: commsParams,
          feFilters: { sortOrder, status: commStatus, target },
          isPolling: true,
        }),
      );
    },
    pollingFrequency,
    [commsParams],
  );

  useEffect(() => {
    loadComms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, boundingBox]);

  useEffect(() => {
    if (success?.detail) {
      toastr.success(success.detail, '');
    }
    dispatch(resetCommsResponseState());
  }, [dispatch, success]);

  useEffect(() => {
    if (allReports.length > 0) {
      setIconLayer(
        getIconLayer(allReports, MAP_TYPES.COMMUNICATIONS, 'communications', {
          id: commID,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allReports, commID]);

  const getReportsByArea = () => {
    setBoundingBox(
      getBoundingBox(
        [viewState.longitude, viewState.latitude],
        viewState.zoom,
        newWidth,
        newHeight,
      ),
    );
  };

  const handleResetAOI = useCallback(() => {
    setBoundingBox(undefined);
    setViewState(
      getViewState(
        defaultAoi.features[0].properties.midPoint,
        defaultAoi.features[0].properties.zoomLevel,
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCancel = () => {
    setTogglePolygonMap(false);
    setToggleCreateNewMessage(false);
    setCoordinates('');
    loadComms();
  };

  const onClick = info => {
    const { id } = info?.object?.properties ?? {};
    setCommID(commID === id ? undefined : id);
  };

  return (
    <div className="mx-2">
      <Row className="justify-content-end mb-2">
        <Col xl={7}>
          <Button color="link" onClick={handleResetAOI} className="p-0">
            {t('default-aoi', { ns: 'common' })}
          </Button>
        </Col>
      </Row>
      <Row>
        {!toggleCreateNewMessage && (
          <Col xl={5}>
            <SortSection
              commStatus={commStatus}
              sortOrder={sortOrder}
              setcommStatus={setcommStatus}
              setSortOrder={setSortOrder}
              setTogglePolygonMap={() => {
                setTogglePolygonMap(true);
                setToggleCreateNewMessage(true);
              }}
              target={target}
              setTarget={setTarget}
            />
            <Row>
              <Col xl={12} className="px-3">
                <CommsList commID={commID} setCommID={setCommID} />
              </Col>
            </Row>
          </Col>
        )}
        {toggleCreateNewMessage && (
          <Col xl={5}>
            <CreateMessage
              onCancel={onCancel}
              coordinates={coordinates}
              setCoordinates={setCoordinates}
            />
          </Col>
        )}
        <Col xl={7} className="mx-auto">
          <MapSection
            iconLayer={iconLayer}
            getReportsByArea={getReportsByArea}
            setNewWidth={setNewWidth}
            setNewHeight={setNewHeight}
            setCoordinates={setCoordinates}
            togglePolygonMap={togglePolygonMap}
            coordinates={coordinates}
            onClick={onClick}
            clearMap={() => setCoordinates([])}
          />
        </Col>
      </Row>
    </div>
  );
};

Comms.propTypes = {
  pollingFrequency: PropTypes.number,
};

export default Comms;
