import { FlyToInterpolator } from 'deck.gl';
import { PolygonLayer } from '@deck.gl/layers';

export const getViewState = (midPoint, zoomLevel = 4) => {
  return {
    longitude: midPoint[0],
    latitude: midPoint[1],
    zoom: zoomLevel,
    bearing: 0,
    pitch: 0,
    transitionDuration: 1000,
    transitionInterpolator: new FlyToInterpolator()
  };
}

export const getPolygonLayer = (aoi) => {
  const coordinates = aoi.features[0].geometry.coordinates;
  return (new PolygonLayer({
    id: 'polygon-layer',
    data: coordinates,
    pickable: true,
    stroked: true,
    filled: true,
    extruded: false,
    wireframe: true,
    lineWidthMinPixels: 1,
    opacity: .25,
    getPolygon: d => d,
    // getElevation: () => 10,
    getFillColor: [192, 105, 25],
    getLineColor: [0, 0, 0],
    getLineWidth: 100
  }))
}

export const getBoundaryBox = () => {
  const rangeFactor = (1 / zoomLevel) * 18;
  const left = midPoint[0] - rangeFactor; //minLong
  const right = midPoint[0] + rangeFactor; //maxLong
  const top = midPoint[1] + rangeFactor; //maxLat
  const bottom = midPoint[1] - rangeFactor; //minLat

  const boundaryBox = [
    [left, top],
    [right, top],
    [right, bottom],
    [left, bottom]
  ];

  return boundaryBox;
}