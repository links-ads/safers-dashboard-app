import React from 'react';
import PropTypes from 'prop-types'
import { Badge, Card, CardBody, CardText, CardTitle, Col, Row, Button } from 'reactstrap';
import { formatDate } from '../../../../store/utility';
import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

const Mission = ({ card, missionId, setSelectedMission/*, setFavorite*/ }) => {

  const { t } = useTranslation();

  const navigate = useNavigate();

  const isSelected = card.mission_id === missionId

  return (
    <Card
      onClick={() => setSelectedMission(!isSelected ? card.mission_id : null)}
      className={'alerts-card mb-2 ' + (isSelected ? 'alert-card-active' : '')}>
      <CardBody className='p-0 m-2'>
        <Row className='mt-2'>
          <Col>
            <Badge className="me-1 rounded-pill alert-badge py-0 px-2 pb-0 mb-2">
              <span>{card.status}</span>
            </Badge>
            <Row>
              <Col>
                <CardTitle>
                  <span className='card-title'>{card.name}</span>
                </CardTitle>
                <CardText className='card-desc'>
                  {card.description}
                </CardText>
              </Col>
            </Row>
            <Row className='mt-2'>
              <Col>
                <p className="text-muted no-wrap mb-0">
                  Start Date: {formatDate(card.start_date, 'DD-MM-YYYY')} | End Date: {formatDate(card.end_date, 'DD-MM-YYYY')}
                </p>
                <p className="text-muted no-wrap">
                  Assigned To: 
                </p>
              </Col>
            </Row>
            <Row className='mt-0'>
              <Col md={10}>
                <p className="text-muted no-wrap">
                  Associated files: <Button color='link' onClick={() => { navigate(`/reports-dashboard/${card.mission_id}`); }} className='align-self-baseline pe-0'>{t(card.report_id, { ns: 'common' })}</Button>
                </p>
              </Col>
              <Col md={2}>
                <CardText>
                  <span className='float-end alert-source-text me-2'>
                    {card.source.toUpperCase()}
                  </span>
                </CardText>
              </Col>
            </Row>
          </Col>
        </Row>

      </CardBody>
    </Card>
  )
}

Mission.propTypes = {
  card: PropTypes.any,
  missionId: PropTypes.string,
  setSelectedMission: PropTypes.func,
  setFavorite: PropTypes.func,
}

export default Mission;
