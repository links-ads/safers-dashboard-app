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
import { getAllNotifications, setNewNotificationState, setNotificationParams } from '../../store/notifications/action';

import { useTranslation } from 'react-i18next';

const Notifications = () => {
  const dispatch = useDispatch();

  
  const { allNotifications : notifications, params:notificationParams } = useSelector(state => state.notifications);

  const [ filteredNotifications, setFilterdNotifications] = useState([])
  const [ paginatedNotifications, setPaginatedNotifications] = useState([])
  const [ currentPage, setCurrentPage] = useState(1)
  const [ notificationSource, setNotificationSource] = useState('Report')
  const [ sortOrder, setSortOrder] = useState('-date')
  const [ dateRange, setDateRange] = useState([])

  const { t } = useTranslation();
  
  useEffect(() => {
    setFilterdNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    if(notificationSource){
      notificationParams.source = notificationSource;
    }
    if(notificationSource == 'all'){
      delete notificationParams.source
    }
    if(dateRange.length === 2){
      notificationParams.default_date = false
      notificationParams.start_date = dateRange[0]
      notificationParams.end_date = dateRange[1]
    }else if(dateRange.length === 0){
      delete notificationParams.start_date
      delete notificationParams.end_date
      notificationParams.default_date = true
    }
    if(sortOrder){
      notificationParams.order = sortOrder
    }
    
    dispatch(setNotificationParams(notificationParams))
  }, [dateRange, notificationSource, sortOrder])

  useEffect(() => {
    dispatch(getAllNotifications(notificationParams));
    dispatch(setNewNotificationState(false, true));
    return () => {
      dispatch(setNewNotificationState(false, false));
    }
  }, [notificationParams]);

  useEffect(() => {
    setCurrentPage(1);
    setPaginatedNotifications(_.cloneDeep(filteredNotifications.slice(0, NOTIFICATIONS_PAGE_SIZE)))
  }, [filteredNotifications]);

  const handleDateRangePicker = (dates) => {
    let from = moment(dates[0]).format('YYYY-MM-DD');
    let to = moment(dates[1]).format('YYYY-MM-DD');
    setDateRange([from, to]);
  }
  const clearDates = () => {
    setDateRange([]);
  }

  return (
    <div className='page-content'>
      <div className='mx-2 sign-up-aoi-map-bg'>
        <Row>
          <Col xl={5} className='d-flex justify-content-between'>
            <p className='align-self-baseline alert-title'>{t('Notification List', {ns: 'common'})}</p>
          </Col>
          <Col xl={7} className='d-flex justify-content-end'>
            <DateComponent setDates={() => handleDateRangePicker} clearDates={() => clearDates()}/>
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
