import React, { useEffect, useState } from 'react';
import { Row, Col, Label, Input, FormGroup,  } from 'reactstrap';

import DateRangeComponent from '../Components/DateRange';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import { getAllAreas } from '../../../store/appAction';
import { setPolygonLayer, setSelectedAoi, setViewState } from '../../../store/common/action';
import { getInSituMedia, getStats, getTweets, getWeatherStats, getWeatherVariables } from '../../../store/dashboard/action';

import { getPolygonLayer, getViewState } from '../../../helpers/mapHelper';
import moment from 'moment';

const SearchContainer = () => {
  const dispatch = useDispatch()
  const defaultAoi = useSelector(state => state.user.defaultAoi);
  const allAoi = useSelector(state => state.common.aois);
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

  const selectAoi = (e) => {
    const objAoi = _.find(allAoi, { features: [{ properties: { id: parseInt(e.target.value) } }] })
    dispatch(setSelectedAoi(parseInt(e.target.value)));
    setMapLayers(objAoi)
    getSearchData()
  }

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
          <Col md={6} xs={12} className='' form>
            <FormGroup className="form-group">
              <Label
                for="exampleEmail"
              >
                Area of interest :
              </Label>
              <Input
                id="selectAoiDashboard"
                className='w-50'
                name="select"
                type="select"
                onChange={(e) => selectAoi(e)}
                value={selectedAoi ? selectedAoi : 
                  defaultAoi ? defaultAoi.features[0].properties.id : ''}
              >
                <option value='' key={''}> ---------- Select Area -----------</option>
                {allAoi.map((aoi, index) => <option key={index} value={aoi.features[0].properties.id}>
                  {aoi.features[0].properties.country} - {aoi.features[0].properties.name}
                </option>)}
              </Input>
            </FormGroup>
          </Col>
          <Col></Col>
          <Col md={3}>
            <DateRangeComponent setDates={setDates}/>
          </Col>
        </Row>
      </Col>
    </Row>
  )}

export default SearchContainer;
