import _ from 'lodash';
import React, { useState } from 'react';
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux';
import { Row } from 'reactstrap';
import { getViewState } from '../../../../helpers/mapHelper';
import PaginationWrapper from '../../../../components/Pagination';
import People from './People';
import { MAP_TYPES } from '../../../../constants/common';
import { getIconColorFromContext } from '../../../../helpers/mapHelper';
import { GeoJsonPinLayer } from '../../../../components/BaseMap/GeoJsonPinLayer';


const MAP_TYPE = 'people';

const PeopleList = ({ peopleId, currentZoomLevel, setViewState, setPeopleId, setIconLayer }) => {
  const { allPeople: OrgPeopleList, filteredPeople } = useSelector(state => { return state.people });
  const [pageData, setPageData] = useState([]);
  const dispatch = useDispatch();

  const getIconLayer = (alerts) => {
    const data = alerts?.map((alert) => {
      const {
        geometry,
        ...properties
      } = alert;
      return {
        type: 'Feature',
        properties: properties,
        geometry: geometry,
      };
    });

    return new GeoJsonPinLayer({
      data,
      dispatch,
      setViewState,
      getPosition: (feature) => feature.geometry.coordinates,
      getPinColor: feature => getIconColorFromContext(MAP_TYPES.PEOPLE,feature),
      icon: 'people',
      iconColor: '#ffffff',
      clusterIconSize: 35,
      getPinSize: () => 35,
      pinSize: 25,
      onGroupClick: true,
      onPointClick: true,
    });
  };

  const allPeople = filteredPeople || OrgPeopleList;

  const setSelectedPeople = (people_id) => {
    if (people_id) {
      setPeopleId(people_id);
      let peopleList = _.cloneDeep(allPeople);
      let selectedPeople = _.find(peopleList, { id:people_id });
      selectedPeople.isSelected = true;
      setIconLayer(getIconLayer(peopleList, MAP_TYPE));
      setViewState(getViewState(selectedPeople.location, currentZoomLevel))
    } else {
      setPeopleId(undefined);
      setIconLayer(getIconLayer(allPeople, MAP_TYPE));
    }
  }
  const updatePage = data => {
    setPeopleId(undefined);
    setIconLayer(getIconLayer(data, MAP_TYPE));
    setPageData(data);
  };

  return (
    <>
      <Row>
        {
          pageData.map((people) =>
            <People
              key={people.id}
              card={people}
              peopleId={peopleId}
              setSelectedPeople={setSelectedPeople}
            />)
        }
      </Row>
      <Row className='text-center'>
        <PaginationWrapper pageSize={4} list={allPeople} setPageData={updatePage} />
      </Row>
    </>)
}

PeopleList.propTypes = {
  peopleId: PropTypes.any,
  currentZoomLevel: PropTypes.any,
  setViewState: PropTypes.func,
  setPeopleId: PropTypes.func,
  setIconLayer: PropTypes.func,
}

export default PeopleList;
