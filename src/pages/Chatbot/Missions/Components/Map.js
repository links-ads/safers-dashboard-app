import React from 'react';

import PropTypes from 'prop-types';
import { Card } from 'reactstrap';

import BaseMap from 'components/BaseMap/BaseMap';
import PolygonMap from 'components/BaseMap/PolygonMap';
import SearchButton from 'components/SearchButton';

const MapSection = ({
  iconLayer,
  getMissionsByArea,
  setCoordinates,
  coordinates,
  togglePolygonMap = false,
  onClick,
  clearMap,
}) => {
  const getSearchButton = index => {
    return <SearchButton index={index} getInfoByArea={getMissionsByArea} />;
  };

  return (
    <Card className="map-card mb-0" style={{ height: 730 }}>
      {!togglePolygonMap && (
        <BaseMap
          layers={[iconLayer]}
          widgets={[getSearchButton]}
          screenControlPosition="top-right"
          navControlPosition="bottom-right"
          onClick={onClick}
        />
      )}

      {togglePolygonMap && (
        <PolygonMap
          layers={[iconLayer]}
          widgets={[getSearchButton]}
          screenControlPosition="top-right"
          navControlPosition="bottom-right"
          setCoordinates={setCoordinates}
          coordinates={coordinates}
          onClick={onClick}
          clearMap={clearMap}
        />
      )}
    </Card>
  );
};

MapSection.propTypes = {
  iconLayer: PropTypes.any,
  getMissionsByArea: PropTypes.func,
  setCoordinates: PropTypes.func,
  coordinates: PropTypes.any,
  togglePolygonMap: PropTypes.any,
  onClick: PropTypes.func,
  clearMap: PropTypes.func,
};

export default MapSection;
