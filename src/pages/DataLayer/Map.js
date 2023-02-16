import React from 'react';

import PropTypes from 'prop-types';
import { Card } from 'reactstrap';

import BaseMap from '../../components/BaseMap/BaseMap';
import PolygonMap from '../../components/BaseMap/PolygonMap';
import SearchButton from '../../components/SearchButton';

const MapSection = ({
  iconLayer,
  getReportsByArea,
  setNewWidth,
  setNewHeight,
  setCoordinates,
  coordinates,
  togglePolygonMap = false,
  handleAreaValidation,
}) => {
  const getSearchButton = index => (
    <SearchButton index={index} getInfoByArea={getReportsByArea} />
  );

  return (
    <Card className="map-card mb-0" style={{ height: 730 }}>
      {!togglePolygonMap ? (
        <BaseMap
          layers={[iconLayer]}
          widgets={[getSearchButton]}
          setWidth={setNewWidth}
          setHeight={setNewHeight}
          screenControlPosition="top-right"
          navControlPosition="bottom-right"
          key="comm-base-map"
        />
      ) : null}

      {togglePolygonMap ? (
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
          handleAreaValidation={handleAreaValidation}
          singlePolygonOnly={true}
        />
      ) : null}
    </Card>
  );
};

MapSection.propTypes = {
  iconLayer: PropTypes.any,
  getReportsByArea: PropTypes.func,
  setNewWidth: PropTypes.func,
  setNewHeight: PropTypes.func,
  setCoordinates: PropTypes.func,
  togglePolygonMap: PropTypes.any,
  coordinates: PropTypes.string,
  handleAreaValidation: PropTypes.func,
};

export default MapSection;
