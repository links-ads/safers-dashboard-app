import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Row, Col, Badge } from 'reactstrap';
import { getWeatherVariables } from '../../../store/dashboard/action';



const WeatherVariablesContainer = () => {
  const dispatch = useDispatch();
  const weatherVariables = useSelector(state => state.dashboard.weatherVariables);

  useEffect(() => {
    dispatch(getWeatherVariables())
  }, []);
  return (
    <>
      <Col md={12} className='d-flex'>
        <Card className='card-weather' >
          <Row className='mb-2'>
            <span className='weather-text'>Weather Variables on an hourly basis</span>
          </Row>
          <Row>
            <Col>
              <Badge className='badge-temp px-2 pressure'>
                <i className='fa fa-solid fa-wind p-1'></i><span>Wind</span>
              </Badge>
            </Col>
            <Col>
              <Badge className='badge-temp px-2 pressure'>
                <i className='bx bxs-cloud-rain p-1'></i><span>Relative Humidity</span>
              </Badge>
            </Col>
            <Col></Col>
          </Row>
          <Row className='h-100'>
            {weatherVariables.map((weatherVariable, index) => {
              return( 
                <Col key={index}>
                  <Card className='card-temperature h-100 flex-column text-center '>
                    <Col className="p-2 "><span>{weatherVariable.time}</span></Col>
                    <Col className="p-2 ">{weatherVariable.wind}m/s</Col>
                    <Col className="p-2">{weatherVariable.humidity}%</Col>
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
