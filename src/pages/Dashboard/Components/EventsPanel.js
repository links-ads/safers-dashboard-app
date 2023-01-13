import React, { useEffect, useState }  from 'react';
import { Card, Row } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setEventParams } from '../../../store/appAction';
import { getAllEventAlerts } from '../../../store/appAction';
import { EventItem } from './EventItem'
import { withTranslation } from 'react-i18next'
import PropTypes from 'prop-types';

const EventsPanel = ({t}) => {
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

  useEffect(()=> setEventList(events), [events])

  return (
    <Card>
      <Row>
        <p className='alert-title'>{t('Events', {ns: 'common'})}</p>
      </Row>
      <Row>    
        { eventList && eventList.length>0 ?
          eventList.map( event => <EventItem key={event?.id} event={event} t={t} /> ) :
          <p>{t('No current events')}</p>
        }
      </Row>
    </Card>
  );
}

EventsPanel.propTypes = {
  t: PropTypes.func
}

export default withTranslation(['dashboard'])(EventsPanel);
