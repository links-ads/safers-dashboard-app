import React from 'react';

import PropTypes from 'prop-types';
import { Card } from 'reactstrap';

import BaseMap from '../../../../components/BaseMap/BaseMap';
import PolygonMap from '../../../../components/BaseMap/PolygonMap';
import SearchButton from '../../../../components/SearchButton';

const MapSection = ({
  iconLayer,
  getReportsByArea,
  setNewWidth,
  setNewHeight,
  setCoordinates,
  coordinates,
  togglePolygonMap = false,
  onClick,
  clearMap,
}) => {
  const getSearchButton = index => {
    return <SearchButton index={index} getInfoByArea={getReportsByArea} />;
  };

  return (
    <Card className="map-card mb-0" style={{ height: 730 }}>
      {!togglePolygonMap && (
        <BaseMap
          layers={[iconLayer]}
          widgets={[getSearchButton]}
          setWidth={setNewWidth}
          setHeight={setNewHeight}
          screenControlPosition="top-right"
          navControlPosition="bottom-right"
          key="comm-base-map"
          onClick={onClick}
        />
      )}

      {togglePolygonMap && (
        <PolygonMap
          layers={[iconLayer]}
          widgets={[getSearchButton]}
          setWidth={setNewWidth}
          setHeight={setNewHeight}
          screenControlPosition="top-right"
          navControlPosition="bottom-right"
          setCoordinates={setCoordinates}
          coordinates={coordinates}
          key="comm-polygon-map"
          onClick={onClick}
          clearMap={clearMap}
        />
      )}
    </Card>
  );
};

MapSection.propTypes = {
  coordinates: PropTypes.any,
  iconLayer: PropTypes.any,
  getReportsByArea: PropTypes.func,
  setNewWidth: PropTypes.func,
  setNewHeight: PropTypes.func,
  setCoordinates: PropTypes.func,
  togglePolygonMap: PropTypes.any,
  onClick: PropTypes.func,
  clearMap: PropTypes.func,
};

export default MapSection;
