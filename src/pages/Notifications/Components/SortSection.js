import React, {  } from 'react';
import { Row, Col, Input} from 'reactstrap';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import _ from 'lodash';

const SortSection = ({ setFilterdNotifications, filteredNotifications, notificationSource, setNotificationSource, sortByDate, setSortByDate}) => {

  const notifications = useSelector(state => state.notifications.allNotifications);

  const filterBySource = (notificationSource) => {
    setNotificationSource(notificationSource);
    if (notificationSource === 'all')
      setFilterdNotifications(notifications);
    else
      setFilterdNotifications(_.filter(notifications, (o) => o.source.includes(notificationSource )));
  }
  
  const filterByDate = (sortByDate) => {
    setSortByDate(sortByDate)
    setFilterdNotifications(_.orderBy(filteredNotifications, ['timestamp'], [sortByDate]))
  };

  

  return(
    <>
      <hr />
      <Row className='my-2'>
        <Col md={4} className='mx-0 my-1 d-flex'>
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
       
          <Input
            id="alertSource"
            className="btn-sm sort-select-input ms-3"
            name="alertSource"
            placeholder="Source"
            type="select"
            onChange={(e) =>filterBySource(e.target.value)}
            value={notificationSource}
          >
            <option value={'all'} >Source : All</option>
            <option value={'Report'} >Source : Reports</option>
          </Input>
        </Col>
        <Col>
        </Col>
        <Col xl={3} className="d-flex justify-content-end">
          <span className='my-auto alert-report-text'>Results {filteredNotifications.length}</span>
        </Col>
      </Row>
      
    </>
  )
}

SortSection.propTypes = {
  alertSource: PropTypes.string,
  setAlertSource: PropTypes.func,
  filteredNotifications: PropTypes.array,
  setFilterdNotifications: PropTypes.func,
  notificationSource: PropTypes.string,
  setNotificationSource: PropTypes.func,
  sortByDate: PropTypes.string,
  setSortByDate: PropTypes.func,
}

export default SortSection;