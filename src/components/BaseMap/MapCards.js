// import BaseMap from '../../layout/BaseMap/BaseMap';
import React from 'react';

import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Card, CardHeader, CardBody, Col } from 'reactstrap';

import { weatherStatsSelector } from 'store/dashboard/dashboard.slice';
//i18n

const MapCards = props => {
  const weatherStats = useSelector(weatherStatsSelector);
  return (
    <Col xs={5} className="position-absolute bottom-0 end-0 me-2">
      <Card className="map-overlay-card pb-1">
        <CardHeader className="my-2 px-1 py-0 text-center">
          {props.t('Atmosphere Instability Index')}
        </CardHeader>
        <CardBody className="mx-auto mb-3">
          <span>
            {weatherStats.mapData
              ? weatherStats.mapData.atm_instability_index
              : '-'}
          </span>
        </CardBody>
      </Card>
      <Card className="map-overlay-card pb-1">
        <CardHeader className="my-2 px-1 py-0 text-center">
          {props.t('Fire Weather Index')}
        </CardHeader>
        <CardBody className="mx-auto mb-3 font-weight-normal">
          {weatherStats.mapData ? weatherStats.mapData.fire_weather_index : '-'}
        </CardBody>
      </Card>
    </Col>
  );
};

MapCards.propTypes = {
  t: PropTypes.any,
};

export default withTranslation(['common'])(MapCards);
