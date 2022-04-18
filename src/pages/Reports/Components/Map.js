import React from 'react';
import { Card } from 'reactstrap';
import BaseMap from '../../../components/BaseMap/BaseMap';
import SearchButton from './SearchButton';
import PropTypes from 'prop-types';

const MapSection = ({viewState, iconLayer}) => {

  return (
    <Card className='map-card mb-0' style={{ height: 730 }}>
      <BaseMap
        layers={[iconLayer]}
        initialViewState={viewState}
        widgets={[SearchButton]}
        screenControlPosition='top-right'
        navControlPosition='bottom-right'
      />
    </Card>
  )
}

MapSection.propTypes = {
  viewState : PropTypes.any,
  iconLayer: PropTypes.any,
}

export default MapSection;
