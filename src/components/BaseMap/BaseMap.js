/* eslint-disable react/prop-types */
import React, { /*useState, useEffect */ } from 'react';
import /*Map,*/ { FullscreenControl, NavigationControl, MapContext, StaticMap } from 'react-map-gl';
import { MapView } from '@deck.gl/core';
import DeckGL/*, { TileLayer, BitmapLayer }*/ from 'deck.gl';

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

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOXTOKEN

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

  // const tileLayer = new TileLayer({
  //   // https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Tile_servers
  //   data: [
  //     'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
  //     'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
  //     'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
  //   ],

  //   // Since these OSM tiles support HTTP/2, we can make many concurrent requests
  //   // and we aren't limited by the browser to a certain number per domain.
  //   maxRequests: 20,
  //   pickable: true,
  //   onViewportLoad: null,
  //   autoHighlight: false,
  //   highlightColor: [60, 60, 60, 40],
  //   // https://wiki.openstreetmap.org/wiki/Zoom_levels
  //   minZoom: 0,
  //   maxZoom: 19,
  //   tileSize: 256,
  //   zoomOffset: devicePixelRatio === 1 ? -1 : 0,
  //   renderSubLayers: props => {
  //     const {
  //       bbox: { west, south, east, north }
  //     } = props.tile;

  //     return [
  //       new BitmapLayer(props, {
  //         data: null,
  //         image: props.data,
  //         bounds: [west, south, east, north]
  //       }),
  //     ];
  //   }
  // });

  const finalLayerSet = [
    // tileLayer,
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
        //effects={theme.effects}
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
