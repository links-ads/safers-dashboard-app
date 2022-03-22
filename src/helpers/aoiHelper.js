import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, Row, Col, FormGroup, Label } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';
import { PolygonLayer } from '@deck.gl/layers';
import BaseMap from '../layout/BaseMap/BaseMap';
import { setDefaultAoi } from '../store/appAction';
import { getAllAreas } from '../api/services/aoi';

const AoiHelper = () => {
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
    setViewState(getViewState(objAoi.features[0].properties.midPoint, objAoi.features[0].properties.zoomLevel))
  }

  const getViewState = (midPoint, zoomLevel = 4) => {
    return {
      longitude: midPoint[0],
      latitude: midPoint[1],
      zoom: zoomLevel,
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

  const chunkMaxLength = (arr, chunkSize, maxLength) => {
    return Array.from({ length: maxLength }, () => arr.splice(0, chunkSize));
  }
  const renderAreasOfInterest = () => {
    let aoisToSplit = _.cloneDeep(allAoi);
    const sortedAois = chunkMaxLength(aoisToSplit, 3, Math.ceil(aoisToSplit.length / 3));
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
