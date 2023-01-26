import React , { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, Row } from 'reactstrap';
import BaseMap from '../../../components/BaseMap/BaseMap';
import { getPolygonLayer } from '../../../helpers/mapHelper';
import { getViewState } from '../../../helpers/mapHelper';
import PropTypes from 'prop-types';
import { getEventIconLayer } from '../../../helpers/mapHelper';
import { useMap } from '../../../components/BaseMap/MapContext';
import { BitmapLayer } from 'deck.gl';

const getBitmapLayer = (selectedLayer) => {
  /*
     extract bounds from url, this is passed in as an object with timestamps
     as the keys and urls as the values. Only going to show first one for now
    */
  //const firstURL = Object.values(selectedLayer.urls)[0];
  const firstURL = selectedLayer.legend_url;
  const urlSearchParams = new URLSearchParams(firstURL);
  const urlParams = Object.fromEntries(urlSearchParams.entries());
  const bounds = urlParams?.bbox ? urlParams.bbox.split(',').map(Number) : selectedLayer.bbox;
  return new BitmapLayer({
    id: 'bitmap-layer',
    bounds: bounds,
    image: firstURL,
    //image:'http://placekitten.com/200/300',
    opacity: 0.5
  });
}


const MapComponent = ({ selectedLayer, viewMode, eventList }) => {
  const userAoi = useSelector(state => state.user.defaultAoi);
  const { deckRef } = useMap();

  let [layers, setLayers] = useState([]);
  let [viewState, setViewState] = useState({});
  
  useEffect(() => {
    let displayLayers = []; // QQQ

    if (viewMode === 'userAOI') {
      // default mode is to show user's home AOI 
      setViewState(getViewState(userAoi.features[0].properties.midPoint, userAoi.features[0].properties.zoomLevel));
      displayLayers =[...displayLayers, getPolygonLayer(userAoi), getEventIconLayer(eventList)];
    } 

    if (viewMode==='featureAOI') {
      // this mode is activated when user selects a layer in the pulldown list
      // show feature AOI instead, and overlay the raster
            
      // Work out new viewState
      // This is a replacement for getBoundedViewState
      // which throws up all sorts of errors as it calls DeckGL methods directly
      // setViewState({...viewState, ...getBoundedViewState(deckRef, selectedLayer.bbox)});
      const [minX, minY, maxX, maxY] = selectedLayer.bbox;
      const midpoint  = [(minX+maxX)/2,(minY+maxY)/2];
      const zoom = 10;
      setViewState({...viewState, ...getViewState(midpoint, zoom)});
      const reshapedLayer = {
        features: [
          {geometry: selectedLayer.geometry.geometries[0],}
        ]
      }
      displayLayers.push(getPolygonLayer(reshapedLayer));    
      if (selectedLayer.urls) {
        displayLayers.push(getBitmapLayer(selectedLayer));
      }
    }  
    setLayers(displayLayers);
  }, [setLayers, deckRef, userAoi, selectedLayer, setViewState, viewMode, eventList, getPolygonLayer, getBitmapLayer, getEventIconLayer, getViewState]);

  return (
    <Card className='map-card'>
      <Row style={{ height: 550 }} className="mx-auto">
        {viewState ? 
          <BaseMap 
            layers={layers} 
            initialViewState={viewState} 
            screenControlPosition="top-right"
            navControlPosition="bottom-right"
          />
          : <p>Nothing to see yet...</p>
        }
      </Row>
    </Card>

  );
}

MapComponent.propTypes = {
  selectedLayer: PropTypes.object,
  viewMode: PropTypes.string,
  eventList: PropTypes.arrayOf(PropTypes.any),
}

export default MapComponent;
