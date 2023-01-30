import React from 'react';

import PropTypes from 'prop-types';
import { Card } from 'reactstrap';

import BaseMap from '../../../../components/BaseMap/BaseMap';
import SearchButton from '../../../../components/SearchButton';

const MapSection = ({
  viewState,
  iconLayer,
  getPeopleByArea,
  setViewState,
  handleViewStateChange,
  setNewWidth,
  setNewHeight,
  onClick,
}) => {
  const getSearchButton = index => {
    return <SearchButton index={index} getInfoByArea={getPeopleByArea} />;
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
  iconLayer: PropTypes.any,
  setViewState: PropTypes.func,
  getPeopleByArea: PropTypes.func,
  handleViewStateChange: PropTypes.func,
  setNewWidth: PropTypes.func,
  setNewHeight: PropTypes.func,
  onClick: PropTypes.func,
};

export default MapSection;
