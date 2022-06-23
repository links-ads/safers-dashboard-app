import _ from 'lodash';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Card } from 'reactstrap';
import BaseMap from '../../../components/BaseMap/BaseMap';
import { editEventAlertInfo, validateEventAlert } from '../../../store/events/action';
import { PAGE_SIZE } from '../../../store/events/types';
import SearchButton from './SearchButton';
import PropTypes from 'prop-types';
import ToolTip from './Tooltip';

const MapSection = ({
  currentPage,
  viewState,
  hoverInfo,
  iconLayer,
  isEdit,
  filteredAlerts,
  hideTooltip,
  showTooltip,
  setFavorite,
  setPaginatedAlerts,
  getAlertsByArea,
  setIsEdit
}) => {
  const dispatch = useDispatch();

  const renderTooltip = (info) => {
    const { object, coordinate } = info;
    if (object) {
      return <ToolTip
        key={object.id}
        object={object}
        coordinate={coordinate}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        setFavorite={setFavorite}
        validateEvent={validateEvent}
        editInfo={editInfo}
      />
    }
    if (!object) {
      return null;
    }
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

  const getSearchButton = (index) => {
    return (
      <SearchButton
        index={index}
        getAlertsByArea={getAlertsByArea}
      />
    )
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
        widgets={[getSearchButton]}
        screenControlPosition='top-right'
        navControlPosition='bottom-right'
      />
    </Card>
  )
}

MapSection.propTypes = {
  viewState: PropTypes.any,
  setViewState: PropTypes.any,
  iconLayer: PropTypes.any,
  setAlertId: PropTypes.func,
  currentPage: PropTypes.number,
  hoverInfo: PropTypes.any,
  isEdit: PropTypes.any,
  setFavorite: PropTypes.func,
  hideTooltip: PropTypes.func,
  showTooltip: PropTypes.func,
  filteredAlerts: PropTypes.array,
  setPaginatedAlerts: PropTypes.func,
  getAlertsByArea: PropTypes.func,
  setIsEdit: PropTypes.func
}

export default MapSection;