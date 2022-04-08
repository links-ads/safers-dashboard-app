import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Card, CardHeader, CardBody, CardFooter } from 'reactstrap';
import { FlyToInterpolator } from 'deck.gl';
import moment from 'moment';

import BaseMap from '../../components/BaseMap/BaseMap';
import DateRangePicker from '../../components/DateRangePicker/DateRange';
import TwitterContainer from './TwitterContainer';
import { getStats, getTweets, } from '../../store/appAction';
import { formatNumber } from '../../store/utility';
import IconClusterLayer from './IconClusterLayer';
import iconMapping from '../../constants/location-icon-mapping.json';
import iconAtlas from '../../assets/images/location-icon-atlas.png';

const MOCK_DATA =
  'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/icon/meteorites.json';//using this mock data until the tweets API ready with coordinates.

const getDefaultDateRange = () => {
  const from = moment(new Date()).add(-3, 'days').format('DD-MM-YYYY');
  const to = moment(new Date()).format('DD-MM-YYYY');
  return [from, to];
}

const SocialMonitoring = () => {
  const defaultAoi = useSelector(state => state.user.defaultAoi);
  const stats = useSelector(state => state.dashboard.stats);
  const tweetsTrend = 23;//hard coded text until API available
  const socialStats = MOCK_DATA;
  const [iconLayer, setIconLayer] = useState(undefined);
  const [viewState, setViewState] = useState(undefined);
  const [dateRange, setDateRange] = useState(getDefaultDateRange());
  const dispatch = useDispatch();

  useEffect(() => {
    if (!viewState) {
      setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel));
    }
  }, []);

  useEffect(() => {
    getSearchData();
    setIconLayer(getIconLayer(socialStats))
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

  const getIconLayer = (data) => {
    return (new IconClusterLayer({
      id: 'icon-cluster',
      sizeScale: 40,
      data,
      pickable: true,
      getPosition: d => d.coordinates,
      iconAtlas,
      iconMapping,
    }))
  }
  const handleDateRangePicker = (dates) => {
    let from = moment(dates[0]).format('DD-MM-YYYY');
    let to = moment(dates[1]).format('DD-MM-YYYY');
    setDateRange([from, to]);
  }

  return (
    <div className='page-content'>
      <div className='mx-2 sign-up-aoi-map-bg'>
        <Row className='mb-3'>
          <Col xl={9}>
            <p className='align-self-baseline alert-title'>Social Monitor</p>
          </Col>
          <Col xl={3}>
            <DateRangePicker setDates={handleDateRangePicker} />
          </Col>
        </Row>
        <Row className='mb-3'>
          <Col xl={3} md={6} sm={6}>
            <Card className='tweets-card px-2 pb-3'>
              <CardHeader>
                Total Tweets
              </CardHeader>
              <CardBody className='pb-0'>
                <span className='float-start total-tweets'>{stats ? formatNumber(stats.socialEngagement) : 'N/A'}</span>
              </CardBody>
              <CardFooter className='py-0'>
                <span className='float-end tweets-trend'>{`${tweetsTrend > 0 ? '+' : '-'}${tweetsTrend}%`}</span>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row className='mb-3 px-3'>
          <Card className='map-card mb-0' style={{ height: 670 }}>
            <BaseMap
              layers={[iconLayer]}
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