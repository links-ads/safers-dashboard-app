import React, { useState } from 'react';

import _ from 'lodash';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Row } from 'reactstrap';

import { useMap } from 'components/BaseMap/MapContext';
import PaginationWrapper from 'components/Pagination';
import { getViewState } from 'helpers/mapHelper';
import {
  setMissionFavorite,
  allMissionsSelector,
  filteredMissionsSelector,
} from 'store/missions.slice';

import Mission from './Mission';

const MissionList = ({ missionId, setMissionId }) => {
  const { viewState, setViewState } = useMap();

  const orgMissionList = useSelector(allMissionsSelector);
  const filteredMissions = useSelector(filteredMissionsSelector);
  const [pageData, setPageData] = useState([]);

  const dispatch = useDispatch();

  const allMissions = filteredMissions ?? orgMissionList;

  // Get the index, then divide that by 4 and ceil it, gets the page.
  let selectedIndex = 1;
  if (missionId) {
    selectedIndex = allMissions.findIndex(mission => mission.id === missionId);
  }

  const pageNo = Math.ceil((selectedIndex + 1) / 4);

  const setFavoriteFlag = id => {
    let selectedMission = _.find(pageData, { id });
    selectedMission.isFavorite = !selectedMission.isFavorite;
    dispatch(
      setMissionFavorite({ id, isFavorite: selectedMission.isFavorite }),
    );
  };

  const setSelectedMission = mission_id => {
    if (mission_id) {
      setMissionId(mission_id);
      let missionList = _.cloneDeep(allMissions);
      let selectedMission = _.find(missionList, { id: mission_id });
      selectedMission.isSelected = true;
      setViewState(getViewState(selectedMission.location, viewState.zoom));
    } else {
      setMissionId(undefined);
    }
  };
  const updatePage = data => {
    if (JSON.stringify(data) !== JSON.stringify(pageData)) {
      setPageData(data);
    }
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
          page={pageNo}
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
  setMissionId: PropTypes.func,
};

export default MissionList;
