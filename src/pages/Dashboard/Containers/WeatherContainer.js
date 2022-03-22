import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Row, Col, Badge } from 'reactstrap';
import { getWeatherStats } from '../../../store/dashboard/action';
import MapComponent from '../Components/Map';



const WeatherContainer = () => {
  const dispatch = useDispatch();
  const weatherStats = useSelector(state => state.dashboard.weatherStats);

  useEffect(() => {
    dispatch(getWeatherStats())
  }, []);
  return (
    <>
      <Col md={5}>
        <MapComponent weatherStats={weatherStats}/>
      </Col>
      <Col md={7} className='d-flex'>
        <Card className='card-weather' >
          <Row className='mb-2'>
            <span className='weather-text'>Weather Forecast</span>
          </Row>
          <Row>
            <Col>
              <Badge className='badge-temp px-2 temp'>
                <i className='fa fa-thermometer p-1'></i><span>Temperature</span>
              </Badge>
            </Col>
            <Col>
              <Badge className='badge-temp px-2 pressure'>
                <i className='fa fa-solid fa-wind p-1'></i><span>Atm.Pressure</span>
              </Badge>
            </Col>
            <Col>
              <Badge className='badge-temp px-2 pressure'>
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
            <Col >
              <Card className='card-temperature h-100 flex-column text-center '>
                <Col className="p-2 pressure-text"><span>{weatherStats.tempVariables ? weatherStats.tempVariables.temp.pressure : '-'}H</span></Col>
                <Col className="p-2 degrees-text"><span>{weatherStats.tempVariables ? weatherStats.tempVariables.temp.pressure : '-'}°</span></Col>
                <Col className="p-2"></Col>
              </Card>
            </Col>
            <Col>
              <Card className='card-temperature h-100 flex-column text-center'>
                <Col className="p-2 pressure-text"><span>{weatherStats.tempVariables ? weatherStats.tempVariables.atm.pressure : '-'}H</span></Col>
                <Col className="p-2 degrees-text"><span>{weatherStats.tempVariables ? weatherStats.tempVariables.atm.pressure : '-'}°</span></Col>
                <Col className="p-2"></Col>
              </Card>
            </Col>
            <Col>
              <Card className='card-temperature h-100 flex-column justify-content-between text-center'>
                <Col className="p-2 pressure-text"><span>{weatherStats.tempVariables ? weatherStats.tempVariables.precipitation.pressure : '-'}H</span></Col>
                <Col className="p-2 degrees-text"><span>{weatherStats.tempVariables ? weatherStats.tempVariables.precipitation.pressure : '-'}°</span></Col>
                <Col className="p-2"></Col>
              </Card>
            </Col>
          </Row>
        </Card>
      </Col>
    </>     
  );
}

export default WeatherContainer;
