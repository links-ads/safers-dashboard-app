import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'reactstrap';
import _ from 'lodash';

import 'toastr/build/toastr.min.css'
import 'rc-pagination/assets/index.css';
import SortSection from './Components/SortSection';

import NotificationsList from './Components/NotificationsList';
import { NOTIFICATIONS_PAGE_SIZE } from '../../store/notifications/types';
import { getAllNotifications, getAllNotificationSources, getAllNotificationScopesRestrictions, setNewNotificationState, setNotificationParams } from '../../store/appAction';

import { useTranslation } from 'react-i18next';

const Notifications = () => {
  const dispatch = useDispatch();


  const { allNotifications: notifications, params: notificationParams } = useSelector(state => state.notifications);
  const dateRange = useSelector(state => state.common.dateRange)

  const [filteredNotifications, setFilterdNotifications] = useState([])
  const [paginatedNotifications, setPaginatedNotifications] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [notificationSource, setNotificationSource] = useState('all')
  const [notificationScopeRestriction, setNotificationScopeRestriction] = useState('all')
  const [sortOrder, setSortOrder] = useState('-date')

  const { t } = useTranslation();

  useEffect(() => {
    dispatch(getAllNotificationSources())
    dispatch(getAllNotificationScopesRestrictions())

  }, [])

  useEffect(() => {
    setFilterdNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    if (notificationSource) {
      notificationParams.source = notificationSource;
    }
    if (notificationSource == 'all') {
      delete notificationParams.source
    }
    if (notificationScopeRestriction) {
      notificationParams.scopeRestriction = notificationScopeRestriction;
    }
    if (notificationScopeRestriction == 'all') {
      delete notificationParams.scopeRestriction
    }

    if (dateRange) {
      notificationParams.start_date = dateRange[0]
      notificationParams.end_date = dateRange[1]
    } else if (!dateRange) {
      delete notificationParams.start_date
      delete notificationParams.end_date
    }
    if (sortOrder) {
      notificationParams.order = sortOrder
    }

    dispatch(setNotificationParams(notificationParams))
    dispatch(getAllNotifications(notificationParams));
    dispatch(setNewNotificationState(false, true));
    return () => {
      dispatch(setNotificationParams(undefined))
      dispatch(setNewNotificationState(false, false));
    }
  }, [dateRange, notificationSource, notificationScopeRestriction, sortOrder])


  useEffect(() => {
    setCurrentPage(1);
    setPaginatedNotifications(_.cloneDeep(filteredNotifications.slice(0, NOTIFICATIONS_PAGE_SIZE)))
  }, [filteredNotifications]);

  return (
    <div className='page-content'>
      <div className='mx-2 sign-up-aoi-map-bg'>
        <Row>
          <Col xl={12} className='d-flex justify-content-between'>
            <p className='align-self-baseline alert-title'>{t('Notification List', { ns: 'common' })}</p>
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
              notificationScopeRestriction={notificationScopeRestriction}
              setNotificationScopeRestriction={setNotificationScopeRestriction}
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
