import React from 'react';
import { Card } from 'reactstrap';
import BaseMap from '../../../../../components/BaseMap/BaseMap';
import PropTypes from 'prop-types';

const MapSection = ({
  viewState,
  iconLayer
}) => {

  return (
    <Card className='map-card mb-0' style={{ height: 500 }}>
      <BaseMap
        layers={[iconLayer]}
        initialViewState={viewState}
        screenControlPosition='top-right'
        navControlPosition='bottom-right'
      />
    </Card>
  )
}

MapSection.propTypes = {
  viewState: PropTypes.any,
  iconLayer: PropTypes.any,
  getReportsByArea: PropTypes.func,
  handleViewStateChange: PropTypes.func,
  setNewWidth: PropTypes.func,
  setNewHeight: PropTypes.func
}

export default MapSection;
