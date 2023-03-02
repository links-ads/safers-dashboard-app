import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Row } from 'reactstrap';

import { useMap } from 'components/BaseMap/MapContext';
import PaginationWrapper from 'components/Pagination';
import { PAGE_SIZE } from 'constants/common';
import { allPeopleSelector, filteredPeopleSelector } from 'store/people.slice';

import People from './People';

const PeopleList = ({ selectedPerson, setSelectedPerson }) => {
  const { updateViewState } = useMap();

  const allPeople = useSelector(allPeopleSelector);
  const filteredPeople = useSelector(filteredPeopleSelector);

  const [pageData, setPageData] = useState([]);

  const peopleList = filteredPeople ?? allPeople;

  // Get the index, then divide that by 4 and ceil it, gets the page.
  let selectedIndex = 1;
  if (selectedPerson) {
    selectedIndex = peopleList.findIndex(
      person => person.id === selectedPerson.id,
    );
  }
  const pageNo = Math.ceil((selectedIndex + 1) / 4);

  const selectPerson = person => {
    if (person) {
      setSelectedPerson(person);

      updateViewState({
        longitude: person.location[0],
        latitude: person.location[1],
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
        {pageData.map(person => (
          <People
            key={person.id}
            person={person}
            selectedPerson={selectedPerson}
            selectPerson={selectPerson}
          />
        ))}
      </Row>
      <Row className="text-center">
        <PaginationWrapper
          page={pageNo}
          pageSize={PAGE_SIZE}
          list={peopleList}
          setPageData={updatePage}
        />
      </Row>
    </>
  );
};

PeopleList.propTypes = {
  selectedPerson: PropTypes.any,
  setSelectedPerson: PropTypes.func,
};

export default PeopleList;
