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
  setCoordinates
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

  const renderToolbar = () => {

    return (<>
      <div className="" style={{ position: 'absolute', top: '50px', right: '10px' }}>
        <div className="mapboxgl-ctrl mapboxgl-ctrl-group">
          <button style={modeId ? { backgroundColor: 'lightgray' } : {}} onClick={() => { toggleMode(modeId ? '' : 'drawPolygon'); setFeatures([]); setCoordinates([]); }} className="mapboxgl-ctrl-icon d-flex justify-content-center align-items-center" type="button">
            <i className="bx bx-pencil" style={{ fontSize: '20px' }}></i>
          </button>
        </div>
      </div>
      <div className="" style={{ position: 'absolute', top: '90px', right: '10px' }}>
        <div className="mapboxgl-ctrl mapboxgl-ctrl-group">
          <button onClick={() => { toggleMode(''); setFeatures([]); setCoordinates([]); }} className="mapboxgl-ctrl-icon d-flex justify-content-center align-items-center" type="button">
            <i className="bx bx-trash" style={{ fontSize: '20px' }}></i>
          </button>
        </div>
      </div>
    </>)
  }

  const handleUpdate = (val) => {
    setFeatures(val.data);
    if (val.editType === 'addFeature') {
      const polygon = val.data[0].geometry.coordinates[0];
      setCoordinates(polygon);
      toggleMode('');
    }
  };

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
            if (data.state === RENDER_STATE.SELECTED) {
              return {
                stroke: POLYGON_LINE_COLOR,
                fill: POLYGON_FILL_COLOR,
              };
            }
            return {
              stroke: POLYGON_LINE_COLOR,
              fill: POLYGON_FILL_COLOR,
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