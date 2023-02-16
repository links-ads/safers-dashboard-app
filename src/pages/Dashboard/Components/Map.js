import React, { useMemo } from 'react';

import { BitmapLayer } from 'deck.gl';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Card, Row } from 'reactstrap';

import { MAP_TYPES } from 'constants/common';
import { setViewState } from 'store/common/action';

import BaseMap from '../../../components/BaseMap/BaseMap';
import {
  getPolygonLayer,
  getViewState,
  getEventIconLayer,
} from '../../../helpers/mapHelper';

const getBitmapLayer = selectedLayerNode => {
  /*
     extract bounds from url, this is passed in as an object with timestamps
     as the keys and urls as the values. Only going to show first one for now
    */
  const firstURL = Object.values(selectedLayerNode.urls)[0];
  const urlSearchParams = new URLSearchParams(firstURL);
  const urlParams = Object.fromEntries(urlSearchParams.entries());
  const bounds = urlParams?.bbox
    ? urlParams.bbox.split(',').map(Number)
    : selectedLayerNode.bbox;
  return new BitmapLayer({
    id: 'bitmap-layer',
    bounds: bounds,
    image: firstURL,
    opacity: 0.5,
  });
};

const MapComponent = ({
  selectedLayer = null, // raster layer
  eventList = [],
  orgPplList = [],
  orgReportList = [],
  commsList = [],
  missionsList = [],
  alertsList = [],
  visibleLayers = {},
}) => {
  const objAoi = useSelector(state => state.user.defaultAoi);
  const polygonLayer = useMemo(() => getPolygonLayer(objAoi), [objAoi]);

  const mapRequestLayer = useMemo(() => {
    return selectedLayer?.geometry ? getBitmapLayer(selectedLayer) : null;
  }, [selectedLayer]);

  const iconLayer = useMemo(
    () =>
      getEventIconLayer(
        'events-layer',
        eventList,
        MAP_TYPES.ALERTS,
        'flag',
        visibleLayers.events,
      ),
    [eventList, visibleLayers.events],
  );

  const missionsLayer = useMemo(
    () =>
      getEventIconLayer(
        'missions-layer',
        missionsList.filter(item => item?.geometry?.coordinates?.length > 0),
        MAP_TYPES.MISSIONS,
        'target',
        visibleLayers.missions,
      ),
    [missionsList, visibleLayers.missions],
  );

  const alertsLayer = useMemo(
    () =>
      getEventIconLayer(
        'alerts-layer',
        alertsList.filter(
          item =>
            item?.geometry?.features[0]?.geometry?.coordinates?.length > 0,
        ),
        MAP_TYPES.ALERTS,
        'fire',
        visibleLayers.alerts,
      ),
    [alertsList, visibleLayers.alerts],
  );

  const peopleLayer = useMemo(
    () =>
      getEventIconLayer(
        'people-layer',
        orgPplList.filter(item => item?.geometry?.coordinates?.length > 0),
        MAP_TYPES.PEOPLE,
        'people',
        visibleLayers.people,
      ),
    [orgPplList, visibleLayers.people],
  );

  const reportLayer = useMemo(
    () =>
      getEventIconLayer(
        'report-layer',
        orgReportList.filter(item => item?.geometry?.coordinates?.length > 0),
        MAP_TYPES.REPORTS,
        'report',
        visibleLayers.reports,
      ),
    [orgReportList, visibleLayers.reports],
  );

  const commsLayer = useMemo(
    () =>
      getEventIconLayer(
        'comms-layer',
        commsList.filter(item => item?.geometry?.coordinates?.length > 0),
        MAP_TYPES.COMMUNICATIONS,
        'communications',
        visibleLayers.communications,
      ),
    [commsList, visibleLayers.communications],
  );

  const viewState = useMemo(() => {
    if (mapRequestLayer) {
      // zoom to raster
      const [minX, minY, maxX, maxY] = mapRequestLayer.props.bounds;
      const midpoint = [(minX + maxX) / 2, (minY + maxY) / 2];
      const zoom = 10;
      const newViewState = getViewState(midpoint, zoom);
      return newViewState;
    }
    return getViewState(
      // zoom to user AOI
      objAoi.features[0].properties.midPoint,
      objAoi.features[0].properties.zoomLevel,
    );
  }, [mapRequestLayer, objAoi.features]);

  const allLayers = [
    polygonLayer,
    iconLayer,
    alertsLayer,
    missionsLayer,
    peopleLayer,
    reportLayer,
    commsLayer,
    mapRequestLayer,
  ];

  return (
    <Card className="map-card">
      <Row style={{ height: 550 }} className="mx-auto">
        <BaseMap
          layers={allLayers}
          initialViewState={viewState}
          screenControlPosition="top-right"
          navControlPosition="bottom-right"
        />
      </Row>
    </Card>
  );
};

MapComponent.propTypes = {
  eventList: PropTypes.arrayOf(PropTypes.any),
};

export default MapComponent;
