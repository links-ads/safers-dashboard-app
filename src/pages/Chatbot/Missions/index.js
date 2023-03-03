import React, { useEffect, useState, useCallback } from 'react';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button } from 'reactstrap';

import { useMap } from 'components/BaseMap/MapContext';
import { MAP_TYPES } from 'constants/common';
import useInterval from 'customHooks/useInterval';
import { getIconLayer } from 'helpers/mapHelper';
import { dateRangeSelector } from 'store/common.slice';
import {
  fetchMissions,
  allMissionsSelector,
  filteredMissionsSelector,
} from 'store/missions.slice';
import { defaultAoiSelector } from 'store/user.slice';

import CreateMission from './Components/create-mission/CreateMission';
import MissionList from './Components/MissionList';
import SortSection from './Components/SortSection';
import MapSection from '../Components/FormMapSection';

const Missions = ({ pollingFrequency }) => {
  const { deckRef, updateViewState } = useMap();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const defaultAoi = useSelector(defaultAoiSelector);
  const allMissions = useSelector(allMissionsSelector);
  const filteredMissions = useSelector(filteredMissionsSelector);
  const dateRange = useSelector(dateRangeSelector);

  const [selectedMission, setSelectedMission] = useState(undefined);
  const [iconLayer, setIconLayer] = useState(undefined);
  const [sortOrder, setSortOrder] = useState('desc');
  const [status, setStatus] = useState('');
  const [boundingBox, setBoundingBox] = useState(undefined);
  const [coordinates, setCoordinates] = useState(null);
  const [togglePolygonMap, setTogglePolygonMap] = useState(false);
  const [toggleCreateNewMission, setToggleCreateNewMission] = useState(false);
  const [missionParams, setMissionParams] = useState({});

  const missionsList = filteredMissions ?? allMissions;

  useEffect(() => {
    setMissionParams(previous => {
      const options = {
        ...previous,
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

      const feFilters = {
        sortOrder,
        status,
      };

      dispatch(fetchMissions({ options, feFilters }));

      return options;
    });
  }, [boundingBox, dateRange, dispatch, sortOrder, status]);

  useEffect(() => {
    setIconLayer(
      getIconLayer(missionsList, MAP_TYPES.MISSIONS, 'target', {
        id: selectedMission?.id,
      }),
    );
  }, [missionsList, selectedMission?.id]);

  useInterval(
    () => {
      dispatch(
        fetchMissions({
          options: missionParams,
          feFilters: {
            sortOrder,
            status,
          },
          isPolling: true,
        }),
      );
    },
    pollingFrequency,
    [missionParams],
  );

  const getMissionsByArea = () =>
    setBoundingBox(deckRef.current.deck.viewManager._viewports[0].getBounds());

  const handleResetAOI = useCallback(
    () =>
      updateViewState({
        longitude: defaultAoi.features[0].properties.midPoint[0],
        latitude: defaultAoi.features[0].properties.midPoint[1],
        zoom: defaultAoi.features[0].properties.zoomLevel,
      }),
    [defaultAoi.features, updateViewState],
  );

  const onClick = info => {
    const id = info?.object?.properties.id;

    if (id) {
      const mission = missionsList.find(m => m.id === id);

      if (mission) {
        setSelectedMission(mission);
      }
    }
  };

  const onCancel = () => {
    setTogglePolygonMap(false);
    setToggleCreateNewMission(false);
    setCoordinates('');
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
        {!toggleCreateNewMission ? (
          <Col xl={5}>
            <SortSection
              status={status}
              setStatus={setStatus}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              setTogglePolygonMap={() => {
                setTogglePolygonMap(true);
                setToggleCreateNewMission(true);
              }}
            />

            <Row>
              <Col xl={12} className="px-3">
                <MissionList
                  selectedMission={selectedMission}
                  setSelectedMission={setSelectedMission}
                />
              </Col>
            </Row>
          </Col>
        ) : (
          <Col xl={5}>
            <CreateMission
              onCancel={onCancel}
              coordinates={coordinates}
              setCoordinates={setCoordinates}
            />
          </Col>
        )}

        <Col xl={7} className="mx-auto">
          <MapSection
            iconLayer={iconLayer}
            getInfoByArea={getMissionsByArea}
            coordinates={coordinates}
            setCoordinates={setCoordinates}
            togglePolygonMap={togglePolygonMap}
            onClick={onClick}
            clearMap={() => setCoordinates([])}
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
