import React from 'react';
import PropTypes from 'prop-types'
import { Card, CardBody, CardText, CardTitle, Col, Row } from 'reactstrap';
import { formatDate } from '../../../../store/utility';
import { useTranslation } from 'react-i18next';

const People = ({ card, peopleId, setSelectedPeople/*, setFavorite*/ }) => {  

  const { t } = useTranslation();

  const isSelected = card.people_id === peopleId

  return (
    <Card
      onClick={() => setSelectedPeople(!isSelected ? card.people_id : null)}
      className={'alerts-card mb-2 ' + (isSelected ? 'alert-card-active' : '')}>
      <CardBody className='p-0 m-2'>
        <Row className='mt-2'>
          <Col>
            <Row>
              <Col>
                <CardTitle>
                  <span className='card-title'>{card.username}</span>
                </CardTitle>
                <CardText className='card-desc'>
                  {t('Status')}: {card.status}
                </CardText>
                <CardText className='card-desc'>
                  {t('Activity')}: {card.activity}
                </CardText>
              </Col>
            </Row>
            <Row className='mt-0'>
              <Col>
                <p className="text-muted no-wrap">
                  {t('location')}: {(card.location).join(', ')}
                </p>
              </Col>
              <Col>
                <CardText>
                  <span className='float-end alert-source-text me-2'>
                    {t('Last Updated')}: {formatDate(card.timestamp, 'YYYY-MM-DD HH:mm')}
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

People.propTypes = {
  card: PropTypes.any,
  peopleId: PropTypes.string,
  setSelectedPeople: PropTypes.func,
  setFavorite: PropTypes.func,
}

export default People;
