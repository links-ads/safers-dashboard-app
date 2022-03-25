// import BaseMap from '../../layout/BaseMap/BaseMap';
import React from 'react';
import { useSelector } from 'react-redux';
import {  Card, CardHeader, CardBody, CardFooter, Col } from 'reactstrap';

const MapCards= () => {
  const weatherStats = useSelector(state => state.dashboard.weatherStats);
  return (
    <Col xs={4} className='position-absolute bottom-0 end-0 me-2'>
      <Card className='map-overlay-card pb-1'>
        <CardHeader className='my-3 px-1 py-0 text-center'>
              Atmosphere Instability Index
        </CardHeader>
        <CardBody className='mx-auto'>
          {weatherStats.mapData ? weatherStats.mapData.atm_instability_index : '-'}
        </CardBody>
        <CardFooter>
        </CardFooter>
      </Card>
      <Card className='map-overlay-card pb-2'>
        <CardHeader className='my-3 px-1 py-0 text-center'>
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
