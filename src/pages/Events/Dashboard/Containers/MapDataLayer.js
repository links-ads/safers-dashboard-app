import React, { useState } from 'react';
import { Button, ButtonGroup, Card, Row, Col } from 'reactstrap';
import classnames from 'classnames';

import BaseMap from '../../../../components/BaseMap/BaseMap';

const MapDataLayer = () => {
  // eslint-disable-next-line no-unused-vars
  const [viewState, setViewState] = useState(undefined);
  // eslint-disable-next-line no-unused-vars
  const [ polygonLayer, setPolygonLayer ] = useState(undefined);
  //to update when data layers ready
  const [ dataLayer, setDataLayer ] = useState(1);
  return (
    <Col md={12}>
      <Row>
        <Col md={5}>
          <ButtonGroup>
            <Button onClick={() => setDataLayer(1)}
              className={classnames({
                'active': dataLayer === 1,
              }, 'switch-data-layer-btn left')}
            >
            Burned Area Delineation
            </Button>
          
            <Button className={classnames({
              'active': dataLayer === 2,
            }, 'switch-data-layer-btn right')} onClick={() => setDataLayer(2)}>
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
