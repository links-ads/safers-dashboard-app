import React from 'react';
import PropTypes from 'prop-types';

import { Col, Card, CardHeader, CardBody, CardFooter, Row } from 'reactstrap';
import { useSelector } from 'react-redux';
import { formatNumber } from '../../../store/utility';

//i18n
import { withTranslation } from 'react-i18next'

const StatsContainer = (props) => {
  const stats = useSelector(state => state.dashboard.stats);

  return(
    <Row role='stats'>
      <Col md={3} sm={6}>
        <Card className='stats-card px-2 pb-3'>
          <CardHeader>
            {props.t('reports')}
          </CardHeader>
          <CardBody className='mx-auto'>
            {stats ? formatNumber(stats.reports) : 'N/A'}
          </CardBody>
          <CardFooter>
          </CardFooter>
        </Card>
      </Col>
      <Col md={3} sm={6}>
        <Card className='stats-card px-2 pb-3'>
          <CardHeader>
            {props.t('alerts')}
          </CardHeader>
          <CardBody className='mx-auto'>
            {stats ? formatNumber(stats.alerts) : 'N/A'}
          </CardBody>
          <CardFooter>
          </CardFooter>
        </Card>
      </Col>
      <Col md={3} sm={6} >
        <Card className='stats-card px-2 pb-3'>
          <CardHeader>
            {props.t('events')}
          </CardHeader>
          <CardBody className='mx-auto'>
            {stats ? formatNumber(stats.events) : 'N/A'}
          </CardBody>
          <CardFooter>
          </CardFooter>
        </Card>
      </Col>
      <Col md={3} sm={6}>
        <Card className='stats-card px-2 pb-3'>
          <CardHeader>
            {props.t('social engagement')}
          </CardHeader>
          <CardBody className='mx-auto'>
            <span>{stats ? formatNumber(stats.socialEngagement) : 'N/A'}</span>
          </CardBody>
          <CardFooter className='mx-auto'>
            {props.t('tot tweets')}
          </CardFooter>
        </Card>
      </Col>
    </Row>
  )
}

StatsContainer.propTypes = {
  t: PropTypes.any,
}

export default withTranslation(['dashboard'])(StatsContainer);