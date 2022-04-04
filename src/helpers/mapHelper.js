import { FlyToInterpolator, IconLayer } from 'deck.gl';
import { PolygonLayer } from '@deck.gl/layers';
import firePin from '../assets/images/atoms-general-icon-fire-drop.png'

const ICON_MAPPING = {
  marker: { x: 0, y: 0, width: 100, height: 100, mask: true }
};

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

export const getIconLayer = (alerts) => {
  return (new IconLayer({
    data: alerts,
    pickable: true,
    getPosition: d => d.geometry.coordinates,
    iconAtlas: firePin,
    iconMapping: ICON_MAPPING,
    // onHover: !hoverInfo.objects && setHoverInfo,
    id: 'icon',
    getIcon: () => 'marker',
    getColor: d => { return (d.isSelected ? [226, 123, 29] : [230, 51, 79]) },
    sizeMinPixels: 80,
    sizeMaxPixels: 100,
    sizeScale: 0.5,
  }))
}