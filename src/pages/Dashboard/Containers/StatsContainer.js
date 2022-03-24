import React, { useEffect } from 'react';
import { Col, Card, CardHeader, CardBody, CardFooter } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getStats } from '../../../store/dashboard/action';
import { formatNumber } from '../../../store/utility';

const StatsContainer = () => {
  const dispatch = useDispatch();
  const stats = useSelector(state => state.dashboard.stats);

  useEffect(() => {
    dispatch(getStats())
  }, []);

  return(<>
    <Col md={3} sm={6}>
      <Card className='stats-card px-2 pb-3'>
        <CardHeader>
              Reports
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
              Alerts
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
              Events
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
              Social Engagement
        </CardHeader>
        <CardBody className='mx-auto'>
          <span>{stats ? formatNumber(stats.socialEngagement) : 'N/A'}</span>
        </CardBody>
        <CardFooter className='mx-auto'>
                Total number of tweets
        </CardFooter>
      </Card>
    </Col>
  </>)
}
export default StatsContainer;