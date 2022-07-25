/* eslint-disable no-unused-vars */
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Button, Input, FormGroup, Label, Row, Col, Card, Form } from 'reactstrap';
import { Formik } from 'formik';
import MapSection from './Map';
import * as Yup from 'yup'
import { getGeneralErrors, getError }  from '../../helpers/errorHelper';
import { getBoundingBox, getIconLayer, getViewState } from '../../helpers/mapHelper';
import RequiredAsterisk from '../../components/required-asterisk'

//i18n
import { withTranslation } from 'react-i18next'
import 'react-rangeslider/lib/index.css'

const postEventMonitoringSchema = Yup.object().shape({
  datalayertype: Yup.array()
    .required('This field cannot be empty'),
  requesttitle: Yup.string().optional(),
  mapselection: Yup.string()
    .required('This field cannot be empty'),
  startdate: Yup.date()
    .required('This field cannot be empty'),
  enddate: Yup.date()
    .required('This field cannot be empty'),
});


const PostEventMonitoring = ({ t }) => {
  console.log('t',t);

  const error = useSelector(state => state.auth.error);
  const defaultAoi = useSelector(state => state.user.defaultAoi);

  const handleSubmitRequest = (event) => { alert('Clicked request');};
  const handleCancel = (event) => { alert('Clicked canel');}

  const [viewState, setViewState] = useState(undefined);
  const [iconLayer, setIconLayer] = useState(undefined);
  const [midPoint, setMidPoint] = useState([]);
  const [boundingBox, setBoundingBox] = useState(undefined);
  const [currentZoomLevel, setCurrentZoomLevel] = useState(undefined);
  const [newWidth, setNewWidth] = useState(600);
  const [newHeight, setNewHeight] = useState(600);
  const [coordinates, setCoordinates] = useState([]);
  const [togglePolygonMap, setTogglePolygonMap] = useState(false);
  const [toggleCreateNewMessage, setToggleCreateNewMessage] = useState(false);

  const getReportsByArea = () => {
    setBoundingBox(getBoundingBox(midPoint, currentZoomLevel, newWidth, newHeight));
  }

  const handleViewStateChange = (e) => {
    if (e && e.viewState) {
      setMidPoint([e.viewState.longitude, e.viewState.latitude]);
      setCurrentZoomLevel(e.viewState.zoom);
    }
  };

  const handleResetAOI = useCallback(() => {
    setBoundingBox(undefined);
    setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel))
  }, []);

  const formatWKT = (coordinates) => {
    // format coords as WKT
    const list = coordinates.map(xy => `${xy[0].toFixed(6)} ${xy[1].toFixed(6)}`);
    return `POLYGON((${list.join(',\n')}))`;
  }

  return (
    // <div className='page-content'>
    <div>
    
      <Row>
        <Col xl={5}>
          <Row>
            {/* Form goes here */}
            <Formik
              initialValues={{ 
                datalayertype: '', 
                requesttitle: '', 
                mapselection: '', 
                startdate: null, 
                enddate: null, 
                frequency: null,
                resolution: null, 
              }}
              validationSchema={postEventMonitoringSchema}
              onSubmit={(values) => {console.log('values', values)}}
              id="fireandburnedarea-form"
            >
              {
                (
                  {
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                  }
                ) => (
                  <Form onSubmit={handleSubmit} noValidate>
                    <Row>
                      <Col><h4>{t('requestMap')}</h4></Col>
                      <Col className="d-flex justify-content-end align-items-center">
                        <Button color='link'
                          onClick={handleResetAOI} className='p-0'>
                          {t('default-aoi')}
                        </Button>
                      </Col>
                    </Row>
                    <Row>
                      {getGeneralErrors(error)}
                    </Row>
                    <Row>
                      <h5>{t('posteventmonitoring')}</h5>
                    </Row>
                    <Row>
                      <FormGroup className="form-group">
                        <Label for="datalayertype">
                          {t('datalayertype')}<RequiredAsterisk />
                        </Label>
                        <Input 
                          name="datalayertype"
                          id="datalayertype"
                          type="select"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.datalayertype}
                          multiple
                        >
                          <option>
                            1
                          </option>
                          <option>
                            2
                          </option>
                          <option>
                            3
                          </option>
                          <option>
                            4
                          </option>
                          <option>
                            5
                          </option>
                        </Input>
                        {getError('datalayertype', errors, touched, false)}
                      </FormGroup>
                    </Row> 
                    <Row>
                      <FormGroup className="form-group">
                        <Label for="requestitle">
                          {t('requestTitle')}
                        </Label>
                        <Input 
                          name="requesttitle" 
                          id="requesttitle"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.requesttitle}
                          placeholder="[type request title]"
                        />
                        {getError('requesttitle', errors, touched, false)}
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup className='form-group'>
                        <Label for="mapselection">
                          {t('mapSelection')}<RequiredAsterisk />
                        </Label>
                        <Input
                          id="mapselection"
                          name="mapselection"
                          type="textarea"
                          rows="5"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={coordinates.length > 0 ? formatWKT(coordinates) : values.mapselection }
                          placeholder='Enter a comma-separated list of vertices, or draw a polygon on the map. If you enter coordinates these should be in WSG84, longitude then latitude.'
                        />
                        {getError('mapselection', errors, touched, false)}
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup className='form-group'>
                        <Row>
                          <Col>
                            <Label for="startdate">
                              {t('startDate')}<RequiredAsterisk />
                            </Label>
                            <Input
                              id="startdate"
                              name="startdate"
                              type="date"
                              onChange={handleChange}
                              onBlur={handleBlur} 
                              value={values.startdate}
                            />
                            {getError('startdate', errors, touched, false)}
                          </Col>
                          <Col>
                            <Label for="enddate">
                              {t('endDate')}<RequiredAsterisk />
                            </Label>
                            <Input
                              id="enddate"
                              name="enddate"
                              type="date"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.enddate}
                            />
                            {getError('enddate', errors, touched, false)}
                          </Col>
                        </Row>
                      </FormGroup>
                    </Row>
                    <Row>
                      <Col>
                        <Button
                          value={{}} 
                          onClick={handleSubmitRequest}
                          className='btn btn-primary'
                          color="primary"
                        >
                          {t('request')}
                        </Button>
                        <Button
                          value={{}} 
                          onClick={handleCancel}
                          className='btn btn-secondary'
                          color="secondary"
                        >
                          {t('cancel')}
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                )
              }
            </Formik>
          </Row>
        </Col>
        <Col xl={7} className='mx-auto'>
          <Card className='map-card mb-0' style={{ height: 670 }}>
            <MapSection
              viewState={viewState}
              iconLayer={iconLayer}
              setViewState={setViewState}
              getReportsByArea={getReportsByArea}
              handleViewStateChange={handleViewStateChange}
              setNewWidth={setNewWidth}
              setNewHeight={setNewHeight}
              setCoordinates={setCoordinates}
              togglePolygonMap={true}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

PostEventMonitoring.propTypes = {
  t: PropTypes.any,
}

export default withTranslation(['dataLayers','common'])(PostEventMonitoring);