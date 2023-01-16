import React, { useEffect, useState }  from 'react';
import { Container, Row, Card } from 'reactstrap';
import EventsPanel from './EventsPanel';
import MapComponent from './Map';
import { useDispatch, useSelector } from 'react-redux';
import { setEventParams } from '../../../store/appAction';
import { getAllEventAlerts } from '../../../store/appAction';

const AOIBar = () => {

  const dispatch = useDispatch();
  const { allAlerts: events } = useSelector(state => state.eventAlerts);  
  const [eventList, setEventList] = useState([]);

  useEffect (() => {
    const eventParams = {
      order: '-date',
      status: undefined,
      bbox:undefined,
      default_bbox: true,
    };
    dispatch(setEventParams(eventParams))
    dispatch(getAllEventAlerts(eventParams, true, false));
  }, []);

  useEffect(()=> {
    setEventList(events);
    console.log('events', events);
  }, [events]);

  return(<div >
    <Container fluid="true" >
      <Card className="px-3">
        <Row xs={1} sm={1} md={1} lg={2} xl={2} className="p-2 gx-2 row-cols-2">
          <Card className="gx-2" >
            <MapComponent  />
          </Card>
          <Container className="p-2 my-0">
            <Row >
              <EventsPanel eventList={eventList}/>
            </Row>
            <Row >
              <Card >
                <div className="alert-title"><p>Pin Values panel</p></div>
                <div><p>To be done</p></div>
              </Card>                
            </Row>
          </Container>
        </Row>
      </Card>
    </Container>
  </div>
  );
};

export default AOIBar;
