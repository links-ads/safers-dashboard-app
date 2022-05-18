import _ from 'lodash';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Card } from 'reactstrap';
import BaseMap from '../../../components/BaseMap/BaseMap';
import { editEventAlertInfo, setEventFavoriteAlert, validateEventAlert } from '../../../store/events/action';
import { PAGE_SIZE } from '../../../store/events/types';
import SearchButton from './SearchButton';
import PropTypes from 'prop-types';
import ToolTip from './Tooltip';

// eslint-disable-next-line no-unused-vars
const MapSection = ({currentPage, setAlertId, viewState, setViewState, hoverInfo, setHoverInfo, filteredAlerts, iconLayer, setMidpoint, setZoomLevel, setPaginatedAlerts}) => {
  
  const dispatch = useDispatch();

  const hideTooltip = (e) => {
    if (e && e.viewState) {
      setMidpoint([e.viewState.longitude, e.viewState.latitude]);
      setZoomLevel(e.viewState.zoom);
    }
    setHoverInfo({});
  };

  const showTooltip = info => {
    if (info.picked && info.object) {
      setAlertId(info.object.id);
      setHoverInfo(info);
    } else {
      setHoverInfo({});
    }
  };

  const renderTooltip = (info) => {
    if(!info) return null
    const { object, coordinate, isEdit } = info;
    if (object) {
      return <ToolTip
        key={object.id}
        object={object}
        coordinate={coordinate}
        isEdit={isEdit}
        setFavorite={setFavorite}
        validateEvent={validateEvent}
        editInfo={editInfo}
      />
    }
    if (!object) {
      return null;
    }
  }
  const setFavorite = (id) => {
    let selectedAlert = _.find(filteredAlerts, { id });
    selectedAlert.isFavorite = !selectedAlert.isFavorite;
    dispatch(setEventFavoriteAlert(id, selectedAlert.isFavorite));
    const to = PAGE_SIZE * currentPage;
    const from = to - PAGE_SIZE;
    setPaginatedAlerts(_.cloneDeep(filteredAlerts.slice(from, to)));
  }

  const validateEvent = (id) => {
    let selectedAlert = _.find(filteredAlerts, { id });
    selectedAlert.status = 'VALIDATED';
    dispatch(validateEventAlert(id));
    const to = PAGE_SIZE * currentPage;
    const from = to - PAGE_SIZE;
    setPaginatedAlerts(_.cloneDeep(filteredAlerts.slice(from, to)));
  }

  const editInfo = (id, desc) => {
    let selectedAlert = _.find(filteredAlerts, { id });
    selectedAlert.description = desc;
    dispatch(editEventAlertInfo(id, desc));
    const to = PAGE_SIZE * currentPage;
    const from = to - PAGE_SIZE;
    setPaginatedAlerts(_.cloneDeep(filteredAlerts.slice(from, to)));
  }
  
  return (
    <Card className='map-card mb-0' style={{ height: 730 }}>
      <BaseMap
        layers={[iconLayer]}
        initialViewState={viewState}
        hoverInfo={hoverInfo} 
        renderTooltip={renderTooltip}
        onClick={showTooltip}
        onViewStateChange={hideTooltip}
        widgets={[SearchButton]}
        screenControlPosition='top-right'
        navControlPosition='bottom-right'
      />
    </Card>
  )
}

MapSection.propTypes = {
  viewState : PropTypes.any,
  setViewState: PropTypes.any,
  iconLayer: PropTypes.any,
  setAlertId: PropTypes.func,
  currentPage: PropTypes.number,
  hoverInfo: PropTypes.any,
  setHoverInfo: PropTypes.func,
  filteredAlerts: PropTypes.array,
  setMidpoint: PropTypes.func,
  setZoomLevel: PropTypes.func,
  setPaginatedAlerts: PropTypes.func
}

export default MapSection;