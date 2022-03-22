import React  from 'react';
import { Container, Row  } from 'reactstrap';
import SearchContainer from './Containers/SearchContainer';
import TwitterContainer from './Containers/TwitterContainer';
import StatsContainer from './Containers/StatsContainer';
import WeatherContainer from './Containers/WeatherContainer';
import WeatherVariablesContainer from './Containers/WeatherVariablesContainer';
import InSituContainer from './Containers/InSituContainer';

const Dashboard = () => {

  return (
    <div className="page-content">
      <Container fluid className='p-0'>
        
        <SearchContainer/>
        
        <Row>
          <StatsContainer/>
        </Row>

        <Row>
          <WeatherContainer/>
        </Row>
        <Row className='weather-variables-card'>
          <WeatherVariablesContainer/>
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

export default Dashboard;
