import React from 'react';
import PropTypes from 'prop-types'
import { Card, CardBody, CardText, CardTitle, Col, Row, Button } from 'reactstrap';
import { formatDate } from '../../../store/utility';

import { useTranslation } from 'react-i18next';

const Alert = ({ card, alertId, setSelectedAlert, setFavorite }) => {

  const {t} = useTranslation();

  return (
    <Card
      onClick={() => setSelectedAlert(card.id)}
      className={'reports-card mb-2 ' + (card.id == alertId ? 'alert-card-active' : '')}>
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
                  <span className='card-title font-size-18'>{card.name}</span>
                </CardTitle>
                <CardText className='card-desc'>
                  {card.description}
                </CardText>
              </Col>
              <Col md={4} className='text-end'>
                <Button className="btn btn-primary px-3 py-2">{t('open', {ns: 'common'})}</Button>
              </Col>
            </Row>
            <Row className='mt-2'>
              <Col>
                <small className="card-desc no-wrap">
                  {formatDate(card.date, 'll HH:MM')}
                </small>
              </Col>
              
            </Row>
            <Row className='mt-0'>
              <Col>
                <small className="card-desc no-wrap">
                  {card.location}
                </small>
              </Col>
              <Col md={2}>
                <CardText>
                  <span className='float-end card-desc me-2'>{card.source.join(', ')}</span>
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