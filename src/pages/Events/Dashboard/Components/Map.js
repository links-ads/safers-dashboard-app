import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, Row } from 'reactstrap';

import BaseMap from '../../../../components/BaseMap/BaseMap';
import MapCards from '../../../../components/BaseMap/MapCards';
import { getPolygonLayer, getViewState } from '../../../../helpers/mapHelper';

const MapComponent = () => {
  const [viewState, setViewState] = useState(undefined);
  const [ polygonLayer, setPolygonLayer ] = useState(undefined);
  const defaultAoi = useSelector(state => state.user.defaultAoi);
  const allAoi = useSelector(state => state.common.aois);

  useEffect(() => {
    selectAoi(defaultAoi.features[0].properties.id)
  }, [allAoi])

  const selectAoi = (id) => {
    const objAoi = _.find(allAoi, { features: [{ properties: { id: parseInt(id) } }] })
    if(objAoi){
      setPolygonLayer(getPolygonLayer(objAoi));
      setViewState(getViewState(objAoi.features[0].properties.midPoint, objAoi.features[0].properties.zoomLevel))
    }
  }

  return (
    <Row className="h-100 w-100 mx-auto">
      <Card className='map-card'>
        <BaseMap layers={[polygonLayer]} initialViewState={viewState} />
        <MapCards />
      </Card>
    </Row>

  );
}

export default MapComponent;
