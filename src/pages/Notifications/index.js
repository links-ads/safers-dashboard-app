import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Row, Col } from 'reactstrap';
import _ from 'lodash';
import moment from 'moment';

import 'toastr/build/toastr.min.css'
import 'rc-pagination/assets/index.css';
import SortSection from './Components/SortSection';
import DateComponent from '../../components/DateRangePicker/DateRange';

import NotificationsList from './Components/NotificationsList';
import { NOTIFICATIONS_PAGE_SIZE } from '../../store/notifications/types';

import { useTranslation } from 'react-i18next';

const Notifications = () => {
  const notifications = useSelector(state => state.notifications.allNotifications);
  const [ filteredNotifications, setFilterdNotifications] = useState([])
  const [ paginatedNotifications, setPaginatedNotifications] = useState([])
  const [ currentPage, setCurrentPage] = useState(1)
  // eslint-disable-next-line no-unused-vars
  const [ dateRange, setNotificationDateRange] = useState([])

  const { t } = useTranslation();
  
  useEffect(() => {
    setFilterdNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    setCurrentPage(1);
    setPaginatedNotifications(_.cloneDeep(filteredNotifications.slice(0, NOTIFICATIONS_PAGE_SIZE)))
  }, [filteredNotifications]);

  const handleDateRangePicker = (dates) => {
    let from = moment(dates[0]).format('DD-MM-YYYY');
    let to = moment(dates[1]).format('DD-MM-YYYY');
    setNotificationDateRange([from, to]);
  }

  return (
    <div className='page-content'>
      <div className='mx-2 sign-up-aoi-map-bg'>
        <Row>
          <Col xl={5} className='d-flex justify-content-between'>
            <p className='align-self-baseline alert-title'>{t('Notification List', {ns: 'common'})}</p>
          </Col>
          <Col xl={7} className='d-flex justify-content-end'>
            <DateComponent setDates={handleDateRangePicker} />
          </Col>
        </Row>
        <Row>
          <Col xl={12}>
            <SortSection filteredNotifications={filteredNotifications} setFilterdNotifications={setFilterdNotifications}/>
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
