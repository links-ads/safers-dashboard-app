import React from 'react';

import PropTypes from 'prop-types';
import { Card } from 'reactstrap';

import BaseMap from 'components/BaseMap/BaseMap';

const MapSection = ({ iconLayer }) => {
  return (
    <Card className="map-card mb-0" style={{ height: 500 }}>
      <BaseMap
        layers={[iconLayer]}
        screenControlPosition="top-right"
        navControlPosition="bottom-right"
      />
    </Card>
  );
};

MapSection.propTypes = {
  iconLayer: PropTypes.any,
  getReportsByArea: PropTypes.func,
  handleViewStateChange: PropTypes.func,
  setNewWidth: PropTypes.func,
  setNewHeight: PropTypes.func,
};

export default MapSection;
