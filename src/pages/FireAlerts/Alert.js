import React from 'react';
import PropTypes from 'prop-types'
import { Badge, Card, CardBody, CardText, CardTitle } from 'reactstrap';

const Alert = ({ card, setSelectedAlert, alertId }) => {
  return (
    <Card
      onClick={() => setSelectedAlert(card.id)}
      className={'mb-3 ' + (card.id == alertId ? 'border border-secondary' : '')}>
      <CardBody>
        <CardText className='mb-2'>
          <Badge className="me-1 rounded-pill bg-success">
            {card.status}
          </Badge>
          <button
            type="button"
            className="btn float-end py-0 px-1"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedAlert(card.id, true);
            }}
          >
            <i className="mdi mdi-pencil d-block font-size-16"></i>
          </button>
        </CardText>
        <button
          type="button"
          className="btn float-start py-0 px-1"
        >
          <i className="mdi mdi-star-outline d-block font-size-16"></i>
        </button>
        <CardTitle>{card.title}</CardTitle>
        <CardText>
          {card.description}
        </CardText>
        <CardText>
          <small className="text-muted">
            {card.timestamp}
          </small>
          <span className='float-end'>{card.source}</span>
        </CardText>
      </CardBody>
    </Card>
  )
}

Alert.propTypes = {
  card: PropTypes.any,
  setSelectedAlert: PropTypes.func,
  alertId: PropTypes.string
}

export default Alert;
