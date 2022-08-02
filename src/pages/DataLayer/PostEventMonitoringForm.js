/* eslint-disable no-unused-vars */
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, FormGroup, Label, Row, Col, Card, Form } from 'reactstrap';
import { Formik } from 'formik';
import MapSection from './Map';
import * as Yup from 'yup'
import { getGeneralErrors, getError }  from '../../helpers/errorHelper';
import { getBoundingBox, getViewState } from '../../helpers/mapHelper';
import RequiredAsterisk from '../../components/required-asterisk'
import {
  getMapRequests
} from '../../store/appAction';

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

  const dispatch = useDispatch();

  const error = useSelector(state => state.auth.error);
  const defaultAoi = useSelector(state => state.user.defaultAoi);

  const handleCancel = () => { alert('Clicked canel');}

  const [viewState, setViewState] = useState(undefined);
  const [iconLayer, ] = useState(undefined);
  const [midPoint, setMidPoint] = useState([]);
  const [, setBoundingBox] = useState(undefined);
  const [currentZoomLevel, setCurrentZoomLevel] = useState(undefined);
  const [newWidth, setNewWidth] = useState(600);
  const [newHeight, setNewHeight] = useState(600);
  const [coordinates, setCoordinates] = useState('');

  const shapeFormData = (formData) => {
    console.log('formdata', formData);
    return({
      title: formData.requesttitle,
      parameters: {
        start: `${formData.startDate}T00:00:00.000`,
        end: `${formData.endDate}T00:00:00.000`,
      },
      data_types: formData.datalayertype,
      geometry: formData.wkt,
    });
  };

  const submitMe = (formData) => {
    const shapedData = shapeFormData(formData);
    console.log('shapedData', shapedData);
    dispatch(getMapRequests(shapedData));
  }

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


  // TODO:  hard wired for now, this will be replaced with an API call in time
  const layerTypes = [
    {id:37006, name: 'Generate vegetation recovery map'},
    {id:37005, name: 'Generate historical severity map (dNBR)'},
    {id:37004, name: 'Provide landslide susceptibility information'},
    {id:37003, name: 'Generate soil recovery map (Vegetation Index)'},
    {id:37002, name: 'Generate burn severity map (dNBR)'},
    {id:32005, name: 'Get critical points of infrastructure, e.g. airports, motorways, hospitals, etc.'}
  ];

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
                          className={getError('datalayertype',errors,touched)}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.datalayertype}
                          multiple
                        >
                          <option disabled value=''>
                          Select Data Layer Type(s)
                          </option>
                          {layerTypes.map(item => (
                            <option key={`option_${item.name}`} value={item.id}>{`${item.id} - ${item.name}`}</option>
                          ))}
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
                          id="mapSelection"
                          name="mapSelection"
                          type="textarea"
                          rows="5"
                          className={coordinates && coordinates.length>0 ? '' : getError('mapSelection',errors,touched)}
                          onChange={(e)=>{
                            setCoordinates(e.target.value);
                          }}
                          onBlur={handleBlur}
                          value={coordinates}
                          placeholder='Enter Well Known Text or draw a polygon on the map'
                        />
                        {coordinates && coordinates.length>0 ? '' : getError('mapselection', errors, touched, false)}
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
                              className={getError('startdate',errors,touched)}
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
                              className={getError('enddate',errors,touched,true)}
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
                          type="submit"
                          onClick={()=>submitMe({...values, wkt:coordinates})}
                          disabled={isSubmitting}
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
              coordinates={coordinates}
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