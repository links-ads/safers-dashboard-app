import React, { useEffect, useState } from 'react';

import _ from 'lodash';
import { useSelector } from 'react-redux';
import { Card, Row } from 'reactstrap';

import BaseMap from 'components/BaseMap/BaseMap';
import MapCards from 'components/BaseMap/MapCards';
import { getPolygonLayer } from 'helpers/mapHelper';
import { aoisSelector } from 'store/common.slice';
import { defaultAoiSelector } from 'store/user.slice';

const MapComponent = () => {
  const [polygonLayer, setPolygonLayer] = useState(undefined);
  const defaultAoi = useSelector(defaultAoiSelector);
  const allAoi = useSelector(aoisSelector);

  useEffect(() => {
    selectAoi(defaultAoi.features[0].properties.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allAoi]);

  const selectAoi = id => {
    const objAoi = _.find(allAoi, {
      features: [{ properties: { id: parseInt(id) } }],
    });
    if (objAoi) {
      setPolygonLayer(getPolygonLayer(objAoi));
    }
  };

  return (
    <Row className="h-100 w-100 mx-auto">
      <Card className="map-card">
        <BaseMap layers={[polygonLayer]} />
        <MapCards />
      </Card>
    </Row>
  );
};

export default MapComponent;
