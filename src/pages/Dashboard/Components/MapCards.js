// import BaseMap from '../../layout/BaseMap/BaseMap';
import React from 'react';
import { useSelector } from 'react-redux';
import {  Card, CardHeader, CardBody, CardFooter, Col } from 'reactstrap';

const MapCards= () => {
  const weatherStats = useSelector(state => state.dashboard.weatherStats);
  return (
    <Col md={7} className='position-absolute bottom-0 end-0 me-2'>
      <Card className='map-overlay-card px-2 pb-1'>
        <CardHeader>
              Atmosphere Instability Index
        </CardHeader>
        <CardBody className='mx-auto'>
          {weatherStats.mapData ? weatherStats.mapData.atm_instability_index : '-'}
        </CardBody>
        <CardFooter>
        </CardFooter>
      </Card>
      <Card className='map-overlay-card px-2 pb-2'>
        <CardHeader>
              Fire Weather Index
        </CardHeader>
        <CardBody className='mx-auto'>
          {weatherStats.mapData ? weatherStats.mapData.fire_weather_index : '-'}
        </CardBody>
        <CardFooter>
        </CardFooter>
      </Card>
    </Col>
  )
}

export default MapCards;