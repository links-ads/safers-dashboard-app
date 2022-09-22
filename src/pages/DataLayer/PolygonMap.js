/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';
import MapGL, { FullscreenControl, NavigationControl, MapContext } from 'react-map-gl';
import { MapView } from '@deck.gl/core';
import { MAPBOX_TOKEN } from '../../config';
import {
  Editor,
  DrawPolygonMode,
  // EditingMode,
  RENDER_STATE,
} from 'react-map-gl-draw';
import wkt from 'wkt';

const INITIAL_VIEW_STATE = {
  longitude: 9.56005296,
  latitude: 43.02777403,
  zoom: 4,
  bearing: 0,
  pitch: 0
};
const MAP_STYLE = {
  mb_streets: 'mapbox://styles/mapbox/streets-v11',
  mb_satellite: 'mapbox://styles/mapbox/satellite-v9',
  mb_lite: 'mapbox://styles/mapbox/light-v10',
  mb_nav: 'mapbox://styles/mapbox/navigation-day-v1'
};
const POLYGON_LINE_COLOR = 'rgb(38, 181, 242)';
const POLYGON_FILL_COLOR = 'rgba(255, 255, 255, 0.5)';
const POLYGON_LINE_DASH = '10,2'
const POLYGON_ERROR_COLOR = 'rgba(255, 0, 0, 0.5)'


const PolygonMap = ({
  layers = null,
  initialViewState = INITIAL_VIEW_STATE,
  hoverInfo = null,
  renderTooltip = () => { },
  onClick = () => { },
  onViewStateChange = () => { },
  onViewportLoad = () => { },
  setWidth = () => { },
  setHeight = () => { },
  // widgets = [],
  screenControlPosition = 'top-left',
  navControlPosition = 'bottom-left',
  mapStyle = 'mb_streets',
  setCoordinates,
  coordinates,
  handleAreaValidation
}) => {

  const mapRef = useRef();
  const finalLayerSet = [
    ...layers ? layers : null
  ];

  const MODES = [
    { id: 'drawPolygon', text: 'Draw Polygon', handler: DrawPolygonMode },
    // { id: 'editing', text: 'Edit Feature', handler: EditingMode },
  ];

  const [viewport, setViewport] = useState(initialViewState);
  const [modeId, setModeId] = useState(null);
  const [modeHandler, setModeHandler] = useState(null);
  const [features, setFeatures] = useState([]);
  const [areaIsValid, setAreaIsValid] = useState(true);

  useEffect(() => {
    window.addEventListener('resize', getMapSize);
  }, []);

  useEffect(() => {
    getMapSize();
  }, [layers]);

  const getMapSize = () => {
    const newWidth = mapRef?.current?.deck?.width;
    newWidth && setWidth(newWidth);

    const newHeight = mapRef?.current?.deck.height;
    newHeight && setHeight(newHeight);
  };

  const getPosition = (position) => {
    const props = position.split('-');
    return {
      position: 'absolute',
      [props[0]]: 10,
      [props[1]]: 10
    };
  }

  const toggleMode = (evt) => {
    const tempModeId = evt === modeId ? null : evt;
    const mode = MODES.find((m) => m.id === tempModeId);
    const modeHandler = mode ? new mode.handler() : null;
    setModeId(tempModeId);
    setModeHandler(modeHandler);
  };


  const _updateViewport = (tempViewport) => {
    setViewport(tempViewport);
  };

  const MapControlButton = ({mode = '', top = '90px', children}) => (
    <div className="" style={{ position: 'absolute', top, right: '10px' }}>
      <div className="mapboxgl-ctrl mapboxgl-ctrl-group">
        <button 
          style={modeId ? { backgroundColor: 'lightgray' } : {}} 
          onClick={() => {
            setAreaIsValid(true);
            toggleMode(mode); 
            setFeatures([]); 
            setCoordinates('');
          }} className="mapboxgl-ctrl-icon d-flex justify-content-center align-items-center" type="button">
          {children}
        </button>
      </div>
    </div>
  )

  const renderToolbar = () => (
    <>
      <MapControlButton mode={modeId ? '' : 'drawPolygon'} top='50px'>
        <i className="bx bx-pencil" style={{ fontSize: '20px' }}></i>
      </MapControlButton>
      <MapControlButton>
        <i className="bx bx-trash" style={{ fontSize: '20px' }}></i>
      </MapControlButton>
    </>
  )

  const handleUpdate = (val) => {
    if (val.editType === 'addFeature') {
      let areaValidation = true;
      if (handleAreaValidation) {
        areaValidation = handleAreaValidation(val.data[0]);
      }
      const originalGeojson = val.data[0].geometry;
      setFeatures(val.data);
      const wktConversion = wkt.stringify(originalGeojson);
      const formattedWkt = wktConversion.replace(/\d+\.\d+/g, function(match) {
        return Number(match).toFixed(6);
      });
      setCoordinates(formattedWkt, areaValidation);
      toggleMode('');
    } else {
      setFeatures([])
    }
  };

  useEffect(()=> {
    const tempFeatures = [{
      type: 'Feature',
      properties: {},
      geometry: coordinates ? wkt.parse(coordinates) : '',
    }]
    // tempFeatures[0].geometry.coordinates=coordinates;
    setFeatures(tempFeatures);
  },[coordinates])

  return (
    <>
      <MapGL
        {...viewport}
        width="100%"
        height="100%"
        mapboxApiAccessToken={MAPBOX_TOKEN}
        mapStyle={MAP_STYLE[mapStyle]}
        onViewportChange={_updateViewport}
        ContextProvider={MapContext.Provider}
        onClick={onClick}
        onViewStateChange={onViewStateChange}
        onViewportLoad={onViewportLoad}
        layers={finalLayerSet}
        views={new MapView({ repeat: true })}
      // ref={mapRef}
      // controller={true}
      >
        <Editor
          clickRadius={12}
          mode={modeHandler}
          features={features}
          onUpdate={handleUpdate}
          featureStyle={(data) => {
            if (data.index === 0 && handleAreaValidation) {
              setAreaIsValid(handleAreaValidation(data.feature))
            }
            if (data.state === RENDER_STATE.SELECTED) {
              return {
                stroke: POLYGON_LINE_COLOR,
                fill: areaIsValid ? POLYGON_FILL_COLOR : POLYGON_ERROR_COLOR,
              };
            }
            return {
              stroke: POLYGON_LINE_COLOR,
              fill: areaIsValid ? POLYGON_FILL_COLOR : POLYGON_ERROR_COLOR,
              strokeDasharray: POLYGON_LINE_DASH,
            };
          }}
        />
        <FullscreenControl style={getPosition(screenControlPosition)} />
        <NavigationControl style={getPosition(navControlPosition)} showCompass={false} />
        {/* {widgets.map((widget, index) => widget(index))} */}
        {renderTooltip(hoverInfo)}
        {renderToolbar()}
      </MapGL>
    </>
  );
}




export default PolygonMap;