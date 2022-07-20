import React, { useState } from 'react';
import PropTypes from 'prop-types'
import { Card, CardBody, CardText, Col, Row } from 'reactstrap';
import { formatDate } from '../../../../store/utility';

import { useTranslation } from 'react-i18next';

const Comm = ({ card, reportId, setSelectedComm }) => {

  const { t } = useTranslation();
  const [seeMore, setSeeMore] = useState(true);

  const isSelected = card.mission_id === reportId

  const getMsg = (msg) => {
    if(seeMore){
      return (
        <>{msg.substr(0, 80)}... <a href="javascript:void(0)" onClick={() => {setSeeMore(false)}}>See more</a></>
      )
    }
    return <>{msg} <a href="javascript:void(0)" onClick={() => {setSeeMore(true)}}>See less</a></>;
  }

  return (
    <Card
      onClick={() => setSelectedComm(!isSelected ? card.mission_id : null)}
      className={'alerts-card mb-2 ' + (isSelected ? 'alert-card-active' : '')}>
      <CardBody className='p-0 m-2'>
        <Row className='mt-2'>
          <Col>
            <Row className='mt-2'>
              <Col>
                <p className="text-muted no-wrap mb-0">
                  {t('Start date', { ns: 'common' })}: {formatDate(card.startDate)} | {t('End date', { ns: 'common' })}: {formatDate(card.endDate)}
                </p>
              </Col>

            </Row>
            <Row className='mt-0 mb-1'>
              <Col>
                <p className="text-muted no-wrap">
                  {t('Assigned to', { ns: 'chatBot' })}: {(card.assignedTo.organization)}/{(card.assignedTo.organization)}/{(card.assignedTo.name)}
                </p>
                <CardText>
                  {t('Message', { ns: 'common' })}: {getMsg(card.message)}
                </CardText>
              </Col>
            </Row>
          </Col>
        </Row>

      </CardBody>
    </Card>
  )
}

Comm.propTypes = {
  card: PropTypes.any,
  reportId: PropTypes.string,
  setSelectedComm: PropTypes.func,
  setFavorite: PropTypes.func,
}

export default Comm;
