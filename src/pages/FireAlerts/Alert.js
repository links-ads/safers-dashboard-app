import React from 'react';
import PropTypes from 'prop-types'
import { Badge, Card, CardBody, CardText, CardTitle, Col, Row } from 'reactstrap';

const Alert = ({ card, setSelectedAlert, alertId }) => {
  return (
    <Card
      onClick={() => setSelectedAlert(card.id)}
      className={'alerts-card mb-2 ' + (card.id == alertId ? 'active' : '')}>
      <CardBody className='p-0 m-2'>
        <Row>
          <Col md={1}>
          </Col>
          <Col>
            <CardText className='mb-2'>
              <Badge className="me-1 rounded-pill alert-badge unvalidated py-0 px-2 pb-0 mb-0">
                <span>{card.status}</span>
              </Badge>
              <button
                type="button"
                className="btn float-end py-0 px-1"
              >
                <i className="mdi mdi-pencil d-block font-size-16"></i>
              </button>
            </CardText>
          </Col>
        </Row>
        <Row>
          <Col md={1}>
            <button
              type="button"
              className="btn float-start py-0 px-1"
            >
              <i className="mdi mdi-star-outline card-title"></i>
            </button>
          </Col>
          <Col>
            <Row>
              <CardTitle>
                <span className='card-title'>{card.title}</span>
              </CardTitle>
              <CardText className='card-desc'>
                {card.description}
              </CardText>
            </Row>
            <Row className='mt-2'>
              <Col>
                <small className="text-muted card-desc">
                  {card.timestamp}
                </small></Col>
              <Col>
                <CardText>
                  <span className='float-end alert-source-text me-2'>{card.source}</span>
                </CardText></Col>
            </Row>
          </Col>
        </Row>
        
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
