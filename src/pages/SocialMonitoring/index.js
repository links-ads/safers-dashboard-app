import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Card } from 'reactstrap';
import { FlyToInterpolator } from 'deck.gl';
import moment from 'moment';

import BaseMap from '../../components/BaseMap/BaseMap';
import DateRangePicker from '../../components/DateRangePicker/DateRange';
import TwitterContainer from './TwitterContainer';
import { getStats, getTweets, } from '../../store/appAction';

const getDefaultDateRange = () => {
  const from = moment(new Date()).add(-3, 'days').format('DD-MM-YYYY');
  const to = moment(new Date()).format('DD-MM-YYYY');
  return [from, to];
}

const SocialMonitoring = () => {
  const defaultAoi = useSelector(state => state.user.defaultAoi);
  const [viewState, setViewState] = useState(undefined);
  const [dateRange, setDateRange] = useState(getDefaultDateRange());
  const dispatch = useDispatch();

  useEffect(() => {
    if (!viewState) {
      setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel));
    }
  }, []);

  useEffect(() => {
    getSearchData()
  }, [dateRange, defaultAoi]);

  const getSearchData = () => {
    const params = {};
    if (dateRange.length > 1) {
      params.startDate = moment(dateRange[0])
      params.endDate = moment(dateRange[1])
    }
    if (defaultAoi) {
      params.aoi = defaultAoi
    }
    dispatch(getStats(params))
    dispatch(getTweets(params))
  }

  const getViewState = (midPoint, zoomLevel = 4) => {
    return {
      longitude: midPoint[0],
      latitude: midPoint[1],
      zoom: zoomLevel + 1.25,
      pitch: 0,
      bearing: 0,
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator()
    };
  }

  const handleDateRangePicker = (dates) => {
    let from = moment(dates[0]).format('DD-MM-YYYY');
    let to = moment(dates[1]).format('DD-MM-YYYY');
    setDateRange([from, to]);
  }

  return (
    <div className='page-content'>
      <div className='mx-2 sign-up-aoi-map-bg'>
        <Row>
          <Col xl={10}>
            <p className='align-self-baseline alert-title'>Social Monitor</p>
          </Col>
          <Col xl={2}>
            <DateRangePicker setDates={handleDateRangePicker} />
          </Col>
        </Row>
        <Row>
          <span>Total Tweets</span>
        </Row>
        <Row>
          <Card className='map-card mb-0' style={{ height: 670 }}>
            <BaseMap
              layers={[]}
              initialViewState={viewState}
              widgets={[/*search button or any widget*/]}
              screenControlPosition='top-right'
              navControlPosition='bottom-right'
            />
          </Card>
        </Row>
        <Row>
          <TwitterContainer dateRange={dateRange} />
        </Row>
      </div>
    </div >
  );
}

export default SocialMonitoring;