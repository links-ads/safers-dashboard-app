import React from 'react';

import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, Row } from 'reactstrap';

import { EventItem } from './EventItem';

const EventsPanel = ({ t, eventList }) => (
  <Card className="mx-auto w-11 ml-2 alert-card-secondary">
    <Row className="align-self-baseline alert-title">
      <Link to="/event-alerts">
        <p>
          {t('Events', { ns: 'common' })} <i className="bx bxs-hot"></i>
        </p>
      </Link>
    </Row>
    <Row style={{ maxHeight: 250 }} className="ml3-3 mr-5 overflow-auto">
      {eventList && eventList.length > 0 ? (
        eventList.map(event => (
          <EventItem key={event?.id} event={event} t={t} />
        ))
      ) : (
        <p>{t('No current events')}</p>
      )}
    </Row>
  </Card>
);
EventsPanel.propTypes = {
  t: PropTypes.func,
  eventList: PropTypes.arrayOf(PropTypes.any),
};

export default withTranslation(['dashboard'])(EventsPanel);
