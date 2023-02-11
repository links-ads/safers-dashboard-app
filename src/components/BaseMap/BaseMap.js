/* eslint-disable react/prop-types */
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

import { useMap } from './MapContext';
import { MapStyleSwitcher } from './MapStyleSwitcher';
import { MAPBOX_TOKEN } from '../../config';
import { useLocalStorage } from '../../customHooks/useLocalStorage';
import {
  mapStylesSelector,
  selectedMapStyleSelector,
  setSelectedMapStyle,
} from '../../store/map/map.slice';

export const INITIAL_VIEW_STATE = {
  longitude: 9.56005296,
  latitude: 43.02777403,
  zoom: 4,
  bearing: 0,
  pitch: 0,
};

const MAX_ZOOM = 20;

const easeInOutCubic = x =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

const BaseMap = ({
  // setViewState,
  layers = null,
  initialViewState = INITIAL_VIEW_STATE,
  hoverInfo = null,
  renderTooltip = () => {},
  onClick = () => {},
  onViewStateChange = () => {},
  onViewportLoad = () => {},
  setWidth = () => {},
  setHeight = () => {},
  widgets = [],
  screenControlPosition = 'top-left',
  navControlPosition = 'bottom-left',
}) => {
  const { mapRef, deckRef, viewState, setViewState, updateViewState } =
    useMap();
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

  const handleViewStateChange = ({ viewState: { width, height, ...rest } }) => {
    onViewStateChange({ viewState: { width, height, ...rest } });
    setViewState(rest);
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
        onViewStateChange={handleViewStateChange}
        // onViewStateChange={onViewStateChange}
        onViewportLoad={onViewportLoad}
        // initialViewState={initialViewState}
        viewState={viewState}
        controller={true}
        layers={finalLayerSet}
        ContextProvider={MapContext.Provider}
      >
        <StaticMap
          mapboxApiAccessToken={MAPBOX_TOKEN}
          initialViewState={initialViewState}
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
