import React from 'react';
import PropTypes from 'prop-types'
import { Card, CardBody, CardText, CardTitle, Col, Row, Button } from 'reactstrap';
import { formatDate } from '../../../store/utility';

const Alert = ({ card, alertId, setSelectedAlert, setFavorite }) => {

  return (
    <Card
      onClick={() => setSelectedAlert(card.id)}
      className={'alerts-card mb-2 ' + (card.id == alertId ? 'alert-card-active' : '')}>
      <CardBody className='p-0 m-2'>
        
        <Row className='mt-4'>
          <Col md={1}>
            <button
              type="button"
              className="btn float-start py-0 px-1"
              onClick={(e) => {
                e.stopPropagation();
                setFavorite(card.id);
              }}
            >
              <i className={`mdi mdi-star${!card.isFavorite ? '-outline' : ''} card-title`}></i>
            </button>
          </Col>
          <Col>
            <Row>
              <Col>
                <CardTitle>
                  <span className='card-title'>Report Name A</span>
                </CardTitle>
                <CardText className='card-desc'>
                  {card.description}
                </CardText>
              </Col>
              <Col md={4} className='text-end'>
                <Button className="btn btn-primary px-3 py-2">OPEN</Button>
              </Col>
            </Row>
            <Row className='mt-2'>
              <Col>
                <small className="text-muted card-desc date no-wrap">
                  Start: {formatDate(card.start)} - End: {formatDate(card.end)}
                </small>
              </Col>
              
            </Row>
            <Row className='mt-0'>
              <Col>
                <small className="text-muted card-desc date no-wrap">
                  Location: lat 45.065466 long 7.659904
                </small>
              </Col>
              <Col md={2}>
                <CardText>
                  <span className='float-end alert-source-text me-2'>Chatbot</span>
                </CardText>
              </Col>
            </Row>
          </Col>
        </Row>

      </CardBody>
    </Card>
  )
}

Alert.propTypes = {
  card: PropTypes.any,
  alertId: PropTypes.string,
  setSelectedAlert: PropTypes.func,
  setFavorite: PropTypes.func,
}

export default Alert;