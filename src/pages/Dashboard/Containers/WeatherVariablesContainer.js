import React from 'react';
import { useSelector } from 'react-redux';
import { Card, Row, Col, Badge } from 'reactstrap';

const WeatherVariablesContainer = () => {
  const weatherVariables = useSelector(state => state.dashboard.weatherVariables);

  return (
    <>
      <Col md={12} className='d-flex'>
        <Card className='card-weather' >
          <Row className='mb-2'>
            <span className='weather-text'>Weather Variables on an hourly basis</span>
          </Row>
          <Row>
            <div>
              <Badge className='badge-temp px-2 pressure me-3 background-none'>
                <i className='fa fa-solid fa-lg fa-wind p-1'></i><span>Wind</span>
              </Badge>
              <Badge className='badge-temp px-2 pressure'>
                <i className='bx bxs-cloud-rain fa-lg p-1'></i><span>Relative Humidity</span>
              </Badge>
            </div>
          </Row>
          <Row >
            {weatherVariables.map((weatherVariable, index) => {
              return( 
                <Col className="my-2 col-lg" sm={3} xs={6} md={3} key={index}>
                  <Card className='weather-variables-card flex-column text-center '>
                    <Col className="p-2 time-text"><span>{weatherVariable.time}</span></Col>
                    <Col className="p-2 body-text"><span>{weatherVariable.wind}m/s</span></Col>
                    <Col className="p-2 body-text"><span>{weatherVariable.humidity}%</span></Col>
                  </Card>
                </Col>)
            })}
                
          </Row>
        </Card>
      </Col>
    </>     
  );
}

export default WeatherVariablesContainer;
