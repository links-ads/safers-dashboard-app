import React from 'react';

import _ from 'lodash';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Card } from 'reactstrap';

import BaseMap from 'components/BaseMap/BaseMap';
import SearchButton from 'components/SearchButton';
import { PAGE_SIZE } from 'constants/common';
import { editEventInfo, validateEvent } from 'store/events.slice';

import ToolTip from './Tooltip';

const MapSection = ({
  currentPage,
  hoverInfo,
  iconLayer,
  isEdit,
  filteredAlerts,
  hideTooltip,
  showTooltip,
  setFavorite,
  setPaginatedAlerts,
  getAlertsByArea,
  setIsEdit,
  setNewWidth,
  setNewHeight,
}) => {
  const dispatch = useDispatch();

  const renderTooltip = info => {
    const { object } = info;
    const coordinate = object?.geometry.coordinates;

    if (object) {
      return (
        <ToolTip
          key={object.properties.id}
          object={object.properties}
          coordinate={coordinate}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          setFavorite={setFavorite}
          validateEvent={validate}
          editInfo={editInfo}
        />
      );
    }
  };

  const validate = id => {
    let selectedAlert = _.find(filteredAlerts, { id });
    selectedAlert.status = 'VALIDATED';
    dispatch(validateEvent(id));
    const to = PAGE_SIZE * currentPage;
    const from = to - PAGE_SIZE;
    setPaginatedAlerts(_.cloneDeep(filteredAlerts.slice(from, to)));
  };

  const editInfo = (id, desc) => {
    let selectedAlert = _.find(filteredAlerts, { id });
    selectedAlert.description = desc;
    dispatch(editEventInfo({ eventId: id, editInfo: desc }));
    const to = PAGE_SIZE * currentPage;
    const from = to - PAGE_SIZE;
    setPaginatedAlerts(_.cloneDeep(filteredAlerts.slice(from, to)));
  };

  const getSearchButton = index => {
    return <SearchButton index={index} getInfoByArea={getAlertsByArea} />;
  };
  return (
    <Card className="map-card mb-0" style={{ height: 730 }}>
      <BaseMap
        layers={[iconLayer]}
        hoverInfo={hoverInfo}
        renderTooltip={renderTooltip}
        onClick={showTooltip}
        onViewStateChange={hideTooltip}
        widgets={[getSearchButton]}
        setWidth={setNewWidth}
        setHeight={setNewHeight}
        screenControlPosition="top-right"
        navControlPosition="bottom-right"
      />
    </Card>
  );
};

MapSection.propTypes = {
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
  setIsEdit: PropTypes.func,
  setNewWidth: PropTypes.func,
  setNewHeight: PropTypes.func,
};

export default MapSection;
