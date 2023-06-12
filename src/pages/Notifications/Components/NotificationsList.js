import React from 'react';

import _ from 'lodash';
import PropTypes from 'prop-types';
import Pagination from 'rc-pagination';
import { Row } from 'reactstrap';

import { PAGE_SIZE } from 'constants/common';

import NotificatonCard from './NotificationCard';

const NotificationsList = ({
  filteredNotifications,
  paginatedNotifications,
  setPaginatedNotifications,
  currentPage,
  setCurrentPage,
  setSelectedNotification,
  selectedNotification,
}) => {
  const updatePage = page => {
    setCurrentPage(page);
    const to = PAGE_SIZE * page;
    const from = to - PAGE_SIZE;
    setPaginatedNotifications(
      _.cloneDeep(filteredNotifications.slice(from, to)),
    );
  };

  return (
    <>
      <Row>
        {paginatedNotifications.map(notification => (
          <NotificatonCard
            key={notification.id}
            notification={notification}
            selectedNotification={selectedNotification}
            setSelectedNotification={setSelectedNotification}
          />
        ))}
      </Row>

      <Row className="text-center my-1">
        <Pagination
          pageSize={PAGE_SIZE}
          onChange={updatePage}
          current={currentPage}
          total={filteredNotifications.length}
        />
      </Row>
    </>
  );
};

NotificationsList.propTypes = {
  filteredNotifications: PropTypes.array,
  paginatedNotifications: PropTypes.array,
  setPaginatedNotifications: PropTypes.func,
  currentPage: PropTypes.number,
  setCurrentPage: PropTypes.func,
  setSelectedNotification: PropTypes.func,
  selectedNotification: PropTypes.object,
};

export default NotificationsList;
