/* eslint-disable react/prop-types */
import React from 'react';
import { FullscreenControl, NavigationControl, MapContext, StaticMap } from 'react-map-gl';
import { MapView } from '@deck.gl/core';
import DeckGL from 'deck.gl';
import { MAPBOX_TOKEN } from '../../config';

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

const BaseMap = ({
  layers = null,
  initialViewState = INITIAL_VIEW_STATE,
  hoverInfo = null,
  renderTooltip = () => { },
  onClick = () => { },
  onViewStateChange = () => { },
  widgets = [],
  screenControlPosition = 'top-left',
  navControlPosition = 'bottom-left',
  mapStyle = 'mb_streets'
}) => {

  const finalLayerSet = [
    ...layers ? layers : null
  ];

  const getPosition = (position) => {
    const props = position.split('-');
    return {
      position: 'absolute',
      [props[0]]: 10,
      [props[1]]: 10
    };
  }

  return (
    <>
      <DeckGL
        views={new MapView({ repeat: true })}
        onClick={onClick}
        onViewStateChange={onViewStateChange}
        onViewportLoad={(e) => { console.log(e) }}
        initialViewState={initialViewState}
        controller={true}
        layers={finalLayerSet}
        ContextProvider={MapContext.Provider}
      >
        <StaticMap
          mapboxApiAccessToken={MAPBOX_TOKEN}
          initialViewState={initialViewState}
          mapStyle={MAP_STYLE[mapStyle]}
        />
        <FullscreenControl style={getPosition(screenControlPosition)} />
        <NavigationControl style={getPosition(navControlPosition)} showCompass={false} />
        {widgets.map((widget, index) => widget(index))}
        {renderTooltip(hoverInfo)}
      </DeckGL>
    </>
  );
}
export default BaseMap;
