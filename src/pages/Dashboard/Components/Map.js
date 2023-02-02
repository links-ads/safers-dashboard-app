import React from 'react';

import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Card, Row } from 'reactstrap';

import { MAP_TYPES } from 'constants/common';

import BaseMap from '../../../components/BaseMap/BaseMap';
import {
  getPolygonLayer,
  getViewState,
  getEventIconLayer,
  getIconLayer,
} from '../../../helpers/mapHelper';

const MapComponent = ({ eventList, orgPplList }) => {
  const objAoi = useSelector(state => state.user.defaultAoi);
  const polygonLayer = getPolygonLayer(objAoi);
  // console.log('EVENT LIST: ', eventList);
  const iconLayer = getEventIconLayer(eventList);
  console.log('PEOPLE LAYER DATA: ', orgPplList);
  const peopleLayer = getIconLayer(
    orgPplList.filter(item => item.geometry.coordinates.length > 0),
    MAP_TYPES.people,
  );
  // console.log('PEOPLE LAYER: ', peopleLayer);
  const viewState = getViewState(
    objAoi.features[0].properties.midPoint,
    objAoi.features[0].properties.zoomLevel,
  );

  return (
    <Card className="map-card">
      <Row style={{ height: 550 }} className="mx-auto">
        <BaseMap
          // layers={[polygonLayer, iconLayer]}
          layers={[polygonLayer, iconLayer, peopleLayer]}
          initialViewState={viewState}
          screenControlPosition="top-right"
          navControlPosition="bottom-right"
        />
      </Row>
    </Card>
  );
};

MapComponent.propTypes = {
  eventList: PropTypes.arrayOf(PropTypes.any),
};

export default MapComponent;
