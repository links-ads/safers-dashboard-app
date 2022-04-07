import _ from 'lodash';
import Pagination from 'rc-pagination';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row } from 'reactstrap';
import { setCurrentNotificationPage, setPaginatedNotifications } from '../../../store/notifications/action';
import { NOTIFICATIONS_PAGE_SIZE } from '../../../store/notifications/types';
import NotificatonCard from './NotificationCard';


const NotificationsList = () => {
  const { paginatedNotifications, filteredNotifications } = useSelector(state => state.notifications);
  const currentPage = useSelector(state => state.notifications.currentPage);
  
  const dispatch = useDispatch();
  
  const updatePage = page => {
    dispatch(setCurrentNotificationPage(page));
    const to = NOTIFICATIONS_PAGE_SIZE * page;
    const from = to - NOTIFICATIONS_PAGE_SIZE;
    
    dispatch(setPaginatedNotifications(_.cloneDeep(filteredNotifications.slice(from, to))));
  };
  
  return(
    <>
      <Row>
        {
          paginatedNotifications.map((alert, index) => <NotificatonCard
            key={index}
            card={alert}
          />)
        }
      </Row>
      
      <Row className='text-center my-1'> 
        <Pagination
          pageSize={NOTIFICATIONS_PAGE_SIZE}
          onChange={updatePage}
          current={currentPage}
          total={filteredNotifications.length}
        />
      </Row>
    </>)
}

export default NotificationsList;