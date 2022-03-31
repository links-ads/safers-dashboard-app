import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, Row, Col, CardText, CardSubtitle } from 'reactstrap';
import MapComponent from '../Components/Map';



const InfoContainer = () => {
  const weatherStats = useSelector(state => state.dashboard.weatherStats);
  // eslint-disable-next-line no-unused-vars
  const [active, setActive] = useState(1)
  return (
    <>
      <Col md={7}>
        <MapComponent weatherStats={weatherStats}/>
      </Col>
      <Col md={5} sm={12} xs={12} className='d-flex'>
        <Card className='card-weather px-0' >
          <Col className='mx-auto mt-3' md={11}>
            <Row className='mb-2 '>
              <span className='weather-text'>Important Info</span>
            </Row>
          </Col>
          <Col className='mx-auto mt-3 mb-0' md={10}>
            <Row>
              <Col className='my-2'>Location</Col>
              
            </Row>
            <Row>
              <Col md={1} className='d-flex'>
                <i className='fa fa-map-marker my-auto'></i>
              </Col>
              <Col md={10}>
                <CardSubtitle className="my-auto">
                  Filoktiti Oikonomidou, Athens 114 76, Greece
                </CardSubtitle>
              </Col>
            </Row>
          </Col>
          <hr></hr>
          <Col className='mx-auto' md={10}>
            <Row>
              <Col className='my-2'>Date of Event</Col>
            </Row>
            <Row >
              <Col md={1} className='d-flex'>
                <i className='fa fa-calendar my-auto'></i>
              </Col>
              <Col md={10}>
                <CardSubtitle className="my-auto">
              Start: Dec 11, 2021, 16:00 <br></br>
              End: not set
                </CardSubtitle>
              </Col>
            </Row>
          </Col>
          <hr></hr>
          <Col className='mx-auto' md={10}>
            <Row>
              <Col className='my-2'>Damages</Col>
            </Row>
            <Row >
              <Col md={1} className='d-flex'>
                <i className='fa fa-user my-auto'></i>
              </Col>
              <Col md={10}>
                <CardSubtitle className="my-auto">
                  People Affected : 120
                </CardSubtitle>
              </Col>
            </Row>
          </Col>

          <Col className='mx-auto my-2' md={10}>
            <Row >
              <Col md={1} className='d-flex'>
                <i className='fa fa-ambulance my-auto'></i>
              </Col>
              <Col md={10}>
                <CardSubtitle className="my-auto">
                  Casualties: not recorded
                </CardSubtitle>
              </Col>
            </Row>
          </Col>

          <Col className='mx-auto ' md={10}>
            <Row >
              <Col md={1} className='d-flex'>
                <i className='fas fa-euro-sign my-auto'></i>
              </Col>
              <Col md={10}>
                <CardSubtitle className="my-auto">
                Estimated damage: not registered
                </CardSubtitle>
              </Col>
            </Row>
          </Col>

          <Col className='mx-auto my-2' md={10}>
            <Row className='mt-1'>
              <Col md={2} >
                <CardText className='mb-2 px-0'>
                  <span className='mb-5'>Info: </span>
                </CardText>
              </Col>
              <Col>
                <CardText>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&#39;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled
                </CardText>
              </Col>
            </Row>
            <Row>
              <Col md={2}>
                <CardText className='mb-2'>
                  <small className="font-italic">
                  Source:
                  </small>
                </CardText>
              </Col>
              <Col>
                <CardText className='mb-2'>
                  <small className="font-italic">
                  source 1</small>
                </CardText>
              </Col>
            </Row>
          </Col>
        </Card>
      </Col>
    </>     
  );
}

export default InfoContainer;
