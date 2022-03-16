import React, { useState } from 'react';
import { Card, Row } from 'reactstrap';

import BaseMap from '../../../layout/BaseMap/BaseMap';
import MapCards from '../Components/MapCards';


const SelectArea = () => {
  // const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  // const defaultAoi = useSelector(state => state.user.defaultAoi);

  // const [selectedAoi] = useState(null);
  // const [allAoi, setAllAoi] = useState([]);
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

export default SelectArea;
