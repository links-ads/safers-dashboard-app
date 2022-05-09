import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'reactstrap';
import _ from 'lodash';
import moment from 'moment';

import 'toastr/build/toastr.min.css'
import 'rc-pagination/assets/index.css';
import SortSection from './Components/SortSection';
import DateComponent from '../../components/DateRangePicker/DateRange';

import NotificationsList from './Components/NotificationsList';
import { NOTIFICATIONS_PAGE_SIZE } from '../../store/notifications/types';
import { getAllNotifications } from '../../store/notifications/action';

const Notifications = () => {
  const dispatch = useDispatch();

  const notifications = useSelector(state => state.notifications.allNotifications);
  const [ filteredNotifications, setFilterdNotifications] = useState([])
  const [ paginatedNotifications, setPaginatedNotifications] = useState([])
  const [ currentPage, setCurrentPage] = useState(1)
  const [notificationSource, setNotificationSource] = useState('Report')
  const [sortOrder, setSortOrder] = useState('-date')
  // eslint-disable-next-line no-unused-vars
  const [ dateRange, setDateRange] = useState([])
  
  useEffect(() => {
    setFilterdNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    let params = { default_bbox: false }
    params.default_date = false
    if(notificationSource && notificationSource != 'all'){
      params.source = notificationSource;
    }
    if(sortOrder){
      params.order = sortOrder;
    }
    if(dateRange.length === 2){
      params.default_date = false
      params.start_date = dateRange[0]
      params.end_date = dateRange[1]
    }
    dispatch(getAllNotifications(params));
  }, [notificationSource, dateRange, sortOrder]);

  useEffect(() => {
    setCurrentPage(1);
    setPaginatedNotifications(_.cloneDeep(filteredNotifications.slice(0, NOTIFICATIONS_PAGE_SIZE)))
  }, [filteredNotifications]);

  const handleDateRangePicker = (dates) => {
    let from = moment(dates[0]).format('YYYY-MM-DD');
    let to = moment(dates[1]).format('YYYY-MM-DD');
    setDateRange([from, to]);
  }

  return (
    <div className='page-content'>
      <div className='mx-2 sign-up-aoi-map-bg'>
        <Row>
          <Col xl={5} className='d-flex justify-content-between'>
            <p className='align-self-baseline alert-title'>Notification List</p>
          </Col>
          <Col xl={7} className='d-flex justify-content-end'>
            <DateComponent setDates={handleDateRangePicker} />
          </Col>
        </Row>
        <Row>
          <Col xl={12}>
            <SortSection 
              filteredNotifications={filteredNotifications} 
              setFilterdNotifications={setFilterdNotifications}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              notificationSource={notificationSource}
              setNotificationSource={setNotificationSource}
            />
            <Row>
              <Col xl={12} className='px-3'>
                <NotificationsList 
                  filteredNotifications={filteredNotifications} 
                  paginatedNotifications={paginatedNotifications} 
                  setPaginatedNotifications={setPaginatedNotifications}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              </Col>
            </Row>
          </Col>
        </Row>

      </div>
    </div >

  );
}

export default Notifications;
