import React, { useEffect, useState } from 'react';
import { Row, Col,  } from 'reactstrap';


import { useSelector, useDispatch } from 'react-redux';
import { getAllAreas } from '../../../../store/appAction';
import { setPolygonLayer, setViewState } from '../../../../store/common/action';
import { getInSituMedia, getStats, getTweets, getWeatherStats, getWeatherVariables } from '../../../../store/dashboard/action';

import { getPolygonLayer, getViewState } from '../../../../helpers/mapHelper';
import moment from 'moment';
import DateComponent from '../../../../components/DateRangePicker/DateRange';

const SearchContainer = () => {
  const dispatch = useDispatch()
  const defaultAoi = useSelector(state => state.user.defaultAoi);
  const selectedAoi = useSelector(state => state.common.selectedAoi);
  
  const [dateRange, setDateRange] = useState([]);

  useEffect(() => {
    dispatch(getAllAreas())
    setMapLayers(defaultAoi)
  }, []);

  const getSearchData = () => {
    const searchAoi = selectedAoi ? selectedAoi : defaultAoi.features[0].properties.id
    const params = {};
    if(dateRange.length>1){
      params.startDate = moment(dateRange[0])
      params.endDate = moment(dateRange[1])
    }
    if(searchAoi) {
      params.aoi = searchAoi
    }
    dispatch(getStats(params))
    dispatch(getWeatherStats(params))
    dispatch(getWeatherVariables(params))
    dispatch(getInSituMedia(params))
    dispatch(getTweets(params))
  }

  useEffect(() => {
    getSearchData()
  }, [dateRange, selectedAoi]);

  const setMapLayers = (objAoi) => {
    dispatch(setPolygonLayer(getPolygonLayer(objAoi)));
    dispatch(setViewState(getViewState(objAoi.features[0].properties.midPoint, objAoi.features[0].properties.zoomLevel)))
  }

  const setDates = (dates) => {
    setDateRange(dates)
    getSearchData()
  }

  return(
    <Row className='g-0'>
      <Col >
        <Row>
          <Col></Col>
          <Col md={3}>
            <DateComponent setDates={setDates}/>
          </Col>
        </Row>
      </Col>
    </Row>
  )}

export default SearchContainer;
