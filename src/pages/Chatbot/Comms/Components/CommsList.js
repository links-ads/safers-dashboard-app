import React, { useState } from 'react';

import _ from 'lodash';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Row } from 'reactstrap';

import {
  allCommsSelector,
  filteredCommsSelector,
} from 'store/comms/comms.slice';

import Comm from './Comm';
import PaginationWrapper from '../../../../components/Pagination';
import { MAP_TYPES } from '../../../../constants/common';
import { getViewState, getIconLayer } from '../../../../helpers/mapHelper';

const CommsList = ({
  commID,
  currentZoomLevel,
  setViewState,
  setCommID,
  setIconLayer,
}) => {
  const allComms = useSelector(allCommsSelector);
  const filteredComms = useSelector(filteredCommsSelector);

  const [pageData, setPageData] = useState([]);
  const dispatch = useDispatch();

  const commList = filteredComms || allComms;

  const setSelectedComm = mission_id => {
    if (mission_id) {
      setCommID(mission_id);
      let copyCommList = _.cloneDeep(commList);
      let selectedComm = _.find(copyCommList, { id: mission_id });
      selectedComm.isSelected = true;
      setIconLayer(
        getIconLayer(
          copyCommList,
          MAP_TYPES.COMMUNICATIONS,
          'communications',
          dispatch,
          setViewState,
          selectedComm,
        ),
      );
      setViewState(getViewState(selectedComm.location, currentZoomLevel));
    } else {
      setCommID(undefined);
      setIconLayer(
        getIconLayer(
          commList,
          MAP_TYPES.COMMUNICATIONS,
          'communications',
          dispatch,
          setViewState,
          {},
        ),
      );
    }
  };
  const updatePage = data => {
    setCommID(undefined);
    setIconLayer(
      getIconLayer(
        data,
        MAP_TYPES.COMMUNICATIONS,
        'communications',
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
  currentZoomLevel: PropTypes.any,
  setViewState: PropTypes.func,
  setCommID: PropTypes.func,
  setIconLayer: PropTypes.func,
};

export default CommsList;
