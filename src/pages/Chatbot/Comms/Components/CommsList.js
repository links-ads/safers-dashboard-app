import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Row } from 'reactstrap';

import { useMap } from 'components/BaseMap/MapContext';
import PaginationWrapper from 'components/Pagination';
import { allCommsSelector, filteredCommsSelector } from 'store/comms.slice';

import Comm from './Comm';

const CommsList = ({ selectedComm, setSelectedComm }) => {
  const { updateViewState } = useMap();

  const allComms = useSelector(allCommsSelector);
  const filteredComms = useSelector(filteredCommsSelector);

  const [pageData, setPageData] = useState([]);

  const commList = filteredComms ?? allComms;

  // Get the index, then divide that by 4 and ceil it, gets the page.
  let selectedIndex = 1;
  if (selectedComm) {
    selectedIndex = commList.findIndex(comm => comm.id === selectedComm.id);
  }
  const pageNo = Math.ceil((selectedIndex + 1) / 4);

  const selectComm = comm => {
    if (comm) {
      setSelectedComm(comm);

      updateViewState({
        longitude: comm.location[0],
        latitude: comm.location[1],
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
        {pageData.map(comm => (
          <Comm
            key={comm.id}
            comm={comm}
            selectedComm={selectedComm}
            selectComm={selectComm}
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
  selectedComm: PropTypes.any,
  setSelectedComm: PropTypes.func,
};

export default CommsList;
