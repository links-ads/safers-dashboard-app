import React from 'react';

import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card } from 'reactstrap';

import { formatDate } from 'utility';

export const EventItem = ({ event, t }) => {
  return (
    <Card className="card alerts-card">
      <div xs={2}>
        <span className="alert-title">{event?.title}</span>
        <span className="alert-title float-end">
          <Link to="/event-alerts">
            <i className="mm-active bx bxs-hot btn float-end" />
          </Link>
        </span>
      </div>
      <div>
        <span className="text-black rounded-pill alert-badge event-alert-badge badge bg-secondary">
          {t(event?.status.toLowerCase(), { ns: 'common' })}
        </span>
      </div>
      <div>{`${t('Start', { ns: 'common' })} : ${formatDate(
        event?.start_date,
      )}`}</div>
    </Card>
  );
};

EventItem.propTypes = {
  event: PropTypes.any,
  t: PropTypes.func,
};

export default withTranslation(['dashboard'])(EventItem);
