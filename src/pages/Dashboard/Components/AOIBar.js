import React, { useCallback, useEffect, useState } from 'react';

//import { intersect, polygon } from '@turf/turf';
import { flattenDeep } from 'lodash';
import moment from 'moment';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Card, Input, Button } from 'reactstrap';
//import wkt from 'wkt';

import { useMap } from 'components/BaseMap/MapContext';
import { doesItOverlapAoi, getViewState } from 'helpers/mapHelper';

import EventsPanel from './EventsPanel';
import MapComponent from './Map';
import { setEventParams, getAllEventAlerts } from '../../../store/appAction';

const nodeVisitor = (node, userAoi, parentInfo = {}) => {
  // node visitor. This is a recursive function called on each node
  // in the tree. We use this to veto certain nodes based on AOI
  // geometry intersection.

  if (node.children) {
    if (node.geometry) {
      // intermediate node, this has a lot of metadata like geometry
      // test that this node intersects the default user AOI
      const overlaps = doesItOverlapAoi(node, userAoi);
      if (overlaps) {
        // we pass these down to the leaf nodes and recurse down to the children
        const passDown = {
          geometry: node.geometry,
          requestId: node.request_id,
          parentTitle: node.title,
          id: node.id,
          bbox: node.bbox,
        };
        return node.children.map(child =>
          nodeVisitor(child, userAoi, passDown),
        );
      } else {
        // prune the tree, these are out of bounds
        return [];
      }
    } else {
      // no geometry, so we're at top level
      return node.children.map(child => nodeVisitor(child, userAoi));
    }
  } else {
    // no children, so a leaf node. If data is avaialble,
    // combine the node and the info passed down from the parent
    if (node.status && node.status === 'AVAILABLE' && node.info_url) {
      return [{ ...node, ...parentInfo }];
    } else {
      return [];
    }
  }
};

const AOIBar = ({
  orgPplList,
  orgReportList,
  commsList,
  missionsList,
  alertsList,
  visibleLayers,
  t,
}) => {
  const { setViewState } = useMap();
  const dispatch = useDispatch();

  const [eventList, setEventList] = useState([]);
  const [selectedLayer, setSelectedLayer] = useState({});

  const { dateRange } = useSelector(state => state.common);
  const { defaultAoi } = useSelector(state => state.user);

  // start with filtered alerts, looks better starting with none and showing
  // the right number in a few seconds, than starting with lots and then
  // shortening the list
  const { filteredAlerts: events } = useSelector(state => state.eventAlerts);

  const mapRequests = useSelector(state => {
    // Find leaf nodes (mapRequests) in the mapRequest tree
    // and put these in a flat array for use in the pulldown
    const categories = state.dataLayer.allMapRequests;
    const aoiBbox = defaultAoi.features[0].bbox;
    const leafNodes = flattenDeep(
      categories.map(category => nodeVisitor(category, aoiBbox)),
    );
    return leafNodes;
  });

  const updateEventList = useCallback(() => {
    // default to last 3 days, else use date range selector
    const dateRangeParams = dateRange
      ? { start_date: dateRange[0], end_date: dateRange[1] }
      : {
          start_date: moment().subtract(3, 'days'),
          end_date: moment(),
        };

    const eventParams = {
      order: '-date',
      status: undefined,
      bbox: undefined,
      default_bbox: true,
      ...dateRangeParams,
    };
    dispatch(setEventParams(eventParams));
    dispatch(getAllEventAlerts(eventParams, true, false));
  }, [dateRange, dispatch]);

  useEffect(() => {
    updateEventList();
  }, [dateRange, updateEventList]);

  useEffect(() => {
    setEventList(events);
  }, [events]);

  const updateRasterLayer = newLayerId => {
    const selectedNode = mapRequests.find(layer => layer.key === newLayerId);
    setSelectedLayer(selectedNode);
  };

  const handleResetAOI = useCallback(() => {
    setViewState(
      getViewState(
        defaultAoi.features[0].properties.midPoint,
        defaultAoi.features[0].properties.zoomLevel,
      ),
    );
  }, [defaultAoi.features, setViewState]);

  return (
    <Container fluid="true">
      <Card className="px-3">
        <Row xs={1} sm={1} md={1} lg={2} xl={2} className="p-2 gx-2 row-cols-2">
          <Card className="gx-2">
            <Row xs={4} className="d-flex justify-content-end">
              <Button
                color="link"
                onClick={handleResetAOI}
                className="align-self-baseline pe-0"
              >
                {t('default-aoi')}
              </Button>
            </Row>
            {
              <Input
                id="sortByDate"
                className="btn-sm sort-select-input"
                name="sortByDate"
                placeholder={'Select a layer'}
                type="select"
                onChange={e => {
                  updateRasterLayer(e.target.value);
                }}
                value={selectedLayer.key}
              >
                {mapRequests?.length === 0 ? (
                  <option value={''}>--{t('No layers in this AOI')}--</option>
                ) : (
                  <option disabled={true} value={''}>
                    --{t('Select a layer')}--
                  </option>
                )}
                {mapRequests
                  ? mapRequests.map(request => (
                      <option
                        key={request.key}
                        value={request.key}
                      >{`${request.parentTitle} - ${request.title} (${request.datatype_id})`}</option>
                    ))
                  : null}
              </Input>
            }
            <MapComponent
              selectedLayer={selectedLayer}
              eventList={eventList}
              orgPplList={orgPplList}
              orgReportList={orgReportList}
              commsList={commsList}
              missionsList={missionsList}
              alertsList={alertsList}
              visibleLayers={visibleLayers}
            />
          </Card>
          <Container className="px-4 container">
            <Row>
              <EventsPanel eventList={events} />
            </Row>
            <Row>
              <Card
                className="card alert-card-secondary"
                style={{ minHeight: 300 }}
              >
                <div className="alert-title">
                  <p>Pin Values panel</p>
                </div>
                <div>
                  <p>To be done</p>
                </div>
              </Card>
            </Row>
          </Container>
        </Row>
      </Card>
    </Container>
  );
};

export default withTranslation(['common'])(AOIBar);
