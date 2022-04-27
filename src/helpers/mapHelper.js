import { FlyToInterpolator, IconLayer } from 'deck.gl';
import { PolygonLayer } from '@deck.gl/layers';
import firePin from '../assets/images/atoms-general-icon-fire-drop.png'
import locationPin from '../assets/images/map/map.png';

const ICON_MAPPING = {
  marker: { x: 0, y: 0, width: 100, height: 100, mask: true }
};

const ORANGE = [226, 123, 29];
const GRAY = [128, 128, 128];
const RED = [230, 51, 79];
const DARK_GRAY = [57, 58, 58];

export const getViewState = (midPoint, zoomLevel = 4) => {
  return {
    longitude: midPoint[0],
    latitude: midPoint[1],
    zoom: zoomLevel + 1.25,
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

export const getIconLayer = (alerts, mapType = 'alerts') => {
  const icon = mapType == 'reports' ? locationPin : firePin
  console.log(icon)
  return (new IconLayer({
    data: alerts,
    pickable: true,
    getPosition: d => d.geometry.coordinates,
    iconAtlas: icon,
    iconMapping: ICON_MAPPING,
    // onHover: !hoverInfo.objects && setHoverInfo,
    id: 'icon',
    getIcon: () => 'marker',
    getColor: d => {
      if (mapType == 'reports') return (d.isSelected ? ORANGE : DARK_GRAY)
      return (d.isSelected ? ORANGE : d.status == 'CLOSED' ? GRAY : RED)
    },
    sizeMinPixels: 80,
    sizeMaxPixels: 100,
    sizeScale: 0.5,
  }))
}
