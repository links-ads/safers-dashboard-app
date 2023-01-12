import React, { useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Row } from 'reactstrap';
import { getAllAreas } from '../../../store/appAction'
import BaseMap from '../../../components/BaseMap/BaseMap';
import { getPolygonLayer, getViewState } from '../../../helpers/mapHelper';
import _ from 'lodash';
import { setPolygonLayer, setSelectedAoi, setViewState } from '../../../store/common/action';

const MapComponent = () => {
  const { polygonLayer, viewState } = useSelector(state => state.common);
  const dispatch = useDispatch()
  const defaultAoi = useSelector(state => state.user.defaultAoi);

  const {aois: allAoi} = useSelector(
    state => state.common
  )

  useEffect(() => {
    if(!allAoi.length){
      dispatch(getAllAreas());
    }
  }, []);

  const setMapLayers = (objAoi) => {
    if(objAoi){
      dispatch(setPolygonLayer(getPolygonLayer(objAoi)));
      dispatch(setViewState(getViewState(objAoi.features[0].properties.midPoint, objAoi.features[0].properties.zoomLevel)))
    }
  }

  const selectAoi = (id) => {
    const objAoi = _.find(allAoi, { features: [{ properties: { id: parseInt(id) } }] })
    dispatch(setSelectedAoi(parseInt(id)));
    setMapLayers(objAoi)
  }

  useEffect(() => {
    selectAoi(defaultAoi.features[0].properties.id)
  }, [allAoi]);

  return (
    <Card className='map-card'>
      <Row style={{ height: 350 }} className="mb-5">
        <BaseMap layers={[polygonLayer]} initialViewState={viewState} />
      </Row>
    </Card>

  );
}

export default MapComponent;
