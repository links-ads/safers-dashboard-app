import React, { useEffect, useState } from 'react';

import { PolygonLayer } from '@deck.gl/layers';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, Row, Col, FormGroup, Label } from 'reactstrap';
import toastr from 'toastr';

import { userSelector } from 'store/authentication.slice';
import { fetchAois, aoisSelector } from 'store/common.slice';
import {
  setUserDefaultAoi,
  defaultAoiSelector,
  setAoiSuccessMessageSelector,
} from 'store/user.slice';

import BaseMap from './BaseMap/BaseMap';

import 'toastr/build/toastr.min.css';

//i18n

const AreaOfInterestPanel = ({ t }) => {
  toastr.options = {
    preventDuplicates: true,
  };
  const user = useSelector(userSelector);
  const uid = user?.id;
  const allAoi = useSelector(aoisSelector);
  const aoiSetSuccess = useSelector(setAoiSuccessMessageSelector);
  const defaultAoi = useSelector(defaultAoiSelector);

  const [selectedAoi, setSelectedAoi] = useState(defaultAoi);
  const [polygonLayer, setPolygonLayer] = useState(undefined);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!allAoi.length) {
      dispatch(fetchAois());
    }
  }, [allAoi.length, dispatch]);

  useEffect(() => {
    if (defaultAoi) {
      setMap(defaultAoi);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultAoi]);

  useEffect(() => {
    if (aoiSetSuccess) {
      toastr.success(t('save-aoi-success-msg', { ns: 'common' }), '');
    }
  }, [aoiSetSuccess, t]);

  const handleSubmit = () => {
    dispatch(setUserDefaultAoi({ uid, aoi: selectedAoi }));
  };

  const setMap = defaultAoi => {
    setSelectedAoi(defaultAoi);
    setPolygonLayer(getPolygonLayer(defaultAoi));
  };

  const selectAoi = e => {
    const aoiID = e.target.value;
    const objAoi = _.find(allAoi, {
      features: [{ properties: { id: parseInt(aoiID) } }],
    });
    setMap(objAoi);
  };

  const getPolygonLayer = aoi => {
    const coordinates = aoi.features[0].geometry.coordinates;
    return new PolygonLayer({
      data: coordinates,
      pickable: true,
      stroked: true,
      filled: true,
      extruded: false,
      wireframe: true,
      lineWidthMinPixels: 1,
      opacity: 0.25,
      getPolygon: d => d,
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
        {sortedAois.map((aoisChunk, i) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <div className="d-flex flex-column me-5" key={i}>
              {aoisChunk.map((aoi, index) => {
                return (
                  <FormGroup
                    key={aoi.features[0].properties.id}
                    className="form-group mb-2"
                    check
                  >
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
              <BaseMap layers={[polygonLayer]} />
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

AreaOfInterestPanel.propTypes = {
  t: PropTypes.any,
};

export default withTranslation(['common'])(AreaOfInterestPanel);
