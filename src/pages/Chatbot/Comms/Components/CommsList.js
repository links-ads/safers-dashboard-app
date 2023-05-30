import React, { useState } from 'react';

import _ from 'lodash';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Row } from 'reactstrap';

import { useMap } from 'components/BaseMap/MapContext';
import PaginationWrapper from 'components/Pagination';
import { getViewState } from 'helpers/mapHelper';
import { allCommsSelector, filteredCommsSelector } from 'store/comms.slice';

import Comm from './Comm';

const CommsList = ({ commID, setCommID }) => {
  const { viewState, setViewState } = useMap();

  const allComms = useSelector(allCommsSelector);
  const filteredComms = useSelector(filteredCommsSelector);

  const [pageData, setPageData] = useState([]);

  const commList = filteredComms ?? allComms;

  // Get the index, then divide that by 4 and ceil it, gets the page.
  let selectedIndex = 1;
  if (commID) {
    selectedIndex = commList.findIndex(comm => comm.id === commID);
  }
  const pageNo = Math.ceil((selectedIndex + 1) / 4);

  const setSelectedComm = id => {
    if (id) {
      setCommID(id);
      let copyCommList = _.cloneDeep(commList);
      let selectedComm = copyCommList.find(comm => comm.id === id);
      selectedComm.isSelected = true;
      setViewState(getViewState(selectedComm.location, viewState.zoom));
    } else {
      setCommID(undefined);
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
        {pageData.map(comm => (
          <Comm
            key={comm.id}
            card={comm}
            commID={commID}
            setSelectedComm={setSelectedComm}
          />
        ))}
      </Row>
      <Row className="text-center">
        <PaginationWrapper
          page={pageNo}
          pageSize={4}
          list={commList}
          setPageData={updatePage}
        />
      </Row>
    </>
  );
};

CommsList.propTypes = {
  commID: PropTypes.any,
  setCommID: PropTypes.func,
};

export default CommsList;
