import React, { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { Container, Row } from 'reactstrap';

import { fetchEvents } from 'store/events/events.slice';

import InfoContainer from './Containers/InfoContainer';
import InSituContainer from './Containers/InSituContainer';
import MapDataLayer from './Containers/MapDataLayer';
import SearchContainer from './Containers/SearchContainer';
import TwitterContainer from './Containers/TwitterContainer';

const EventDashboard = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  return (
    <div className="page-content">
      <Container fluid="true">
        <SearchContainer />

        <InfoContainer />

        <Row>
          <MapDataLayer />
        </Row>

        <InSituContainer />

        <Row>
          <TwitterContainer />
        </Row>
      </Container>
    </div>
  );
};

export default EventDashboard;
