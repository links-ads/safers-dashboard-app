import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Row } from 'reactstrap';

import { useMap } from 'components/BaseMap/MapContext';
import PaginationWrapper from 'components/Pagination';
import {
  allMissionsSelector,
  filteredMissionsSelector,
} from 'store/missions.slice';

import Mission from './Mission';

const MissionList = ({ selectedMission, setSelectedMission }) => {
  const { updateViewState } = useMap();

  const allMissions = useSelector(allMissionsSelector);
  const filteredMissions = useSelector(filteredMissionsSelector);

  const [pageData, setPageData] = useState([]);

  const missionList = filteredMissions ?? allMissions;

  // Get the index, then divide that by 4 and ceil it, gets the page.
  let selectedIndex = 1;
  if (selectedMission) {
    selectedIndex = missionList.findIndex(
      mission => mission.id === selectedMission?.id,
    );
  }

  const pageNo = Math.ceil((selectedIndex + 1) / 4);

  const selectMission = mission => {
    if (mission) {
      setSelectedMission(mission);

      updateViewState({
        longitude: mission.location[0],
        latitude: mission.location[1],
      });
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
            mission={mission}
            selectedMission={selectedMission}
            selectMission={selectMission}
          />
        ))}
      </Row>
      <Row className="text-center">
        <PaginationWrapper
          page={pageNo}
          pageSize={4}
          list={missionList}
          setPageData={updatePage}
        />
      </Row>
    </>
  );
};

MissionList.propTypes = {
  selectedMission: PropTypes.any,
  setSelectedMission: PropTypes.func,
};

export default MissionList;
