import React, { useState } from 'react';
import { Card, Row } from 'reactstrap';

import BaseMap from '../../../layout/BaseMap/BaseMap';
import MapCards from '../Components/MapCards';


const MapComponent = () => {
  // eslint-disable-next-line no-unused-vars
  const [polygonLayer, setPolygonLayer] = useState(undefined);
  // eslint-disable-next-line no-unused-vars
  const [viewState, setViewState] = useState(undefined);
  return (
    <Card className='map-card'>
      <Row style={{ height: 350 }} className="mb-5">
        <BaseMap layers={[polygonLayer]} initialViewState={viewState} />
        <MapCards/>
      </Row>
    </Card>
         
  );
}

export default MapComponent;
