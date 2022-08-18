import React from 'react';
import PropTypes from 'prop-types'
import { Row } from 'reactstrap';
import { getIconLayer } from '../../../helpers/mapHelper';
import { PAGE_SIZE } from '../../../store/events/types';
import Alert from './Alert';
import PaginationWrapper from '../../../components/Pagination';

const EventList = ({
  alertId,
  setAlertId,
  filteredAlerts,
  paginatedAlerts,
  hideTooltip,
  setFavorite,
  setIconLayer,
  setPaginatedAlerts,
  setSelectedAlert
}) => {

  const setPageData = pageData => {
    setAlertId(undefined);
    setIconLayer(getIconLayer(filteredAlerts));
    hideTooltip();
    setPaginatedAlerts(pageData);
  };

  return (
    <>
      <Row data-testid='event-list'>
        {
          paginatedAlerts.map((alert, index) => <Alert
            key={index}
            card={alert}
            setSelectedAlert={setSelectedAlert}
            setFavorite={setFavorite}
            alertId={alertId}
          />)
        }
      </Row>

      <Row className='text-center my-1'>
        <PaginationWrapper pageSize={PAGE_SIZE} list={filteredAlerts} setPageData={setPageData} />
      </Row>
    </>)
}

EventList.propTypes = {
  alertId: PropTypes.string,
  setAlertId: PropTypes.func,
  filteredAlerts: PropTypes.array,
  paginatedAlerts: PropTypes.array,
  currentPage: PropTypes.number,
  hideTooltip: PropTypes.func, setPaginatedAlerts: PropTypes.func,
  setCurrentPage: PropTypes.func,
  setFavorite: PropTypes.func,
  setIconLayer: PropTypes.func,
  setSelectedAlert: PropTypes.func,
}

export default EventList;