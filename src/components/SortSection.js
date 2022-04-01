import React from 'react';
import { Row, Col, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { setAlertSource, setSortByDate } from '../store/events/action';

const SortSection = () => {
  const { sortByDate, alertSource } = useSelector(state => state.eventAlerts);
  const dispatch = useDispatch();
  return(
    <Row className='my-2'>
      <Col className='mx-0'>
        <Input
          id="sortByDate"
          className="btn-sm sort-select-input"
          name="sortByDate"
          placeholder="Sort By : Date"
          type="select"
          onChange={(e) => dispatch(setSortByDate(e.target.value))}
          value={sortByDate}
        >
          <option value={'desc'} >Sort By : Date desc</option>
          <option value={'asc'} >Sort By : Date asc</option>
        </Input>
      </Col>
      <Col xl={4}>
        <Input
          id="alertSource"
          className="btn-sm sort-select-input"
          name="alertSource"
          placeholder="Source"
          type="select"
          onChange={(e) => dispatch(setAlertSource(e.target.value))}
          value={alertSource}
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
  )
}

SortSection.propTypes = {
  sortByDate: PropTypes.any,
  setSortByDate: PropTypes.string,
  alertSource: PropTypes.func,
  setAlertSource: PropTypes.func,
}

export default SortSection;