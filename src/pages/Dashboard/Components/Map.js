import React, { useMemo } from 'react';

//import { compact } from 'lodash';
import { compact } from 'lodash';
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

const MapComponent = ({
  eventList = [],
  orgPplList = [],
  orgReportList = [],
  commsList = [],
  missionsList = [],
  alertsList = [],
  visibleLayers = [],
}) => {
  const objAoi = useSelector(state => state.user.defaultAoi);
  const polygonLayer = useMemo(() => getPolygonLayer(objAoi), [objAoi]);

  console.log('lists are', {
    events: eventList,
    people: orgPplList,
    orgReportList: orgReportList,
    commsList: commsList,
    missionsList: missionsList,
    alertsList: alertsList,
    visibleLayers: visibleLayers,
  });
  const iconLayer = useMemo(
    () =>
      getEventIconLayer(
        `events-layer-${Date.now()}`,
        eventList,
        MAP_TYPES.ALERTS,
        'flag',
      ),
    [eventList],
  );

  const missionsLayer = useMemo(
    () =>
      getEventIconLayer(
        `missions-layer-${Date.now()}`,
        missionsList.filter(item => item?.geometry?.coordinates?.length > 0),
        MAP_TYPES.MISSIONS,
        'target',
      ),
    [missionsList],
  );

  const alertsLayer = useMemo(
    () =>
      getEventIconLayer(
        `people-layer-${Date.now()}`,
        alertsList.filter(item => item?.geometry?.coordinates?.length > 0),
        MAP_TYPES.MISSIONS,
        'fire',
      ),
    [alertsList],
  );

  const peopleLayer = useMemo(
    () =>
      getEventIconLayer(
        `people-layer-${Date.now()}`,
        orgPplList.filter(item => item?.geometry?.coordinates?.length > 0),
        MAP_TYPES.PEOPLE,
        'people',
      ),
    [orgPplList],
  );

  const reportLayer = useMemo(
    () =>
      getEventIconLayer(
        `report-layer-${Date.now()}`,
        orgReportList.filter(item => item?.geometry?.coordinates?.length > 0),
        MAP_TYPES.REPORTS,
        'report',
      ),
    [orgReportList],
  );

  const commsLayer = useMemo(
    () =>
      getEventIconLayer(
        `comms-layer-${Date.now()}`,
        commsList.filter(item => item.geometry.coordinates.length > 0),
        MAP_TYPES.COMMUNICATIONS,
        'communications',
      ),
    [commsList],
  );

  const viewState = useMemo(() => {
    return getViewState(
      //memoized this to prevent map snapping back to AOI after polling
      objAoi.features[0].properties.midPoint,
      objAoi.features[0].properties.zoomLevel,
    );
  }, [objAoi]);

  return (
    <Card className="map-card">
      <Row style={{ height: 550 }} className="mx-auto">
        <BaseMap
          layers={compact([
            polygonLayer,
            visibleLayers.events ? iconLayer : null,
            visibleLayers.alerts ? alertsLayer : null,
            visibleLayers.missions ? missionsLayer : null,
            visibleLayers.people ? peopleLayer : null,
            visibleLayers.reports ? reportLayer : null,
            visibleLayers.communications ? commsLayer : null,
          ])}
          setViewState={setViewState}
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
