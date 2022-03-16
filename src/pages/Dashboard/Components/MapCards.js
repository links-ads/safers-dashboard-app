// import BaseMap from '../../layout/BaseMap/BaseMap';
import React from 'react';
import {  Card, CardHeader, CardBody, CardFooter, Col } from 'reactstrap';

const MapCards= () => {
  return (
    <Col md={7} className=' position-absolute bottom-0 end-0 me-2 z-index-2'>
      <Card className='map-overlay-card px-2 pb-1'>
        <CardHeader>
              Atmosphere Instability Index
        </CardHeader>
        <CardBody className='mx-auto'>
              27
        </CardBody>
        <CardFooter>
        </CardFooter>
      </Card>
      <Card className='map-overlay-card px-2 pb-2'>
        <CardHeader>
              Fire Weather Index
        </CardHeader>
        <CardBody className='mx-auto'>
              14
        </CardBody>
        <CardFooter>
        </CardFooter>
      </Card>
    </Col>
  )
}

export default MapCards;