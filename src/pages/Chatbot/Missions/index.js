import React, { useEffect, useState, useCallback } from 'react';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button } from 'reactstrap';
import toastr from 'toastr';

import 'toastr/build/toastr.min.css';
import 'rc-pagination/assets/index.css';
import { useMap } from 'components/BaseMap/MapContext';
import { dateRangeSelector } from 'store/common/common.slice';
import {
  fetchMissions,
  resetMissionResponseState,
  allMissionsSelector,
  filteredMissionsSelector,
  missionsSuccessSelector,
} from 'store/missions/missions.slice';

import CreateMission from './Components/create-mission/CreateMission';
import MapSection from './Components/Map';
import MissionList from './Components/MissionList';
import SortSection from './Components/SortSection';
import { MAP_TYPES } from '../../../constants/common';
import useInterval from '../../../customHooks/useInterval';
import {
  getBoundingBox,
  getViewState,
  getIconLayer,
} from '../../../helpers/mapHelper';

const Missions = ({ pollingFrequency }) => {
  const { viewState, setViewState } = useMap();
  const defaultAoi = useSelector(state => state.user.defaultAoi);
  const orgMissionList = useSelector(allMissionsSelector);
  const filteredMissions = useSelector(filteredMissionsSelector);
  const success = useSelector(missionsSuccessSelector);
  const dateRange = useSelector(dateRangeSelector);

  const { t } = useTranslation();

  const [missionId, setMissionId] = useState(undefined);
  const [iconLayer, setIconLayer] = useState(undefined);
  const [sortOrder, setSortOrder] = useState('desc');
  const [missionStatus, setMissionStatus] = useState('');
  const [boundingBox, setBoundingBox] = useState(undefined);
  const [newWidth, setNewWidth] = useState(600);
  const [newHeight, setNewHeight] = useState(600);
  const [coordinates, setCoordinates] = useState(null);
  const [togglePolygonMap, setTogglePolygonMap] = useState(false);
  const [toggleCreateNewMission, setToggleCreateNewMission] = useState(false);
  const [missionParams, setMissionParams] = useState({});

  const dispatch = useDispatch();

  const allMissions = filteredMissions || orgMissionList;

  const loadAllMissions = () => {
    setMissionId(undefined);
    const params = {
      ...missionParams,
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

    setMissionParams(params);

    const feFilters = {
      order: sortOrder,
      status: missionStatus,
    };

    dispatch(fetchMissions({ options: params, feFilters }));
  };

  const onCancel = () => {
    setTogglePolygonMap(false);
    setToggleCreateNewMission(false);
    setCoordinates('');
    loadAllMissions();
  };

  useEffect(() => {
    loadAllMissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, boundingBox, dateRange]);

  useEffect(() => {
    if (success?.detail) {
      toastr.success(success.detail, '');
    }
    dispatch(resetMissionResponseState());
  }, [dispatch, success]);

  useEffect(() => {
    if (allMissions.length > 0) {
      setIconLayer(
        getIconLayer(
          allMissions,
          MAP_TYPES.MISSIONS,
          'target',
          dispatch,
          setViewState,
          { id: missionId },
        ),
      );
    }
  }, [allMissions, dispatch, missionId, setViewState]);

  useInterval(
    () => {
      dispatch(
        fetchMissions({
          options: missionParams,
          feFilters: {
            order: sortOrder,
            status: missionStatus,
          },
          isPolling: true,
        }),
      );
    },
    pollingFrequency,
    [missionParams],
  );

  const getMissionsByArea = () => {
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

  const onClick = info => {
    const { id } = info?.object?.properties ?? {};
    setMissionId(missionId === id ? undefined : id);
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
        {!toggleCreateNewMission && (
          <Col xl={5}>
            <SortSection
              t={t}
              missionStatus={missionStatus}
              sortOrder={sortOrder}
              setMissionStatus={setMissionStatus}
              setSortOrder={setSortOrder}
              setTogglePolygonMap={() => {
                setTogglePolygonMap(true);
                setToggleCreateNewMission(true);
              }}
            />
            <Row>
              <Col xl={12} className="px-3">
                <MissionList
                  missionId={missionId}
                  currentZoomLevel={viewState.zoom}
                  setViewState={setViewState}
                  setMissionId={setMissionId}
                  setIconLayer={setIconLayer}
                />
              </Col>
            </Row>
          </Col>
        )}
        {toggleCreateNewMission && (
          <Col xl={5}>
            <CreateMission
              onCancel={onCancel}
              t={t}
              coordinates={coordinates}
              setCoordinates={setCoordinates}
            />
          </Col>
        )}
        <Col xl={7} className="mx-auto">
          <MapSection
            iconLayer={iconLayer}
            getMissionsByArea={getMissionsByArea}
            setNewWidth={setNewWidth}
            setNewHeight={setNewHeight}
            setCoordinates={setCoordinates}
            togglePolygonMap={togglePolygonMap}
            coordinates={coordinates}
            onClick={onClick}
          />
        </Col>
      </Row>
    </div>
  );
};

Missions.propTypes = {
  pollingFrequency: PropTypes.number,
};

export default Missions;
