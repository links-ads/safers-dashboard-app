import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, Row, } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';
import { PolygonLayer } from '@deck.gl/layers';
import BaseMap from '../../layout/BaseMap/BaseMap';
import { setDefaultAoi } from '../../store/appAction';
import { getAllAreas } from '../../api/services/aoi';

const SelectArea = () => {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const defaultAoi = useSelector(state => state.user.defaultAoi);

  const [selectedAoi, setAoi] = useState(null);
  const [allAoi, setAllAoi] = useState([]);
  const [polygonLayer, setPolygonLayer] = useState(undefined);
  const [viewState, setViewState] = useState(undefined);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const getAllAoi = async () => {
      let aoiList = await getAllAreas();
      setAllAoi(aoiList)
    }
    if (isLoggedIn && defaultAoi)
      navigate('/dashboard');
    else
      getAllAoi();
  }, []);

  useEffect(() => {
    if (isLoggedIn && defaultAoi)
      navigate('/dashboard');
  }, [defaultAoi]);

  const handleSubmit = () => {
    dispatch(setDefaultAoi(selectedAoi))
  }

  const selectAoi = (e) => {
    const objAoi = _.find(allAoi, { features: [{ properties: { id: parseInt(e.target.value) } }] })
    setAoi(objAoi);
    setPolygonLayer(getPolygonLayer(objAoi));
    setViewState(getViewState(objAoi.features[0].properties.midPoint))
  }

  const getViewState = (midPoint) => {
    return {
      longitude: midPoint[0],
      latitude: midPoint[1],
      zoom: 4,
      bearing: 0,
      pitch: 0
    };
  }

  const getPolygonLayer = (aoi) => {
    const coordinates = aoi.features[0].geometry.coordinates;
    return (new PolygonLayer({
      id: 'polygon-layer',
      data: coordinates,
      pickable: true,
      stroked: true,
      filled: true,
      extruded: false,
      wireframe: true,
      lineWidthMinPixels: 1,
      opacity: .25,
      getPolygon: d => d,
      // getElevation: () => 10,
      getFillColor: [192, 105, 25],
      getLineColor: [0, 0, 0],
      getLineWidth: 100
    }))
  }

  return (
    <div className="jumbotron">
      <div className="container">
        <Row>
          <p>
            Before you start using the SAFERS software you need to select your area of interest. Please do select an area from the list below.
          </p>
        </Row>
        <Row>
          <div style={{ height: 500 }} className="mb-5">
            <BaseMap layers={[polygonLayer]} initialViewState={viewState} />
          </div>
        </Row>
        <Row>
          <Input
            id="selectedAoi"
            name="selectedAoi"
            placeholder="Select area of interest"
            type="select"
            onChange={selectAoi}
          >
            <option value={''} >Select area of interest</option>
            {allAoi.map((aoi, index) => { return (<option key={index} value={aoi.features[0].properties.id}>{aoi.features[0].properties.country} - {aoi.features[0].properties.name}</option>) })}
          </Input>
          <div className='center-sign-in'>
            <Button
              className="my-4 sign-in-btn"
              color="primary"
              onClick={handleSubmit}>
              SAVE AREA OF INTEREST
            </Button>
          </div>
        </Row>
      </div>
    </div>
  );
}

export default SelectArea;
