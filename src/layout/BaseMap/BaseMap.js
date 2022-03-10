/* eslint-disable react/prop-types */
import React, { /*useState, useEffect */ } from 'react';
import Map, /*StaticMap,*/ { MapProvider, FullscreenControl, NavigationControl } from 'react-map-gl';
// import { MapView } from '@deck.gl/core';
import DeckGL from '@deck.gl/react';
import { /*PolygonLayer,*/ BitmapLayer, PathLayer } from '@deck.gl/layers';
import { TileLayer } from '@deck.gl/geo-layers';

const INITIAL_VIEW_STATE = {
  longitude: 9.56005296,
  latitude: 43.02777403,
  zoom: 4,
  maxZoom: 20,
  maxPitch: 85,
  bearing: 0,
  pitch: 0
};

// const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json';

const BaseMap = ({
  layers = null,
  initialViewState = INITIAL_VIEW_STATE,
  // mapStyle = MAP_STYLE,
  showBorder = false, onTilesLoad = null
}) => {

  const tileLayer = new TileLayer({
    // https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Tile_servers
    data: [
      'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
      'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
      'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
    ],

    // Since these OSM tiles support HTTP/2, we can make many concurrent requests
    // and we aren't limited by the browser to a certain number per domain.
    maxRequests: 20,
    pickable: true,
    onViewportLoad: onTilesLoad,
    autoHighlight: false,
    highlightColor: [60, 60, 60, 40],
    // https://wiki.openstreetmap.org/wiki/Zoom_levels
    minZoom: 0,
    maxZoom: 19,
    tileSize: 256,
    zoomOffset: devicePixelRatio === 1 ? -1 : 0,
    renderSubLayers: props => {
      const {
        bbox: { west, south, east, north }
      } = props.tile;

      return [
        new BitmapLayer(props, {
          data: null,
          image: props.data,
          bounds: [west, south, east, north]
        }),
        showBorder &&
        new PathLayer({
          id: `${props.id}-border`,
          visible: props.visible,
          data: [
            [
              [west, north],
              [west, south],
              [east, south],
              [east, north],
              [west, north]
            ]
          ],
          getPath: d => d,
          getColor: [255, 0, 0],
          widthMinPixels: 4
        })
      ];
    }
  });

  const finalLayerSet = [
    tileLayer,
    ...layers ? layers : null
  ];

  return (
    <DeckGL
      layers={finalLayerSet}
      //views={new MapView({ repeat: true })}
      //effects={theme.effects}
      initialViewState={initialViewState}
      controller={true}
      ContextProvider={MapProvider}
    >
      <Map
        mapboxAccessToken='pk.eyJ1IjoidGlsYW5wZXJ1bWEiLCJhIjoiY2wwamF1aGZ0MGF4MTNlb2EwcDBpNGR6YSJ9.ay3qveZBddbe4zVS78iM3w'
        initialViewState={initialViewState}
        mapStyle={'mapbox://styles/mapbox/streets-v9'}
      >
        <NavigationControl style={{ zIndex: 1000000 }} position='bottom-left' showCompass={false} capturePointerMove={true} />
        <FullscreenControl position='top-left' />
      </Map>
    </DeckGL>
  );
}
export default BaseMap;
