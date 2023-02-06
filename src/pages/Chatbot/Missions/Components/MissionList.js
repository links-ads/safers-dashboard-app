import React, { useState } from 'react';

import _ from 'lodash';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Row } from 'reactstrap';

import Mission from './Mission';
import PaginationWrapper from '../../../../components/Pagination';
import { MAP_TYPES } from '../../../../constants/common';
import { getIconLayer, getViewState } from '../../../../helpers/mapHelper';
import { setFavorite } from '../../../../store/missions/action';

const MissionList = ({
  missionId,
  currentZoomLevel,
  setViewState,
  setMissionId,
  setIconLayer,
}) => {
  const { allMissions: OrgMissionList, filteredMissions } = useSelector(
    state => state.missions,
  );
  const [pageData, setPageData] = useState([]);
  const dispatch = useDispatch();

  const allMissions = filteredMissions || OrgMissionList;

  const setFavoriteFlag = id => {
    let selectedMission = _.find(pageData, { id });
    selectedMission.isFavorite = !selectedMission.isFavorite;
    dispatch(setFavorite(id, selectedMission.isFavorite));
  };

  const setSelectedMission = mission_id => {
    if (mission_id) {
      setMissionId(mission_id);
      let missionList = _.cloneDeep(allMissions);
      let selectedMission = _.find(missionList, { id: mission_id });
      selectedMission.isSelected = true;
      setIconLayer(
        getIconLayer(
          missionList,
          MAP_TYPES.MISSIONS,
          'target',
          dispatch,
          setViewState,
          selectedMission,
        ),
      );
      setViewState(getViewState(selectedMission.location, currentZoomLevel));
    } else {
      setMissionId(undefined);
      setIconLayer(
        getIconLayer(
          allMissions,
          MAP_TYPES.MISSIONS,
          'target',
          dispatch,
          setViewState,
          {},
        ),
      );
    }
  };
  const updatePage = data => {
    setMissionId(undefined);
    setIconLayer(
      getIconLayer(
        data,
        MAP_TYPES.MISSIONS,
        'target',
        dispatch,
        setViewState,
        {},
      ),
    );
    setPageData(data);
  };

  return (
    <>
      <Row>
        {pageData.map(mission => (
          <Mission
            key={mission.id}
            card={mission}
            missionId={missionId}
            setSelectedMission={setSelectedMission}
            setFavorite={setFavoriteFlag}
          />
        ))}
      </Row>
      <Row className="text-center">
        <PaginationWrapper
          pageSize={4}
          list={allMissions}
          setPageData={updatePage}
        />
      </Row>
    </>
  );
};

MissionList.propTypes = {
  missionId: PropTypes.any,
  currentZoomLevel: PropTypes.any,
  setViewState: PropTypes.func,
  setMissionId: PropTypes.func,
  setIconLayer: PropTypes.func,
};

export default MissionList;
