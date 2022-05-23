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

export const getIconLayer = (alerts, mapType = 'alerts') => {
  const icon = mapType == 'reports' ? locationPin : firePin
  return (new IconLayer({
    data: alerts,
    pickable: true,
    getPosition: d => d.center,
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

const EARTH_CIR_METERS = 40075016.686;
const degreesPerMeter = 360 / EARTH_CIR_METERS;

const toRadians = (degrees) => {
  return degrees * Math.PI / 180;
};

export const getBoundingBox = (midPoint, zoomLevel, width = 600, height = 600) => {
  const lat = midPoint[1];
  const lng = midPoint[0];
  const metersPerPixelEW = EARTH_CIR_METERS / Math.pow(2, zoomLevel + 8);
  const metersPerPixelNS = EARTH_CIR_METERS / Math.pow(2, zoomLevel + 8) * Math.cos(toRadians(lat));

  const shiftMetersEW = width / 4 * metersPerPixelEW;
  const shiftMetersNS = height / 4 * metersPerPixelNS;

  const shiftDegreesEW = shiftMetersEW * degreesPerMeter;
  const shiftDegreesNS = shiftMetersNS * degreesPerMeter;
  //[west, south, east, north]
  return [lng - shiftDegreesEW, lat - shiftDegreesNS, lng + shiftDegreesEW, lat + shiftDegreesNS];
}
