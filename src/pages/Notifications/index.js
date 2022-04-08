import React, { useEffect } from 'react';
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
import { getAllNotifications, setCurrentNotificationPage, setFilterdNotifications, setNotificationDateRange, setPaginatedNotifications } from '../../store/notifications/action';

const Notifications = () => {
  const notifications = useSelector(state => state.notifications.allNotifications);
  const { filteredNotifications, sortByDate, notificationSource, dateRange } = useSelector(state => state.notifications);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllNotifications(
      {
        sortOrder: sortByDate,
        source: notificationSource,
        from: dateRange[0],
        to: dateRange[1]
      }
    ));
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      dispatch(setFilterdNotifications(notifications));
    }
  }, [notifications]);

  useEffect(() => {
    dispatch(setCurrentNotificationPage(1));
    dispatch(setPaginatedNotifications(_.cloneDeep(filteredNotifications.slice(0, NOTIFICATIONS_PAGE_SIZE))))
  }, [filteredNotifications]);

  const handleDateRangePicker = (dates) => {
    let from = moment(dates[0]).format('DD-MM-YYYY');
    let to = moment(dates[1]).format('DD-MM-YYYY');
    dispatch(setNotificationDateRange([from, to]));
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
            <SortSection />
            <Row>
              <Col xl={12} className='px-3'>
                <NotificationsList/>
              </Col>
            </Row>
          </Col>
        </Row>

      </div>
    </div >

  );
}

export default Notifications;
