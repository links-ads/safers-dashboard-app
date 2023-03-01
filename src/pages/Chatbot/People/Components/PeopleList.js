import React, { useState } from 'react';

import _ from 'lodash';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Row } from 'reactstrap';

import { useMap } from 'components/BaseMap/MapContext';
import PaginationWrapper from 'components/Pagination';
import { getViewState } from 'helpers/mapHelper';
import { allPeopleSelector, filteredPeopleSelector } from 'store/people.slice';

import People from './People';

const PeopleList = ({ peopleId, setPeopleId }) => {
  const { viewState, setViewState } = useMap();

  const allPeople = useSelector(allPeopleSelector);
  const filteredPeople = useSelector(filteredPeopleSelector);
  const [pageData, setPageData] = useState([]);

  const peopleList = filteredPeople ?? allPeople;

  // Get the index, then divide that by 4 and ceil it, gets the page.
  let selectedIndex = 1;
  if (peopleId) {
    selectedIndex = peopleList.findIndex(person => person.id === peopleId);
  }
  const pageNo = Math.ceil((selectedIndex + 1) / 4);

  const setSelectedPeople = people_id => {
    if (people_id) {
      setPeopleId(people_id);
      let copyPeopleList = _.cloneDeep(peopleList);
      let selectedPeople = _.find(copyPeopleList, { id: people_id });
      selectedPeople.isSelected = true;
      setViewState(getViewState(selectedPeople.location, viewState.zoom));
    } else {
      setPeopleId(undefined);
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
        {pageData.map(people => (
          <People
            key={people.id}
            card={people}
            peopleId={peopleId}
            setSelectedPeople={setSelectedPeople}
          />
        ))}
      </Row>
      <Row className="text-center">
        <PaginationWrapper
          page={pageNo}
          pageSize={4}
          list={peopleList}
          setPageData={updatePage}
        />
      </Row>
    </>
  );
};

PeopleList.propTypes = {
  peopleId: PropTypes.any,
  setPeopleId: PropTypes.func,
};

export default PeopleList;
