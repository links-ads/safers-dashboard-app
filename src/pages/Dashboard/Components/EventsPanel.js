import React from 'react';
import { Card, Row } from 'reactstrap';
import { EventItem } from './EventItem'
import { withTranslation } from 'react-i18next'
import PropTypes from 'prop-types';

const EventsPanel = ({t, eventList}) => {
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
  t: PropTypes.func,
  eventList: PropTypes.arrayOf(PropTypes.object)
}

export default withTranslation(['dashboard'])(EventsPanel);
