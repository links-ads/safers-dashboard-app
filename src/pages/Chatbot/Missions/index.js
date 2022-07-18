import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button } from 'reactstrap';
import toastr from 'toastr';

import 'toastr/build/toastr.min.css'
import 'rc-pagination/assets/index.css';
import SortSection from './Components/SortSection';
import MapSection from './Components/Map';
import MissionList from './Components/MissionList';
import { getAllMissions, resetMissionResponseState } from '../../../store/missions/action';
import { getBoundingBox, getIconLayer, getViewState } from '../../../helpers/mapHelper';

import { useTranslation } from 'react-i18next';
import { MAP_TYPES } from '../../../constants/common';
import CreateMission from './Components/CreateMission';

const Missions = () => {
  const defaultAoi = useSelector(state => state.user.defaultAoi);
  const { allMissions: OrgMissionList, success, filteredMissions } = useSelector(state => state.missions);
  const dateRange = useSelector(state => state.common.dateRange);

  const { t } = useTranslation();

  const [missionId, setMissionId] = useState(undefined);
  const [viewState, setViewState] = useState(undefined);
  const [iconLayer, setIconLayer] = useState(undefined);
  const [sortOrder, setSortOrder] = useState(undefined);
  const [missionSource, setMissionSource] = useState(undefined);
  const [midPoint, setMidPoint] = useState([]);
  const [boundingBox, setBoundingBox] = useState(undefined);
  const [currentZoomLevel, setCurrentZoomLevel] = useState(undefined);
  const [newWidth, setNewWidth] = useState(600);
  const [newHeight, setNewHeight] = useState(600);
  const [coordinates, setCoordinates] = useState([]);
  const [togglePolygonMap, setTogglePolygonMap] = useState(false);
  const [toggleCreateNewMission, setToggleCreateNewMission] = useState(false);

  const dispatch = useDispatch();

  const allMissions = filteredMissions || OrgMissionList;

  useEffect(() => {
    const dateRangeParams = dateRange
      ? { start: dateRange[0], end: dateRange[1] }
      : {};

    setMissionId(undefined);
    const missionParams = {
      order: sortOrder ? sortOrder : '-date',
      source: missionSource ? missionSource : undefined,
      bbox: boundingBox?.toString(),
      default_date: false,
      default_bbox: !boundingBox,
      ...dateRangeParams
    };
    dispatch(getAllMissions(missionParams));
  }, [dateRange, missionSource, sortOrder, boundingBox])

  useEffect(() => {
    if (success?.detail) {
      toastr.success(success.detail, '');
    }
    dispatch(resetMissionResponseState());

  }, [success]);

  useEffect(() => {
    if (allMissions.length > 0) {
      setIconLayer(getIconLayer(allMissions, MAP_TYPES.MISSIONS));
      if (!viewState) {
        setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel))
      }
    }
  }, [allMissions]);

  const getMissionsByArea = () => {
    setBoundingBox(getBoundingBox(midPoint, currentZoomLevel, newWidth, newHeight));
  }

  const handleViewStateChange = (e) => {
    if (e && e.viewState) {
      setMidPoint([e.viewState.longitude, e.viewState.latitude]);
      setCurrentZoomLevel(e.viewState.zoom);
    }
  };

  const handleResetAOI = useCallback(() => {
    setBoundingBox(undefined);
    setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel))
  }, []);

  return (
    <div className='mx-2 sign-up-aoi-map-bg'>
      <Row>
        <Col xl={12} className='d-flex justify-content-between'>
          <p className='align-self-baseline alert-title'>{t(toggleCreateNewMission? 'Create New Message' : 'Missions List', { ns: 'missions' })}</p>
          <Button color='link'
            onClick={handleResetAOI} className='align-self-baseline pe-0'>
            {t('default-aoi', { ns: 'common' })}</Button>
        </Col>
      </Row >
      <Row>
        {!toggleCreateNewMission && <Col xl={5}>
          <SortSection
            missionSource={missionSource}
            sortOrder={sortOrder}
            setMissionSource={setMissionSource}
            setSortOrder={setSortOrder}
            setTogglePolygonMap={() => { setTogglePolygonMap(true); setToggleCreateNewMission(true); }}
          />
          <Row>
            <Col xl={12} className='px-3'>
              <MissionList
                missionId={missionId}
                currentZoomLevel={currentZoomLevel}
                setViewState={setViewState}
                setMissionId={setMissionId}
                setIconLayer={setIconLayer} />
            </Col>
          </Row>
        </Col>}
        {toggleCreateNewMission && <Col xl={5}>
          <CreateMission onCancel={()=>{
            setTogglePolygonMap(false);
            setToggleCreateNewMission(false);
            setCoordinates([]);
          }} coordinates={coordinates} />

        </Col>}
        <Col xl={7} className='mx-auto'>
          <MapSection
            viewState={viewState}
            iconLayer={iconLayer}
            setViewState={setViewState}
            getMissionsByArea={getMissionsByArea}
            handleViewStateChange={handleViewStateChange}
            setNewWidth={setNewWidth}
            setNewHeight={setNewHeight}
            setCoordinates={setCoordinates}
            togglePolygonMap={togglePolygonMap}
          />
        </Col>
      </Row>
    </div >
  );
}

export default Missions;
