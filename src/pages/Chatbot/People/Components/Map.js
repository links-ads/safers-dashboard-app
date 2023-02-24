import React from 'react';

import PropTypes from 'prop-types';
import { Card } from 'reactstrap';

import BaseMap from 'components/BaseMap/BaseMap';
import SearchButton from 'components/SearchButton';

const MapSection = ({
  iconLayer,
  getPeopleByArea,
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
        widgets={[getSearchButton]}
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
  iconLayer: PropTypes.any,
  getPeopleByArea: PropTypes.func,
  setNewWidth: PropTypes.func,
  setNewHeight: PropTypes.func,
  onClick: PropTypes.func,
};

export default MapSection;
