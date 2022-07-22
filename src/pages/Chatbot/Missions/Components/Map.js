import React from 'react';
import { Card } from 'reactstrap';
import PolygonMap from '../../../../components/BaseMap/PolygonMap';
import BaseMap from '../../../../components/BaseMap/BaseMap';
import PropTypes from 'prop-types';
import SearchButton from '../../../../components/SearchButton';

const MapSection = ({
  viewState,
  iconLayer,
  getReportsByArea,
  handleViewStateChange,
  setNewWidth,
  setNewHeight,
  setCoordinates,
  togglePolygonMap = false,
}) => {

  const getSearchButton = (index) => {
    return (
      <SearchButton
        index={index}
        getInfoByArea={getReportsByArea}
      />
    )
  }

  return (
    <Card className='map-card mb-0' style={{ height: 730 }}>
      {!togglePolygonMap && <BaseMap
        layers={[iconLayer]}
        initialViewState={viewState}
        widgets={[getSearchButton]}
        onViewStateChange={handleViewStateChange}
        setWidth={setNewWidth}
        setHeight={setNewHeight}
        screenControlPosition='top-right'
        navControlPosition='bottom-right'
        key='comm-base-map'
      />}

      {togglePolygonMap && <PolygonMap
        layers={[iconLayer]}
        initialViewState={viewState}
        widgets={[getSearchButton]}
        onViewStateChange={handleViewStateChange}
        setWidth={setNewWidth}
        setHeight={setNewHeight}
        screenControlPosition='top-right'
        navControlPosition='bottom-right'
        setCoordinates={setCoordinates}
        key='comm-polygon-map'
      />}
    </Card>
  )
}

MapSection.propTypes = {
  viewState: PropTypes.any,
  iconLayer: PropTypes.any,
  getReportsByArea: PropTypes.func,
  handleViewStateChange: PropTypes.func,
  setNewWidth: PropTypes.func,
  setNewHeight: PropTypes.func,
  setCoordinates: PropTypes.func,
  togglePolygonMap: PropTypes.any,
}

export default MapSection;