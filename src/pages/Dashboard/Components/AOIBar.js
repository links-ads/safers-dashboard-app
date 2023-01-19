import React, { useEffect, useState}  from 'react';
import { Container, Row, Card, Input } from 'reactstrap';
import EventsPanel from './EventsPanel';
import MapComponent from './Map'
import { useDispatch, useSelector } from 'react-redux';
import { setEventParams } from '../../../store/appAction';
import { getAllEventAlerts } from '../../../store/appAction';
import { moment } from 'moment'
import { flattenDeep } from 'lodash'

const findAllLeafNodes = (category) => {
  // recursive function. Return the list of children of this node
  // we then use lodash flattenDeep to get a flat list for the dropdown
  if (!category.children) {
    return category;
  }
  return category.children.map(item => findAllLeafNodes(item?.children));
}

const AOIBar = () => {
  const dispatch = useDispatch();
  
  const [eventList, setEventList] = useState([]);
  const [selectedLayer, setSelectedLayer] = useState({});

  const {dateRange} = useSelector(state => state.common);
  
  const mapRequests = useSelector(state => {
    const categories = state.dataLayer.allMapRequests;
    const leafNodes = flattenDeep( categories.map(category => findAllLeafNodes(category)))
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
    console.log(`selectedLayer has changed to ${selectedLayer}`);
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
          <Card>
            <Input
              id="sortByDate"
              className="btn-sm sort-select-input"
              name="sortByDate"
              placeholder={!mapRequests ? 'Loading...' : 'Select a layer'}
              type="select"
              onChange={(e) => {setSelectedLayer(e.target.value)}}
              value={selectedLayer}
            >
              {
                mapRequests
                  ? mapRequests.map(request => <option key={`item_${request.key}`} value={`item_${request.key}`}>{`${request.datatype_id} : ${request.title}`}</option>)
                  : null
              }
              
            </Input>
          </Card>
          <Card className="gx-2" >
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
