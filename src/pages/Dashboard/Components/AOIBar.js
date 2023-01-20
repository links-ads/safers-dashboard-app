import React, { useEffect, useState}  from 'react';
import { Container, Row, Card, Input } from 'reactstrap';
import EventsPanel from './EventsPanel';
import MapComponent from './Map'
import { useDispatch, useSelector } from 'react-redux';
import { setEventParams } from '../../../store/appAction';
import { getAllEventAlerts } from '../../../store/appAction';
import { moment } from 'moment'
import { flattenDeep } from 'lodash'

const nodeVisitor = (node) => {
  // node visitor. This is a recursive function called on each node
  // in the tree. We use this to veto certain nodes based on AOI
  // geometry intersection
  if (node.children) {
    console.log('node key (has children)', node.key);
    if (node.geometry) {
      console.log('has geometry, test it here');
    }
    return node.children.map(child => nodeVisitor(child));
  } else {
    console.log('node key (leaf node)', node.key);
    return [node];
  }
}


const AOIBar = () => {
  const dispatch = useDispatch();
  
  const [eventList, setEventList] = useState([]);
  const [selectedLayerId, setSelectedLayerId] = useState('');
  const [selectedLayer, setSelectedLayer] = useState({});

  const {dateRange} = useSelector(state => state.common);
  
  const mapRequests = useSelector(state => {
    // Find leaf nodes (mapRequests).

    const categories = state.dataLayer.allMapRequests;
    const leafNodes = flattenDeep(categories.map(category => nodeVisitor(category)))
    //console.log('leafNodes', JSON.stringify(leafNodes));
    
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
    //console.log('MapRequests has changed to', mapRequests);
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
            <Input
              id="sortByDate"
              className="btn-sm sort-select-input"
              name="sortByDate"
              placeholder={!mapRequests ? 'Loading...' : 'Select a layer'}
              type="select"
              onChange={(e) => {setSelectedLayerId(e.target.value)}}
              value={selectedLayerId}
            >
              {
                mapRequests
                  ? mapRequests.map(request => <option key={`item_${request.key}`} value={`${request.key}`}>{`${request.datatype_id} : ${request.title}`}</option>)
                  : null
              }
              
            </Input>
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

export default AOIBar;
