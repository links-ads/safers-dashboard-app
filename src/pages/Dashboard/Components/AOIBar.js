import React, { useEffect, useState } from 'react';

import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Card } from 'reactstrap';

import EventsPanel from './EventsPanel';
import MapComponent from './Map';
import { setEventParams, getAllEventAlerts } from '../../../store/appAction';

const AOIBar = () => {
  const dispatch = useDispatch();

  const [eventList, setEventList] = useState([]);
  const { dateRange } = useSelector(state => state.common);

  // start with filtered alerts, looks better starting with none and showing
  // the right number in a few seconds, than starting with lots and then
  // shortening the list
  const { filteredAlerts: events } = useSelector(state => state.eventAlerts);

  const updateEventList = () => {
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
  };
  useEffect(() => {
    updateEventList();
  }, []);

  useEffect(() => {
    updateEventList();
  }, [dateRange]);

  useEffect(() => {
    setEventList(events);
  }, [events]);

  return (
    <Container fluid="true">
      <Card className="px-3">
        <Row xs={1} sm={1} md={1} lg={2} xl={2} className="p-2 gx-2 row-cols-2">
          <Card className="gx-2">
            <MapComponent eventList={eventList} />
          </Card>
          <Container className="px-4 container">
            <Row>
              <EventsPanel eventList={eventList} />
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

export default AOIBar;
