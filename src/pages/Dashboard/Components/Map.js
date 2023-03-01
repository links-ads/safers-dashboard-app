import React, { useMemo } from 'react';

import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Card, Row } from 'reactstrap';

import { useMap } from 'components/BaseMap/MapContext';
import { MAP_TYPES } from 'constants/common';
import { defaultAoiSelector } from 'store/user/user.slice';

import BaseMap from '../../../components/BaseMap/BaseMap';
import {
  getPolygonLayer,
  getViewState,
  getEventIconLayer,
  getBitmapLayer,
  getBoundedViewState,
  getIconLayer,
} from '../../../helpers/mapHelper';

const MapComponent = ({
  selectedLayer, // raster layer
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
    return selectedLayer?.geometry ? getBitmapLayer(selectedLayer) : null;
  }, [deckRef, selectedLayer, updateViewState]);

  // const iconLayer = useMemo(
  //   () =>
  //     getEventIconLayer(
  //       'events-layer',
  //       eventList,
  //       MAP_TYPES.ALERTS,
  //       'flag',
  //       visibleLayers.events,
  //     ),
  //   [eventList, visibleLayers.events],
  // );

  const missionsLayer = useMemo(
    () =>
      getIconLayer(
        //missionsList.filter(item => item?.geometry?.coordinates?.length > 0),
        missionsList,
        MAP_TYPES.MISSIONS,
        'target',
        {},
        visibleLayers.missions,
        'missions-layer',
      ),
    [missionsList, visibleLayers.missions],
  );

  // const alertsLayer = useMemo(() => {
  //   console.log('alertsList', alertsList);
  //   return getIconLayer(
  //     // alertsList.filter(
  //     //   item => item?.geometry?.features[0]?.geometry?.coordinates?.length > 0,
  //     // ),
  //     alertsList,
  //     MAP_TYPES.ALERTS,
  //     'fire',
  //     {},
  //     visibleLayers.alerts,
  //   );
  // }, [alertsList, visibleLayers.alerts]);

  const peopleLayer = useMemo(
    () =>
      getIconLayer(
        // orgPplList.filter(
        //   item =>
        //     item?.geometry?.features[0]?.geometry?.coordinates?.length > 0,
        // ),
        orgPplList,
        MAP_TYPES.PEOPLE,
        'people',
        {},
        visibleLayers.people,
        'people-layer',
      ),
    [orgPplList, visibleLayers.people],
  );

  const reportLayer = useMemo(
    () =>
      // getEventIconLayer(
      //   'report-layer',
      //   orgReportList.filter(item => item?.geometry?.coordinates?.length > 0),
      //   MAP_TYPES.REPORTS,
      //   'report',
      //   visibleLayers.reports,
      // ),

      getIconLayer(
        //orgReportList.filter(item => item?.geometry?.coordinates?.length > 0),
        orgReportList,
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
        //commsList.filter(item => item?.geometry?.coordinates?.length > 0),
        commsList,
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
    //iconLayer,
    //alertsLayer,
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
