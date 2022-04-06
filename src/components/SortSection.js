import React, { useEffect, useState } from 'react';
import { Row, Col, Input, Label, FormGroup } from 'reactstrap';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { setAlertId, setAlertSource, setFilterdAlerts, setSortByDate } from '../store/events/action';
import _ from 'lodash';

const SortSection = () => {
  const { sortByDate, alertSource, filteredAlerts } = useSelector(state => state.eventAlerts);

  const alerts = useSelector(state => state.eventAlerts.allAlerts);
  const ongoing  = _.sumBy(alerts, ({ status }) => status == 'ONGOING');
  const closed  = _.sumBy(alerts, ({ status }) => status == 'CLOSED');
  const [checkedStatus, setCheckedStatus] = useState([])

  const dispatch = useDispatch();

  const filterByAlertSource = (alertSource) => {
    dispatch(setAlertId(null));
    dispatch(setAlertSource(alertSource));
    if (alertSource === 'all')
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
      setCheckedStatus(_.remove(checkedStatus, (status) => status==value))
    }else{
      setCheckedStatus([...checkedStatus, value])
    }
  };

  useEffect(() => {
    dispatch(setAlertId(undefined));
    if(checkedStatus.length == 0){
      dispatch(setFilterdAlerts(alerts))
    }else{
      dispatch(setFilterdAlerts(_.filter(alerts, (o) => checkedStatus.includes(o.status))));
    }
  }, [checkedStatus]);

  return(
    <>
      <div>
        <FormGroup className="form-group d-inline-block" check>
          <Input
            id="onGoing"
            data-testid="onGoing"
            name="status"
            type="checkbox"
            value="ONGOING"
            onChange={(e) => handleChecked(e.target.value)}     
          />
          <Label
            check
            for="onGoing"
          >
                  Photos ({ongoing})
          </Label>
        </FormGroup>
        <FormGroup className="form-group d-inline-block ms-4" check>
          <Input
            id="closedEvents"
            data-testid="closedEvents"
            name="status"
            type="checkbox"
            value="CLOSED"
            onChange={(e) => handleChecked(e.target.value)}      
          />
          <Label
            check
            for="closedEvents"
          >
                  Videos ({closed})
          </Label>
        </FormGroup>
      </div>
            
      <Row>
        <Col></Col>
        <Col xl={3} className="d-flex justify-content-end">
          <span className='my-auto alert-report-text'>Results {filteredAlerts.length}</span>
        </Col>
      </Row>
      <hr />
      <Row className='my-2'>
        <Col className='mx-0'>
          <Input
            id="sortByDate"
            className="btn-sm sort-select-input"
            name="sortByDate"
            placeholder="Sort By : Date"
            type="select"
            onChange={(e) => filterByDate(e.target.value)}
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
            onChange={(e) =>filterByAlertSource(e.target.value)}
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
