import _ from 'lodash';
import Pagination from 'rc-pagination';
import React from 'react';
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux';
import { Row } from 'reactstrap';
import { getIconLayer } from '../../../helpers/mapHelper';
import { setEventFavoriteAlert } from '../../../store/events/action';
import { PAGE_SIZE } from '../../../store/events/types';
import Alert from './Alert';

const EventList = ({alertId, setAlertId, filteredAlerts, paginatedAlerts, currentPage, setCurrentPage, setHoverInfo, setIconLayer, setMidpoint, setPaginatedAlerts, setZoomLevel}) => {
  
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
      dispatch(setMidpoint([e.viewState.longitude, e.viewState.latitude]));
      dispatch(setZoomLevel(e.viewState.zoom));
    }
    dispatch(setHoverInfo({}));
  };

  const setSelectedAlert = (id, isEdit) => {
    if (id) {
      if (id === alertId) {
        hideTooltip();
      }
      dispatch(setAlertId(id));
      let alertsToEdit = _.cloneDeep(filteredAlerts);
      let selectedAlert = _.find(alertsToEdit, { id });
      selectedAlert.isSelected = true;
      dispatch(setIconLayer(getIconLayer(alertsToEdit)));
      dispatch(setHoverInfo({ object: selectedAlert, coordinate: selectedAlert.geometry.coordinates, isEdit }));
    } else {
      dispatch(setAlertId(undefined));
      dispatch(setIconLayer(getIconLayer(filteredAlerts)));
    }
  }
  const updatePage = page => {
    dispatch(setAlertId(undefined));
    dispatch(setIconLayer(getIconLayer(filteredAlerts)));
    dispatch(setCurrentPage(page));
    const to = PAGE_SIZE * page;
    const from = to - PAGE_SIZE;
    hideTooltip();
    dispatch(setPaginatedAlerts(_.cloneDeep(filteredAlerts.slice(from, to))));
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
        <Pagination
          pageSize={PAGE_SIZE}
          onChange={updatePage}
          current={currentPage}
          total={filteredAlerts.length}
        />
        
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