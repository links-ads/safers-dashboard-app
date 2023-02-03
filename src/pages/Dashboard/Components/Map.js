import React, { useMemo } from 'react';

//import { compact } from 'lodash';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Card, Row } from 'reactstrap';

//import { MAP_TYPES } from 'constants/common';
//import { MAP_TYPES } from 'constants/common';
import { MAP, MAP_TYPES } from 'constants/common';
import { setViewState } from 'store/common/action';

import BaseMap from '../../../components/BaseMap/BaseMap';
import {
  getPolygonLayer,
  getViewState,
  getEventIconLayer,
} from '../../../helpers/mapHelper';

const MapComponent = ({ eventList, orgPplList, orgReportList, commsList }) => {
  const objAoi = useSelector(state => state.user.defaultAoi);
  const polygonLayer = useMemo(() => getPolygonLayer(objAoi), [objAoi]);
  const iconLayer = useMemo(
    () => getEventIconLayer(eventList, MAP_TYPES.ALERTS, 'fire'),
    [eventList],
  );

  console.log('Counts: ', {
    Events: eventList?.length,
    People: orgPplList?.length,
    Reports: orgReportList?.length,
    Comms: commsList?.length,
  });

  const peopleLayer = useMemo(
    () =>
      getEventIconLayer(
        orgPplList.filter(item => item.geometry.coordinates.length > 0),
        MAP_TYPES.PEOPLE,
        'people',
      ),
    [orgPplList],
  );

  const reportLayer = useMemo(
    () =>
      getEventIconLayer(
        orgReportList.filter(item => item.geometry.coordinates.length > 0),
        MAP_TYPES.REPORTS,
        'report',
      ),
    [orgReportList],
  );

  const commsLayer = useMemo(
    () =>
      getEventIconLayer(
        commsList.filter(item => item.geometry.coordinates.length > 0),
        MAP_TYPES.COMMUNICATIONS,
        'flag',
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
          layers={[
            polygonLayer,
            iconLayer,
            peopleLayer,
            reportLayer,
            commsLayer,
          ]}
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
