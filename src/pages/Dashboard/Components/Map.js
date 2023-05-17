import React, { useMemo } from 'react';

import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Card, Row } from 'reactstrap';

import BaseMap from 'components/BaseMap/BaseMap';
import { useMap } from 'components/BaseMap/MapContext';
import { TiledRasterLayer } from 'components/BaseMap/TiledRasterLayer';
import { MAP_TYPES } from 'constants/common';
import {
  getPolygonLayer,
  getViewState,
  // getBitmapLayer,
  getBoundedViewState,
  getIconLayer,
  reshapeEventsData,
} from 'helpers/mapHelper';
import { defaultAoiSelector } from 'store/user.slice';

const MapComponent = ({
  selectedLayer,
  eventList = [],
  orgPplList = [],
  orgReportList = [],
  commsList = [],
  missionsList = [],
  alertsList = [],
  visibleLayers = {},
}) => {
  const { deckRef, updateViewState } = useMap();

  const objAoi = useSelector(defaultAoiSelector);
  const polygonLayer = useMemo(() => getPolygonLayer(objAoi), [objAoi]);

  const filterNullGeometries = items =>
    items.filter(item => item?.geometry?.coordinates?.length > 0);

  const mapRequestLayer = useMemo(() => {
    if (!selectedLayer) {
      return null;
    }
    const { latitude, longitude, zoom } = getBoundedViewState(
      deckRef,
      selectedLayer.bbox,
    );
    const newViewState = getViewState([longitude, latitude], zoom);
    updateViewState(newViewState);
    return selectedLayer?.geometry
      ? new TiledRasterLayer({ data: Object.values(selectedLayer?.urls)[0] })
      : null;
  }, [deckRef, selectedLayer, updateViewState]);

  const eventsLayer = useMemo(() => {
    return getIconLayer(
      reshapeEventsData(eventList),
      MAP_TYPES.EVENTS,
      'flag',
      {},
      visibleLayers.events,
      'events-layer',
    );
  }, [eventList, visibleLayers.events]);

  const missionsLayer = useMemo(
    () =>
      getIconLayer(
        filterNullGeometries(missionsList),
        MAP_TYPES.MISSIONS,
        'target',
        {},
        visibleLayers.missions,
        'missions-layer',
      ),
    [missionsList, visibleLayers.missions],
  );

  const alertsLayer = useMemo(() => {
    const filtered = alertsList.filter(
      item => item?.geometry?.features[0]?.geometry?.coordinates?.length > 0,
    );
    return getIconLayer(
      filtered,
      MAP_TYPES.ALERTS,
      'fire',
      {},
      visibleLayers.alerts,
      'alerts-layer',
    );
  }, [alertsList, visibleLayers.alerts]);

  const peopleLayer = useMemo(() => {
    if (!orgPplList) {
      return null;
    }
    return getIconLayer(
      filterNullGeometries(orgPplList),
      MAP_TYPES.PEOPLE,
      'people',
      {},
      visibleLayers.people,
      'people-layer',
    );
  }, [orgPplList, visibleLayers.people]);

  const reportLayer = useMemo(
    () =>
      getIconLayer(
        filterNullGeometries(orgReportList),
        MAP_TYPES.REPORTS,
        'report',
        {},
        visibleLayers.reports,
        'reports-layer',
      ),
    [orgReportList, visibleLayers.reports],
  );

  const commsLayer = useMemo(
    () =>
      getIconLayer(
        filterNullGeometries(commsList),
        MAP_TYPES.COMMUNICATIONS,
        'communications',
        {},
        visibleLayers.communications,
        'communications-layer',
      ),
    [commsList, visibleLayers.communications],
  );

  const allLayers = [
    polygonLayer,
    eventsLayer,
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
