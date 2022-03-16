import React, { useEffect, useState, useCallback } from 'react';
import { /*useDispatch,*/ useSelector } from 'react-redux';
import {/* Button,Input,*/ Row, Col, /* Label */ Button } from 'reactstrap';
// import { useNavigate } from 'react-router-dom';
// import _ from 'lodash';
import { PolygonLayer, FlyToInterpolator } from 'deck.gl';
import BaseMap from '../../layout/BaseMap/BaseMap';

const FireAlerts = () => {
  const defaultAoi = useSelector(state => state.user.defaultAoi);

  const [polygonLayer, setPolygonLayer] = useState(undefined);
  const [viewState, setViewState] = useState(undefined);

  // const dispatch = useDispatch();

  useEffect(() => {
    setPolygonLayer(getPolygonLayer(defaultAoi));
    setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel))
  }, []);

  // const handleSubmit = () => {
  //   dispatch(setDefaultAoi(selectedAoi))
  // }

  const getViewState = (midPoint, zoomLevel = 4) => {
    return {
      longitude: midPoint[0],
      latitude: midPoint[1],
      zoom: zoomLevel + 1.25,
      pitch: 0,
      bearing: 0,
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator()
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

  const handleResetAOI = useCallback(() => {
    setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel))
  }, []);

  return (
    <div className='page-content'>
      <Row className='g-0'>
        <Row>
          <Col xl={11} md={10} xs={12} className='mx-auto sign-up-aoi-map-bg mb-2.5'>
            <Row className='m-4 d-flex flex-row'>
              <Col xl={4}>Alert List</Col>
              <Col xl={4} className='text-center'>
                <Button className='btn'
                  onClick={handleResetAOI}>Default AOI</Button>
              </Col>
              <Col xl={4}>
                <div className="col-md-10">
                  <input
                    className="form-control"
                    type="date"
                    defaultValue="2019-08-19"
                    id="example-date-input"
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col xl={5}>
                <Row>
                  <Col xl={4}>
                    <input className="form-control" list="datalistOptions" id="exampleDataList" placeholder="Type to search..." />
                    <datalist id="datalistOptions">
                      <option value="San Francisco" />
                      <option value="New York" />
                      <option value="Seattle" />
                      <option value="Los Angeles" />
                      <option value="Chicago" />
                    </datalist>
                  </Col>
                  <Col xl={4}>
                    <input className="form-control" list="datalistOptions" id="exampleDataList" placeholder="Type to search..." />
                    <datalist id="datalistOptions">
                      <option value="San Francisco" />
                      <option value="New York" />
                      <option value="Seattle" />
                      <option value="Los Angeles" />
                      <option value="Chicago" />
                    </datalist>
                  </Col>
                  <Col xl={4}>Results 18</Col>
                </Row>
                <Row></Row>
              </Col>
              <Col xl={7} className='mx-auto'>
                <div style={{ height: 700 }} className="mb-5">
                  <BaseMap layers={[polygonLayer]} initialViewState={viewState} />
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Row >

    </div >

  );
}

export default FireAlerts;
