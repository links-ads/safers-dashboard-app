import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux';
import { Row } from 'reactstrap';
import { getIconLayer } from '../../../helpers/mapHelper';
import { setEventFavoriteAlert } from '../../../store/events/action';
import { PAGE_SIZE } from '../../../store/events/types';
import Alert from './Alert';
import PaginationWrapper from '../../../components/Pagination';

const EventList = ({alertId, setAlertId, filteredAlerts, paginatedAlerts, currentPage, setHoverInfo, setIconLayer, setMidpoint, setPaginatedAlerts, setZoomLevel}) => {
  
  const dispatch = useDispatch();
  
  const setFavorite = (id) => {
    let selectedAlert = _.find(filteredAlerts, { id });
    selectedAlert.isFavorite = !selectedAlert.isFavorite;
    dispatch(setEventFavoriteAlert(id, selectedAlert.isFavorite));
    const to = PAGE_SIZE * currentPage;
    const from = to - PAGE_SIZE;
    setPaginatedAlerts(_.cloneDeep(filteredAlerts.slice(from, to)));

    // updatePage(currentPage);
  }
  const hideTooltip = (e) => {
    if (e && e.viewState) {
      setMidpoint([e.viewState.longitude, e.viewState.latitude]);
      setZoomLevel(e.viewState.zoom);
    }
    setHoverInfo({});
  };

  const setSelectedAlert = (id, isEdit) => {
    if (id) {
      if (id === alertId) {
        hideTooltip();
      }
      setAlertId(id);
      let alertsToEdit = _.cloneDeep(filteredAlerts);
      let selectedAlert = _.find(alertsToEdit, { id });
      selectedAlert.isSelected = true;
      setIconLayer(getIconLayer(alertsToEdit));
      setHoverInfo({ object: selectedAlert, coordinate: selectedAlert.geometry.coordinates, isEdit });
    } else {
      setAlertId(undefined);
      setIconLayer(getIconLayer(filteredAlerts));
    }
  }
  const setPageData = pageData => {
    setAlertId(undefined);
    setIconLayer(getIconLayer(filteredAlerts));
    hideTooltip();
    setPaginatedAlerts(pageData);
  };
  
  return(
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
  alertId: PropTypes.number,
  setAlertId: PropTypes.func,
  filteredAlerts: PropTypes.func,
  paginatedAlerts: PropTypes.array,
  setPaginatedAlerts: PropTypes.func,
  currentPage: PropTypes.number,
  setCurrentPage: PropTypes.func,
  setHoverInfo: PropTypes.func,
  setIconLayer: PropTypes.func,
  setMidpoint: PropTypes.array,
  setZoomLevel: PropTypes.func,
}

export default EventList;