import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, Row, Col, Badge } from 'reactstrap';
import MapComponent from '../Components/Map';



const WeatherContainer = () => {
  const weatherStats = useSelector(state => state.dashboard.weatherStats);
  // eslint-disable-next-line no-unused-vars
  const [active, setActive] = useState(1)

  const getDisplayText = (tab) => {
    if (active == 1) return weatherStats.forecast ? `${weatherStats.forecast.temp[tab]}°` : 'N/A'
    if (active == 2) return weatherStats.forecast ? `${weatherStats.forecast.pressure[tab]}°` : 'N/A'
    if (active == 3) return weatherStats.forecast ? `${weatherStats.forecast.precipitation[tab]}°` : 'N/A'
  }
  return (
    <Row role='weather-stats'>
      <Col md={6}>
        <MapComponent weatherStats={weatherStats}/>
      </Col>
      <Col md={6} sm={12} xs={12} className='d-flex'>
        <Card className='card-weather' >
          <Row className='mb-2'>
            <span className='weather-text'>Weather Forecast</span>
          </Row>
          <Row>
            <Col>
              <Badge className={'badge-temp px-2  my-2 ' + (active == 1 ? 'active-badge' : '')}
                onClick={() =>{setActive(1)}}>
                <i className='fa fa-thermometer p-1'></i><span>Temperature</span>
              </Badge>
            </Col>
            <Col>
              <Badge className={'badge-temp px-2  my-2 ' + (active == 2 ? 'active-badge' : '')}
                onClick={() =>{setActive(2)}}>
                <i className='fa fa-solid fa-lg fa-wind p-1'></i><span>Atm.Pressure</span>
              </Badge>
            </Col>
            <Col>
              <Badge data-testid='show-precipitation' className={'badge-temp px-2  my-2 ' + (active == 3 ? 'active-badge' : '')}
                onClick={() =>{setActive(3)}}>
                <i className='bx bxs-cloud-rain p-1'></i><span>Precipitation</span>
              </Badge>
            </Col>
            <Col></Col>
          </Row>
          <Row className='mt-2'>
            <span className="celcius-symbol">
                  C°
            </span>
          </Row>
          <Row className='h-100'>
            <Col xs={12} md={4} className="my-2">
              <Card className='card-temperature h-100 flex-column text-center '>
                <Col className="p-2 pressure-text"><span>24H</span></Col>
                <Col className="p-2 degrees-text"><span>{getDisplayText(0)}</span></Col>
                <Col className="p-2"></Col>
              </Card>
            </Col>
            <Col xs={12} md={4} className="my-2">
              <Card className='card-temperature h-100 flex-column text-center'>
                <Col className="p-2 pressure-text"><span>48H</span></Col>
                <Col className="p-2 degrees-text"><span>{getDisplayText(1)}</span></Col>
                <Col className="p-2"></Col>
              </Card>
            </Col>
            <Col xs={12} md={4} className="my-2">
              <Card className='card-temperature h-100 flex-column justify-content-between text-center'>
                <Col className="p-2 pressure-text"><span>72H</span></Col>
                <Col className="p-2 degrees-text"><span>{getDisplayText(2)}</span></Col>
                <Col className="p-2"></Col>
              </Card>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>     
  );
}

export default WeatherContainer;
