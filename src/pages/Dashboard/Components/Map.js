import React from 'react';
import { useSelector } from 'react-redux';
import { Card, Row } from 'reactstrap';
import BaseMap from '../../../components/BaseMap/BaseMap';
import { getPolygonLayer } from '../../../helpers/mapHelper';
import { getViewState } from '../../../helpers/mapHelper';
import PropTypes from 'prop-types';

const MapComponent = ({iconLayer}) => {
  const objAoi = useSelector(state => state.user.defaultAoi);
  const polygonLayer = getPolygonLayer(objAoi);
  const viewState = getViewState(objAoi.features[0].properties.midPoint, objAoi.features[0].properties.zoomLevel);

  return (
    <Card className='map-card'>
      <Row style={{ height: 550 }} className="mx-auto">
        <BaseMap 
          layers={[polygonLayer, iconLayer]} 
          initialViewState={viewState} 
          screenControlPosition="top-right"
          navControlPosition="bottom-right"
        />
      </Row>
    </Card>

  );
}
MapComponent.propTypes = {
  iconLayer: PropTypes.any
}
export default MapComponent;
