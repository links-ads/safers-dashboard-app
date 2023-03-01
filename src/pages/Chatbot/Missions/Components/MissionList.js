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

  const allMissions = useSelector(allMissionsSelector);
  const filteredMissions = useSelector(filteredMissionsSelector);

  const [pageData, setPageData] = useState([]);

  const dispatch = useDispatch();

  const missionList = filteredMissions ?? allMissions;

  // Get the index, then divide that by 4 and ceil it, gets the page.
  let selectedIndex = 1;
  if (missionId) {
    selectedIndex = missionList.findIndex(mission => mission.id === missionId);
  }

  const pageNo = Math.ceil((selectedIndex + 1) / 4);

  const setSelectedMission = id => {
    if (id) {
      setMissionId(id);
      let copyMissionList = _.cloneDeep(missionList);
      let selectedMission = _.find(copyMissionList, { id });
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
  missionId: PropTypes.any,
  setMissionId: PropTypes.func,
};

export default MissionList;
