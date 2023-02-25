import React, { useCallback, useEffect, Fragment } from 'react';

import { MapView, FlyToInterpolator } from '@deck.gl/core';
import { DeckGL } from 'deck.gl';
import {
  FullscreenControl,
  NavigationControl,
  MapContext,
  StaticMap,
} from 'react-map-gl';
import { useSelector, useDispatch } from 'react-redux';

import { MAPBOX_TOKEN } from 'config';
import { useLocalStorage } from 'customHooks/useLocalStorage';
import {
  mapStylesSelector,
  selectedMapStyleSelector,
  setSelectedMapStyle,
} from 'store/map.slice';

import { useMap } from './MapContext';
import { MapStyleSwitcher } from './MapStyleSwitcher';

const MAX_ZOOM = 20;

const easeInOutCubic = x =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

const BaseMap = ({
  layers = null,
  hoverInfo = null,
  renderTooltip = () => {},
  onClick = () => {},
  onViewportLoad = () => {},
  setWidth = () => {},
  setHeight = () => {},
  widgets = [],
  screenControlPosition = 'top-left',
  navControlPosition = 'bottom-left',
}) => {
  const { mapRef, deckRef, viewState, setViewState } = useMap();
  const dispatch = useDispatch();
  const mapStyles = useSelector(mapStylesSelector);
  const selectedMapStyle = useSelector(selectedMapStyleSelector);
  const [mapStyle, setMapStyle] = useLocalStorage('safers-map-style');

  const handleSelectMapStyle = mapStyle => {
    dispatch(setSelectedMapStyle(mapStyle));
    setMapStyle(mapStyle);
  };

  const finalLayerSet = [...(layers ? layers : null)];

  const getMapSize = useCallback(() => {
    const newWidth = deckRef?.current?.deck?.width;
    newWidth && setWidth(newWidth);

    const newHeight = deckRef?.current?.deck.height;
    newHeight && setHeight(newHeight);
  }, [deckRef, setHeight, setWidth]);

  useEffect(() => {
    window.addEventListener('resize', getMapSize);
  }, [getMapSize]);

  const handleClick = (info, event) => {
    if (info?.object?.properties?.cluster) {
      if (info?.object?.properties?.expansion_zoom <= MAX_ZOOM) {
        setViewState({
          longitude: info.object.geometry.coordinates[0],
          latitude: info.object.geometry.coordinates[1],
          zoom: info.object.properties.expansion_zoom,
          transitionDuration: 1000,
          transitionEasing: easeInOutCubic,
          transitionInterpolator: new FlyToInterpolator(),
        });
      } else {
        onClick(info, event);
      }
    } else {
      onClick(info, event);
    }
  };

  const getPosition = position => {
    const props = position.split('-');
    return {
      position: 'absolute',
      [props[0]]: 10,
      [props[1]]: 10,
    };
  };

  return (
    <>
      <DeckGL
        ref={deckRef}
        views={new MapView({ repeat: true })}
        onClick={handleClick}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        onViewportLoad={onViewportLoad}
        viewState={viewState}
        controller={true}
        layers={finalLayerSet}
        ContextProvider={MapContext.Provider}
      >
        <StaticMap
          mapboxApiAccessToken={MAPBOX_TOKEN}
          mapStyle={mapStyle ? mapStyle.uri : selectedMapStyle.uri}
          ref={mapRef}
        />
        <FullscreenControl style={getPosition(screenControlPosition)} />
        <NavigationControl
          style={getPosition(navControlPosition)}
          showCompass={false}
        />
        {widgets.map((widget, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={index}>{widget(index)}</Fragment>
        ))}
        {hoverInfo ? renderTooltip(hoverInfo) : null}
        <MapStyleSwitcher
          mapStyles={mapStyles}
          selectedMapStyle={selectedMapStyle}
          selectMapStyle={handleSelectMapStyle}
        />
      </DeckGL>
    </>
  );
};
export default BaseMap;
