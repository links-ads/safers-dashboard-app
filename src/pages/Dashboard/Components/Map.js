import React, { useMemo } from 'react';

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
  getIconLayer,
} from '../../../helpers/mapHelper';

const MapComponent = ({ eventList, orgPplList, orgReportList, commsList }) => {
  const objAoi = useSelector(state => state.user.defaultAoi);
  const polygonLayer = getPolygonLayer(objAoi);
  // console.log('EVENT LIST: ', eventList);
  const iconLayer = getEventIconLayer(eventList);
  console.log('Counts: ', {
    Events: eventList?.length,
    People: orgPplList?.length,
    Reports: orgReportList?.length,
    Comms: commsList?.length,
  });

  const peopleLayer = getIconLayer(
    orgPplList.filter(item => item.geometry.coordinates.length > 0),
    MAP_TYPES.PEOPLE,
  );

  const reportLayer = getIconLayer(
    orgReportList.filter(item => item.geometry.coordinates.length > 0),
    MAP_TYPES.REPORTS,
  );

  const commsLayer = getIconLayer(
    commsList.filter(item => item.geometry.coordinates.length > 0),
    MAP_TYPES.COMMUNICATIONS,
  );

  const viewState = useMemo(() => {
    return getViewState(
      //memoized this to prevent map snapping back to AOI after polling
      objAoi.features[0].properties.midPoint,
      objAoi.features[0].properties.zoomLevel,
    );
  }, [objAoi]);

  const usableLayers = compact([
    polygonLayer,
    iconLayer,
    peopleLayer,
    reportLayer,
    commsLayer,
  ]);

  console.log('Usable Layers', usableLayers);

  return (
    <Card className="map-card">
      <Row style={{ height: 550 }} className="mx-auto">
        <BaseMap
          layers={usableLayers}
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
