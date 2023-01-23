/* eslint-disable no-unreachable */
import React, { useEffect, useState}  from 'react';
import { Container, Row, Card, Input } from 'reactstrap';
import EventsPanel from './EventsPanel';
import MapComponent from './Map'
import { useDispatch, useSelector } from 'react-redux';
import { setEventParams } from '../../../store/appAction';
import { getAllEventAlerts } from '../../../store/appAction';
import { moment } from 'moment'
import { flattenDeep } from 'lodash'
import { intersect, polygon } from '@turf/turf'
import { withTranslation } from 'react-i18next'
import PropTypes from 'prop-types';
import wkt from 'wkt';

const bboxToPolygon = (bbox) => {
  // our Bbox is a 4-tuple with minx, miny, maxx, maxy, 
  // convert to a multipolygon (doesnt work with with polygon, not sure why)
  const minimumX = bbox[0];
  const minimumY = bbox[1];
  const maximumX = bbox[2];
  const maximumY = bbox[3];
  const ring = [[[minimumX,minimumY],[minimumX,maximumY],[maximumX,maximumY],[maximumX,minimumY],[minimumX,minimumY]]];
  return ring;
}

const doesItOverlapAoi = (node, userAoi, showAll=false) => {
  // using Turf.js to test for an overlap between the layer geometry and
  // the bounding box of the user's AOI
  const featureGeometry = node?.geometry;
  if (showAll) {
    return true; // used for debugging
  }
  if (!(featureGeometry && userAoi)) {
    return false;
  }
  const aoiPolygon = polygon(bboxToPolygon(userAoi));

  // avoid error if we get a geometrycollection, turf doesn't support these
  const featureAsWKT = wkt.stringify(featureGeometry);
  if (featureAsWKT.includes('GEOMETRYCOLLECTION')) {
    console.info(`Feature AOI is a Geometry collection, this is not supported (feature title is ${node.title})`);
    return false;
  }
  const intersects = intersect(aoiPolygon, featureGeometry);
  return (intersects!=null);
}

const nodeVisitor = (node, userAoi, parentInfo={}) => {
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
        }
        return node.children.map(child => nodeVisitor(child, userAoi, passDown));
      }
      else {
        // prune the tree, these are out of bounds
        return [];
      }
    } else {
      // no geometry, so we're at top level
      return node.children.map(child => nodeVisitor(child, userAoi));
    }
  } else {
    // no children, so a leaf node
    // combine the node and the info passed down from the parent
    return [{...node, ...parentInfo}];
  }
}

const AOIBar = ({t}) => {
  const dispatch = useDispatch();
  
  const [eventList, setEventList] = useState([]);
  const [selectedLayerId, setSelectedLayerId] = useState('');
  const [selectedLayer, setSelectedLayer] = useState({});
  
  const {dateRange} = useSelector(state => state.common);
  const {defaultAoi} = useSelector(state => state.user);
  
  const mapRequests = useSelector(state => {
    // Find leaf nodes (mapRequests).
    const categories = state.dataLayer.allMapRequests;
    const aoiBbox = defaultAoi.features[0].bbox;
    const leafNodes = flattenDeep(categories.map(category => nodeVisitor(category, aoiBbox)))
    return leafNodes;
  } );

  // start with filtered alerts, looks better starting with none and showing
  // the right number in a few seconds, than starting with lots and then
  // shortening the list
  const {filteredAlerts: events } = useSelector(state => state.eventAlerts);  
 
  const updateEventList = ()=> {
    // default to last 3 days, else use date range selector
    const dateRangeParams = dateRange 
      ? { start_date: dateRange[0], end_date: dateRange[1] }
      : { start_date: moment.date().subtract(3,'days'),
        end_date: moment.date()}

    const eventParams = {
      order: '-date',
      status: undefined,
      bbox:undefined,
      default_bbox: true,
      ...dateRangeParams
    };
    dispatch(setEventParams(eventParams))
    dispatch(getAllEventAlerts(eventParams, true, false));  
  }

  useEffect (() => {
    updateEventList();
  }, []);

  useEffect (() => {
    //
  }, [mapRequests]);

  useEffect (() => {
    setSelectedLayer(mapRequests.find(layer => layer.key === selectedLayerId));
  }, [selectedLayerId]);

  useEffect (() => {
    console.log(`selectedLayer object ${JSON.stringify(selectedLayer)}`);
  }, [selectedLayer]);

  useEffect (() => {
    updateEventList();
  }, [dateRange]);

  useEffect(()=> {
    setEventList(events);
  }, [events]);

  return(
    <Container fluid="true" >
      <Card className="px-3">
        <Row xs={1} sm={1} md={1} lg={2} xl={2} className="p-2 gx-2 row-cols-2">
          <Card className="gx-2" >
            {mapRequests && mapRequests.length>0
              ?
              <Input
                id="sortByDate"
                className="btn-sm sort-select-input"
                name="sortByDate"
                placeholder={'Select a layer'}
                type="select"
                onChange={(e) => {setSelectedLayerId(e.target.value)}}
                value={selectedLayerId}
              >
                {
                  mapRequests && mapRequests.length !== 0
                    ? <option value={''} >--{t('Select a layer')}--</option>
                    : <option value={''} >--{t('No layers in this AOI')}--</option>
                }
                {
                  mapRequests && mapRequests.length !== 0
                    ? mapRequests.map(request => <option key={`item_${request.key}`} value={`${request.key}`}>{`${request.datatype_id} : ${request.title}`}</option>)
                    : null
                } 
              </Input>
              : null
            }
            <MapComponent eventList={eventList} />
          </Card>
          <Container className="px-4 container">
            <Row >
              <EventsPanel eventList={eventList} />
            </Row>
            <Row >
              <Card className="card alert-card-secondary" style={{minHeight: 300}}>
                <div className="alert-title"><p>Pin Values panel</p></div>
                <div><p>To be done</p></div>
              </Card>                
            </Row>
          </Container>
        </Row>
      </Card>
    </Container>
  );
};

AOIBar.propTypes = {
  t: PropTypes.func
}

export default withTranslation(['dashboard'])(AOIBar);
