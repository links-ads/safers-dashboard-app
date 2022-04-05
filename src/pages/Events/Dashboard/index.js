import React, { useEffect }  from 'react';
import { Container, Row  } from 'reactstrap';
import SearchContainer from './Containers/SearchContainer';
import TwitterContainer from './Containers/TwitterContainer';
import InSituContainer from './Containers/InSituContainer';
import MapDataLayer from './Containers/MapDataLayer';
import InfoContainer from './Containers/InfoContainer';
import { useDispatch } from 'react-redux';
import { getAllEventAlerts } from '../../../store/events/action';

const EventDashboard = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllEventAlerts(
      
    ));
  }, []);

  return (
    <div className="page-content">
      <Container fluid >
        
        <SearchContainer/>

        <Row>
          <InfoContainer/>
        </Row>

        <Row>
          <MapDataLayer/>
        </Row>
      
        <Row>
          <InSituContainer/>
        </Row>

        <Row>
          <TwitterContainer/>
        </Row>
        
      </Container>
    </div>
  );
}

export default EventDashboard;
