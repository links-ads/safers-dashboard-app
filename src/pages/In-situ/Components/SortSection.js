import React, { useEffect } from 'react';
import { Row, Col, Input, Label, FormGroup } from 'reactstrap';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { setAlertId, setAlertSource, setFilterdAlerts, setSortByDate } from '../../../store/insitu/action';
import _ from 'lodash';

//i18n
import { withTranslation } from 'react-i18next'

const SortSection = ({t, checkedStatus, setCheckedStatus}) => {
  const { sortByDate, alertSource, filteredAlerts, allAlerts:alerts, cameraList } = useSelector(state => state.inSituAlerts);
  const FILTER_IMAGE = 'IMAGE';
  const FILTER_VIDEO = 'VIDEO';

  const photo  = _.filter(alerts, ({ type }) => type == FILTER_IMAGE);
  const video  = _.filter(alerts, ({ type }) => type == FILTER_VIDEO);

  const dispatch = useDispatch();


  const filterByAlertSource = (alertSource) => {
    dispatch(setAlertId(undefined));
    dispatch(setAlertSource(alertSource));
    if (alertSource === '')
      dispatch(setFilterdAlerts(alerts));
    else
      dispatch(setFilterdAlerts(_.filter(alerts, (o) => o.source.includes(alertSource ))));
  }
  const filterByDate = (sortByDate) => {
    dispatch(setAlertId(undefined));
    dispatch(setSortByDate(sortByDate))
    dispatch(setFilterdAlerts(_.orderBy(filteredAlerts, ['timestamp'], [sortByDate])));
  };

  const handleChecked = (value) => {
    if(checkedStatus.includes(value)){
      setCheckedStatus(_.without(checkedStatus, value))
    }else{
      setCheckedStatus([...checkedStatus, value])
    }
  };

  useEffect(() => {
    dispatch(setAlertId(undefined));
    if(checkedStatus.length == 0){
      dispatch(setFilterdAlerts(alerts))
    }else{
      dispatch(setFilterdAlerts(_.filter(alerts, (o) => checkedStatus.includes(o.type))));
    }
  }, [checkedStatus]);

  return(
    <>
      <div>
        <FormGroup className="form-group d-inline-block" check>
          <Input
            id="photo"
            data-testid="photo"
            name="status"
            type="checkbox"
            value={FILTER_IMAGE}
            onChange={(e) => handleChecked(e.target.value)}     
          />
          <Label
            check
            for="photo"
          >
            {t('Photos', {ns: 'inSitu'})} ({photo.length})
          </Label>
        </FormGroup>
        <FormGroup className="form-group d-inline-block ms-4" check>
          <Input
            id="video"
            data-testid="video"
            name="status"
            type="checkbox"
            value={FILTER_VIDEO}
            onChange={(e) => handleChecked(e.target.value)}      
          />
          <Label
            check
            for="video"
          >
            {t('Videos', {ns: 'inSitu'})} ({video.length})
          </Label>
        </FormGroup>
      </div>
            
      <Row>
        <Col></Col>
        <Col xl={3} className="d-flex justify-content-end">
          <span className='my-auto alert-report-text'>{t('Results')} {filteredAlerts.length}</span>
        </Col>
      </Row>
      <hr />
      <Row className='my-2'>
        <Col className='mx-0 my-1'>
          <Input
            id="sortByDate"
            className="btn-sm sort-select-input"
            name="sortByDate"
            placeholder="Sort By : Date"
            type="select"
            onChange={(e) => filterByDate(e.target.value)}
            value={sortByDate}
          >
            <option value={'date'} >{t('Sort By')} : {t('Date')} desc</option>
            <option value={'-date'} >{t('Sort By')} : {t('Date')} asc</option>
          </Input>
        </Col>
        <Col xl={4} className='my-1'>
          <Input
            id="alertSource"
            className="btn-sm sort-select-input"
            name="alertSource"
            placeholder="Source"
            type="select"
            onChange={(e) =>filterByAlertSource(e.target.value)}
            value={alertSource}
          >
            <option value='' key={''}> ---------- {t('Source')} : {t('All')} -----------</option>
            {cameraList.features?.map((camObj, index) => <option key={index} value={camObj.properties.id}>
              {camObj.properties.id}
            </option>)}
          </Input>
        </Col>
        <Col xl={3}>
                
        </Col>
      </Row>
    </>
  )
}

SortSection.propTypes = {
  checkedStatus: PropTypes.any,
  setCheckedStatus: PropTypes.func,
  t: PropTypes.func,
}

export default withTranslation(['common'])(SortSection);
