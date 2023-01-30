import React from 'react';

import PropTypes from 'prop-types';
import { Card } from 'reactstrap';

import BaseMap from '../../../../components/BaseMap/BaseMap';
import SearchButton from '../../../../components/SearchButton';

const MapSection = ({
  viewState,
  setViewState,
  iconLayer,
  getReportsByArea,
  handleViewStateChange,
  setNewWidth,
  setNewHeight,
  onClick,
}) => {
  const getSearchButton = index => {
    return <SearchButton index={index} getInfoByArea={getReportsByArea} />;
  };

  return (
    <Card className="map-card mb-0" style={{ height: 730 }}>
      <BaseMap
        layers={[iconLayer]}
        initialViewState={viewState}
        widgets={[getSearchButton]}
        setViewState={setViewState}
        onViewStateChange={handleViewStateChange}
        setWidth={setNewWidth}
        setHeight={setNewHeight}
        screenControlPosition="top-right"
        navControlPosition="bottom-right"
        onClick={onClick}
      />
    </Card>
  );
};

MapSection.propTypes = {
  viewState: PropTypes.any,
  setViewState: PropTypes.func,
  iconLayer: PropTypes.any,
  getReportsByArea: PropTypes.func,
  handleViewStateChange: PropTypes.func,
  setNewWidth: PropTypes.func,
  setNewHeight: PropTypes.func,
  onClick: PropTypes.func,
};

export default MapSection;
