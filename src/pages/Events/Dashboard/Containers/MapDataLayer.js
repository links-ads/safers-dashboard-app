import React from 'react';
import { useSelector } from 'react-redux';
import { Button, ButtonGroup, Card, Row, Col } from 'reactstrap';

import BaseMap from '../../../../components/BaseMap/BaseMap';

const MapDataLayer = () => {
  const { polygonLayer, viewState } = useSelector(state => state.common);
  return (
    <Col md={12}>
      <Row>
        <Col md={5}>
          <ButtonGroup>
            <Button className='switch-data-layer-btn active'>
            Burned Area Delineation
            </Button>
          
            <Button className='switch-data-layer-btn'>
            Fire Propagation
            </Button>
          </ButtonGroup>
        </Col>
        
      </Row>
      <Row className="h-100 w-100 mx-auto mt-3">
        <Card className='map-card' style={{height : 400}}>
          <BaseMap layers={[polygonLayer]} initialViewState={viewState} />
        </Card>
      </Row>
    </Col>

  );
}

export default MapDataLayer;
