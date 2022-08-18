import _ from 'lodash';
import Pagination from 'rc-pagination';
import React from 'react';
import { Row } from 'reactstrap';
import { NOTIFICATIONS_PAGE_SIZE } from '../../../store/notifications/types';
import NotificatonCard from './NotificationCard';
import PropTypes from 'prop-types';

const NotificationsList = ({filteredNotifications, paginatedNotifications, setPaginatedNotifications, currentPage, setCurrentPage}) => {
  
  const updatePage = page => {
    setCurrentPage(page);
    const to = NOTIFICATIONS_PAGE_SIZE * page;
    const from = to - NOTIFICATIONS_PAGE_SIZE;
    setPaginatedNotifications(_.cloneDeep(filteredNotifications.slice(from, to)));
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

NotificationsList.propTypes = {
  filteredNotifications: PropTypes.array,
  paginatedNotifications: PropTypes.array,
  setPaginatedNotifications: PropTypes.func,
  currentPage: PropTypes.number,
  setCurrentPage: PropTypes.func
}

export default NotificationsList;