import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, Row, Col, FormGroup, Label } from 'reactstrap';
// import { useNavigate } from 'react-router-dom';
import _ from 'lodash';
import { PolygonLayer } from '@deck.gl/layers';
import BaseMap from '../layout/BaseMap/BaseMap';
import { getAllAreas, setDefaultAoi } from '../store/appAction';
import { FlyToInterpolator } from 'deck.gl';

const AoiHelper = () => {
  const uid = useSelector(state => state.auth.user.id);
  const allAoi = useSelector(state => state.common.aois);

  const [selectedAoi, setAoi] = useState(null);
  const [polygonLayer, setPolygonLayer] = useState(undefined);
  const [viewState, setViewState] = useState(undefined);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllAreas());
  }, []);

  const handleSubmit = () => {
    dispatch(setDefaultAoi(uid, selectedAoi))
  }

  const selectAoi = (e) => {
    const objAoi = _.find(allAoi, { features: [{ properties: { id: parseInt(e.target.value) } }] })
    setAoi(parseInt(e.target.value));
    setPolygonLayer(getPolygonLayer(objAoi));
    setViewState(getViewState(objAoi.features[0].properties.midPoint, objAoi.features[0].properties.zoomLevel))
  }

  const getViewState = (midPoint, zoomLevel = 4) => {
    return {
      longitude: midPoint[0],
      latitude: midPoint[1],
      zoom: zoomLevel,
      bearing: 0,
      pitch: 0,
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

  const renderAreasOfInterest = () => {
    let aoisToSplit = _.cloneDeep(allAoi);
    const sortedAois = _.chunk(aoisToSplit, 3)
    return (<>
      {sortedAois.map((aoisChunk, i) => {
        return (
          <div className='d-flex flex-column me-5' key={i}>{aoisChunk.map((aoi, index) => {
            return (
              <FormGroup key={index} className="form-group mb-2" check>
                <Input
                  id={`selectAoi${index}`}
                  name="rememberMe"
                  type="radio"
                  onChange={selectAoi}
                  value={aoi.features[0].properties.id}
                />
                <Label
                  check
                  id={`selectAoi${index}`}
                >
                  {aoi.features[0].properties.country} - {aoi.features[0].properties.name}
                </Label>
              </FormGroup>
            )
          })}
          </div>
        )
      })}
    </>
    );
  }

  return (
    <>
      <div className='m-4 d-flex flex-row'>
        {renderAreasOfInterest()}
      </div>
      <Row>
        <Col xl={8} md={10} xs={10} className='mx-auto'>
          <Row>
            <div style={{ height: 350 }} className="mb-5">
              <BaseMap layers={[polygonLayer]} initialViewState={viewState} />
            </div>
          </Row>
          <Row>
            <div className='center-sign-in'>
              <Button
                className="my-4 sign-in-btn"
                color="primary"
                onClick={handleSubmit}>
                SAVE AREA OF INTEREST
              </Button>
            </div>
          </Row>
        </Col>
      </Row>
    </>
  )
}

export default AoiHelper;
