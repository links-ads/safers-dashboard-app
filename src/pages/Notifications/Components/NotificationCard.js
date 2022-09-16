import React from 'react';
import PropTypes from 'prop-types'
import { Badge, Card, CardBody, CardText, Col, Row } from 'reactstrap';
import { formatDate } from '../../../store/utility';

const BADGETYPES = {
  STATUS : 'status',
  TYPE : 'type'
}

const NotificatonCard = ({ card }) => {

  const getBadge = (badgeType) => {
    return (
      <Badge className={`me-1 rounded-pill alert-badge ${badgeType == BADGETYPES.TYPE ? 'notification-badge' : 'to-verify'}  py-0 px-2 pb-0 mb-0`}>
        <span>{badgeType == BADGETYPES.TYPE ? card.type : card.status}</span>
      </Badge>
    )
  }
  

  return (
    <Card
      className={'alerts-card mb-2 '}>
      <CardBody className='px-0 py-1 my-2'>
        <Row>
          <Col className='ms-4'>
            <Row>
              <Col>
                <CardText className='mb-2'>
                  { card?.type ? getBadge(BADGETYPES.TYPE) : null }
                  { card?.status ? getBadge(BADGETYPES.STATUS) : null }
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
                  <Col className=''>
                    <span className="text-muted card-desc">
                      {formatDate(card.timestamp)}
                    </span>
                  </Col>
                  <Col>
                    <CardText className='bg-danger'>
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
