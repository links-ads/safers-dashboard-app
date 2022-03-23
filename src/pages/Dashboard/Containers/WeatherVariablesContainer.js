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
            <div>
              <Badge className='badge-temp px-2 pressure me-3'>
                <i className='fa fa-solid fa-wind p-1'></i><span>Wind</span>
              </Badge>
              <Badge className='badge-temp px-2 pressure'>
                <i className='bx bxs-cloud-rain p-1'></i><span>Relative Humidity</span>
              </Badge>
            </div>
          </Row>
          <Row >
            {weatherVariables.map((weatherVariable, index) => {
              return( 
                <Col className="my-2 col-md" sm={3} xs={6} key={index}>
                  <Card className='weather-variables-card flex-column text-center '>
                    <Col className="p-2 "><span>{weatherVariable.time}</span></Col>
                    <Col className="p-2 "><span>{weatherVariable.wind}m/s</span></Col>
                    <Col className="p-2"><span>{weatherVariable.humidity}%</span></Col>
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
