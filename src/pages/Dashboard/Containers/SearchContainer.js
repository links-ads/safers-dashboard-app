import React, { useEffect } from 'react';
import { Row, Col, Label, Input, FormGroup,  } from 'reactstrap';
import PropTypes from 'prop-types';

import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import { getAllAreas } from '../../../store/appAction';
import { setPolygonLayer, setSelectedAoi, setViewState } from '../../../store/common/action';
import { getInSituMedia, getStats, getTweets, getWeatherStats, getWeatherVariables } from '../../../store/dashboard/action';

import { getPolygonLayer, getViewState } from '../../../helpers/mapHelper';

//i18n
import { withTranslation } from 'react-i18next'

const SearchContainer = (props) => {
  const dispatch = useDispatch()
  const defaultAoi = useSelector(state => state.user.defaultAoi);

  const {aois: allAoi, selectedAoi, dateRange} = useSelector(
    state => state.common
  )

  useEffect(() => {
    if(!allAoi.length){
      dispatch(getAllAreas());
    }
  }, []);
  
  useEffect(() => {
    selectAoi(defaultAoi.features[0].properties.id)
  }, [allAoi])

  const getSearchData = () => {
    const searchAoi = selectedAoi ? selectedAoi : defaultAoi.features[0].properties.id
    const params = {};
    if(dateRange){
      params.startDate = dateRange[0]
      params.endDate = dateRange[1]
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

  const selectAoi = (id) => {
    const objAoi = _.find(allAoi, { features: [{ properties: { id: parseInt(id) } }] })
    dispatch(setSelectedAoi(parseInt(id)));
    setMapLayers(objAoi)
    getSearchData()
  }

  const setMapLayers = (objAoi) => {
    if(objAoi){
      dispatch(setPolygonLayer(getPolygonLayer(objAoi)));
      dispatch(setViewState(getViewState(objAoi.features[0].properties.midPoint, objAoi.features[0].properties.zoomLevel)))
    }
  }

  return(
    <Row className='g-0'>
      <Col >
        <Row>
          <Col md={6} xs={12}>
            <FormGroup className="form-group">
              <Label
                for="exampleEmail"
              >
                {props.t('Area of interest')}:
              </Label>
              <Input
                id="selectAoiDashboard"
                className='w-50'
                name="select"
                type="select"
                onChange={(e) => selectAoi(e.target.value)}
                value={selectedAoi ? selectedAoi : 
                  defaultAoi ? defaultAoi.features[0].properties.id : ''}
              >
                <option value='' key={''}> ---------- {props.t('Select Area')} -----------</option>
                {allAoi.map((aoi, index) => <option key={index} value={aoi.features[0].properties.id}>
                  {aoi.features[0].properties.country === aoi.features[0].properties.name ? aoi.features[0].properties.country : `${aoi.features[0].properties.country} - ${aoi.features[0].properties.name}`}
                </option>)}
              </Input>
            </FormGroup>
          </Col>
        </Row>
      </Col>
    </Row>
  )}

SearchContainer.propTypes = {
  t: PropTypes.any,
}

export default withTranslation(['common'])(SearchContainer);
