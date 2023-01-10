import React from 'react';
import { Card } from 'reactstrap';
import PropTypes from 'prop-types';

export const EventItem = ({event}) => {
  return (
    <Card className=''>
      <div>{event?.title}</div>
      <div>{event?.status}</div>
      <hr />
    </Card>
  );
}

EventItem.propTypes = {
  event: PropTypes.any,
}

