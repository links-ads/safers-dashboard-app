import React from 'react';
import { useSelector } from 'react-redux';
import { Card, Row } from 'reactstrap';
import BaseMap from '../../../components/BaseMap/BaseMap';
import { getBoundedViewState, getPolygonLayer } from '../../../helpers/mapHelper';
import { getViewState } from '../../../helpers/mapHelper';
import PropTypes from 'prop-types';
import { getEventIconLayer } from '../../../helpers/mapHelper';
import { useMap } from '../../../components/BaseMap/MapContext';

const MapComponent = ({ selectedLayer, viewMode, viewState, eventList }) => {
  let objAoi = {};
  let layers = [getEventIconLayer(eventList)];
  const { deckRef } = useMap();

  if(!viewState || viewMode==='userAOI') {
    // default mode is to show user's home AOI
    objAoi = useSelector(state => state.user.defaultAoi);
    viewState = getViewState(objAoi.features[0].properties.midPoint, objAoi.features[0].properties.zoomLevel);
    layers.push(getPolygonLayer(objAoi));
  } 

  if (viewMode==='featureAOI') {
    // this mode is activated when user selects a layer in the pulldown list
    // show feature AOI instead, and overlay the raster
    let bbox = selectedLayer.bbox;
    
    viewState = getBoundedViewState(deckRef, bbox)
    const reshapedLayer = {
      features: [
        {geometry: selectedLayer.geometry.geometries[0],}
      ]
    }
    
    layers.push(getPolygonLayer(reshapedLayer));    
    
  }

  return (
    <Card className='map-card'>
      <Row style={{ height: 550 }} className="mx-auto">
        <BaseMap 
          layers={layers} 
          initialViewState={viewState} 
          screenControlPosition="top-right"
          navControlPosition="bottom-right"
        />
      </Row>
    </Card>

  );
}

MapComponent.propTypes = {
  selectedLayer: PropTypes.object,
  viewMode: PropTypes.string,
  viewState: PropTypes.any,
  eventList: PropTypes.arrayOf(PropTypes.any),
}

export default MapComponent;
