import React from 'react';
import PropTypes from 'prop-types'
import { Badge, Card, CardBody, CardText, Col, Row } from 'reactstrap';
import { formatDate } from '../../../store/utility';

const NotificatonCard = ({ card }) => {

  const getBadge = () => {
    return (
      <Badge className='me-1 rounded-pill alert-badge notification-badge py-0 px-2 pb-0 mb-0'>
        <span>{card.status}</span>
      </Badge>
    )
  }

  return (
    <Card
      className={'alerts-card mb-2 '}>
      <CardBody className='p-0 m-2'>
        <Row>
          <Col className='ms-4'>
            <Row>
              <Col>
                <CardText className='mb-2'>
                  {getBadge()}
                </CardText>
              </Col>
            </Row>
            <Row>
              <Col>
                <Row>
                  <CardText className='card-desc'>
                    {card.description}
                  </CardText>
                </Row>
                <Row className='mt-2'>
                  <Col>
                    <p className="text-muted card-desc">
                      {formatDate(card.timestamp)}
                    </p>
                  </Col>
                  <Col>
                    <CardText>
                      <span className='float-end alert-source-text me-2 text-uppercase'>{card.source}</span>
                    </CardText>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

NotificatonCard.propTypes = {
  card: PropTypes.any,
  alertId: PropTypes.string,
  setSelectedAlert: PropTypes.func,
  setFavorite: PropTypes.func,
}

export default NotificatonCard;
