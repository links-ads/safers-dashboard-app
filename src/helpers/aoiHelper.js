import React, { useEffect, useState } from 'react';

import { PolygonLayer } from '@deck.gl/layers';
import { FlyToInterpolator } from 'deck.gl';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, Row, Col, FormGroup, Label } from 'reactstrap';
import toastr from 'toastr';

import BaseMap from '../components/BaseMap/BaseMap';
import { getAllAreas, setDefaultAoi } from '../store/appAction';

import 'toastr/build/toastr.min.css';

//i18n

const AoiHelper = ({ t }) => {
  toastr.options = {
    preventDuplicates: true,
  };
  const { id: uid } = useSelector(state => state.auth.user);
  const allAoi = useSelector(state => state.common.aois);
  const { aoiSetSuccess, defaultAoi } = useSelector(state => state.user);

  const [selectedAoi, setSelectedAoi] = useState(defaultAoi);
  const [polygonLayer, setPolygonLayer] = useState(undefined);
  const [viewState, setViewState] = useState(undefined);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!allAoi.length) {
      dispatch(getAllAreas());
    }
  }, [allAoi.length, dispatch]);

  useEffect(() => {
    if (defaultAoi) {
      setMap(defaultAoi);
    }
  }, [defaultAoi]);

  useEffect(() => {
    if (aoiSetSuccess) {
      toastr.success(t('save-aoi-success-msg', { ns: 'common' }), '');
    }
  }, [aoiSetSuccess, t]);

  const handleSubmit = () => {
    dispatch(setDefaultAoi(uid, selectedAoi));
  };

  const setMap = defaultAoi => {
    setSelectedAoi(defaultAoi);
    setPolygonLayer(getPolygonLayer(defaultAoi));
    setViewState(
      getViewState(
        defaultAoi.features[0].properties.midPoint,
        defaultAoi.features[0].properties.zoomLevel,
      ),
    );
  };

  const selectAoi = e => {
    const aoiID = e.target.value;
    const objAoi = _.find(allAoi, {
      features: [{ properties: { id: parseInt(aoiID) } }],
    });
    setMap(objAoi);
  };

  const getViewState = (midPoint, zoomLevel = 4) => {
    return {
      longitude: midPoint[0],
      latitude: midPoint[1],
      zoom: zoomLevel,
      bearing: 0,
      pitch: 0,
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator(),
    };
  };

  const getPolygonLayer = aoi => {
    const coordinates = aoi.features[0].geometry.coordinates;
    return new PolygonLayer({
      id: 'polygon-layer',
      data: coordinates,
      pickable: true,
      stroked: true,
      filled: true,
      extruded: false,
      wireframe: true,
      lineWidthMinPixels: 1,
      opacity: 0.25,
      getPolygon: d => d,
      // getElevation: () => 10,
      getFillColor: [192, 105, 25],
      getLineColor: [0, 0, 0],
      getLineWidth: 100,
    });
  };

  const renderAreasOfInterest = () => {
    let aoisToSplit = _.cloneDeep(allAoi);
    const sortedAois = _.chunk(aoisToSplit, 3);

    const selVal = selectedAoi ? selectedAoi.features[0].properties.id : null;
    return (
      <>
        {sortedAois.map(aoisChunk => {
          return (
            <div className="d-flex flex-column me-5" key={aoisChunk}>
              {aoisChunk.map((aoi, index) => {
                return (
                  <FormGroup key={aoi} className="form-group mb-2" check>
                    <Label check id={`selectAoi${index}`}>
                      <Input
                        id={`selectAoi${index}`}
                        name="aoi-selection"
                        type="radio"
                        onChange={selectAoi}
                        checked={aoi.features[0].properties.id === selVal}
                        value={aoi.features[0].properties.id}
                        data-test-id={`select-default-aoi-on-helper${index}`}
                      />
                      {aoi.features[0].properties.country ===
                      aoi.features[0].properties.name
                        ? aoi.features[0].properties.country
                        : `${aoi.features[0].properties.country} - ${aoi.features[0].properties.name}`}
                    </Label>
                  </FormGroup>
                );
              })}
            </div>
          );
        })}
      </>
    );
  };

  return (
    <>
      <div className="m-4 d-flex flex-row">{renderAreasOfInterest()}</div>
      <Row>
        <Col xl={8} md={10} xs={10} className="mx-auto">
          <Row>
            <div style={{ height: 350 }} className="mb-5">
              <BaseMap layers={[polygonLayer]} initialViewState={viewState} />
            </div>
          </Row>
          <Row>
            <div className="center-sign-in">
              <Button
                className="my-4 sign-in-btn"
                color="primary"
                onClick={handleSubmit}
                data-test-id="save-default-aoi-btn"
              >
                {t('save-aoi')}
              </Button>
            </div>
          </Row>
        </Col>
      </Row>
    </>
  );
};

AoiHelper.propTypes = {
  t: PropTypes.any,
};

export default withTranslation(['common'])(AoiHelper);
