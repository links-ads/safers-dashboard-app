import React, {  } from 'react';
import { Row, Col, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { setFilterdReports } from '../../../store/reports/action';
import _ from 'lodash';

const SortSection = () => {
  const { allReports } = useSelector(state => state.reports);

  const dispatch = useDispatch();

  const filterByAlertSource = (alertSource) => {
    if (alertSource === 'all')
      dispatch(setFilterdReports(allReports));
    else
      dispatch(setFilterdReports(_.filter(allReports, (o) => o.source.includes(alertSource ))));
  }
  
  const filterByDate = (sortByDate) => {
    dispatch(setFilterdReports(_.orderBy(allReports, ['timestamp'], [sortByDate])));
  };

  return(
    <>
            
      <Row className='mt-5'>
        <Col></Col>
        <Col xl={3} className="d-flex justify-content-end">
          <span className='my-auto alert-report-text'>Results {allReports.length}</span>
        </Col>
      </Row>
      <hr/>
      <Row className='my-2'>
        <Col className='mx-0 my-1'>
          <Input
            id="sortByDate"
            className="btn-sm sort-select-input"
            name="sortByDate"
            placeholder="Sort By : Date"
            type="select"
            onChange={(e) => filterByDate(e.target.value)}
          >
            <option value={'desc'} >Sort By : Date desc</option>
            <option value={'asc'} >Sort By : Date asc</option>
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
          >
            <option value={'all'} >Source : All</option>
            <option value={'web'} >Source : Web</option>
            <option value={'camera'} >Source : Camera</option>
            <option value={'satellite'} >Source : Satellite</option>
          </Input>
        </Col>
        <Col xl={3}>
                
        </Col>
      </Row>
    </>
  )
}

SortSection.propTypes = {
  sortByDate: PropTypes.any,
  setSortByDate: PropTypes.string,
  alertSource: PropTypes.func,
  setAlertSource: PropTypes.func,
}

export default SortSection;
