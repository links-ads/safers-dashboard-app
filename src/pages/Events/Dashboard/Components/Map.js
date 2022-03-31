import React from 'react';
import { useSelector } from 'react-redux';
import { Card, Row } from 'reactstrap';

import BaseMap from '../../../../components/BaseMap/BaseMap';
import MapCards from '../../../../components/BaseMap/MapCards';

const MapComponent = () => {
  const { polygonLayer, viewState } = useSelector(state => state.common);
  return (
    <Row className="h-100 ms-1">
      <Card className='map-card'>
        <BaseMap layers={[polygonLayer]} initialViewState={viewState} />
        <MapCards />
      </Card>
    </Row>

  );
}

export default MapComponent;
