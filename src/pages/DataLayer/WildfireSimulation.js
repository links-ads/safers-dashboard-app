import React, { useState } from 'react';
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, FormGroup, Label, Row, Col, Card, Form } from 'reactstrap';
import { Formik } from 'formik';
import MapSection from './Map';
import * as Yup from 'yup'
import { getGeneralErrors, getError }  from '../../helpers/errorHelper';
import { withTranslation } from 'react-i18next'
import RequiredAsterisk from '../../components/required-asterisk'
import 'react-rangeslider/lib/index.css'
import { getBoundingBox } from '../../helpers/mapHelper';
import moment from 'moment';
import {
  getMapRequests,
  setNewOnDemandState
} from '../../store/appAction';

const PROBABILITY_RANGES = ['50%', '75%','90%']

const WildfireSimulationSchema = Yup.object().shape({
  simulationTitle: Yup.string()
    .required('This field cannot be empty'),
  simulationTimeLimit: Yup.number().min(1).max(48)
    .required('Simulation time limit should be between 1 and 48'),
  probabilityRange: Yup.string()
    .required('This field cannot be empty'),
  mapSelection: Yup.string()
    .required('This field cannot be empty'),
  startDate: Yup.date().required('This field cannot be empty'),
  [/^timeOffset\/*$/]: Yup.number().min(0).max(48),
  [/^windDirection\/*$/]: Yup.number().min(0).max(360),
  [/^windSpeed\/*$/]: Yup.number().min(0).max(300),
  [/^fuelMoistureContent\/*$/]: Yup.number().min(0).max(100)
});
  
const WildfireSimulation = ({ 
  t,
  handleCancel,
  handleResetAOI,
  setBoundingBox,
  viewState,
  setViewState,
}) => {

  const dispatch = useDispatch();
  
  const error = useSelector(state => state.auth.error);

  // for dynamic (vertical) table rows in `Boundary Conditions`
  const [tableEntries, setTableEntries] = useState([0]);

  const [midPoint, setMidPoint] = useState([]);
  const [currentZoomLevel, setCurrentZoomLevel] = useState(undefined);
  const [newWidth, setNewWidth] = useState(600);
  const [newHeight, setNewHeight] = useState(600);
  const [coordinates, setCoordinates] = useState('');

  // The other two forms allow user to select these from a dropdown. 
  // For this form we hard-code the list and pass along to the API
  // when we reshape the form data for submission

  const layerTypes = [
    {id: 35006, name:'Fire Simulation'},
    {id: 35011, name:'Max rate of spread'},
    {id: 35010, name:'Mean rate of spread'},
    {id: 35009, name:'Max fireline intensity'},
    {id: 35008, name:'Mean fireline intensity'},
    {id: 35007, name:'Fire perimeter simulation as isochrones maps'},
  ];

  const shapeFormData = (formData) => {
    return({
      title: formData.simulationTitle,
      parameters: {
        start: `${formData.ignitionDateTime}T00:00:00.000`,
        simulationTimeLimit: formData.simulationTimeLimit,
        probabilityRange: formData.probabilityRange,
        boundaryConditions: formData.boundaryConditions,
      },
      data_types: layerTypes.map(item=>item.id),
      geometry: formData.wkt,
    });
  };


  const submitMe = (formData) => {
    const shapedData = shapeFormData(formData);
    console.log('shapedData', shapedData);
    dispatch(getMapRequests(shapedData));
    dispatch(setNewOnDemandState(true,true));
  }
  const handleSubmitRequest = (values) => {
    // must reshape data to expected API shape
    console.log('FORM DATA', { ...values, wkt: coordinates });
  };


  // TODO: what is this for? is it shared across panels?
  const getReportsByArea = () => {
    setBoundingBox(getBoundingBox(midPoint, currentZoomLevel, newWidth, newHeight));
  }

  const handleViewStateChange = (e) => {
    if (e && e.viewState) {
      setMidPoint([e.viewState.longitude, e.viewState.latitude]);
      setCurrentZoomLevel(e.viewState.zoom);
    }
  };

  // used to compute end date from start date and number of hours
  const getDateOffset = (startTime, numberHours) => {
    if (!startTime || !numberHours) return;

    const endTime = moment(startTime)
      .add(numberHours, 'hours')
      .toISOString()
      .slice(0, 19);

    return endTime;
  }

  return (
    <Row>
      <Col xl={12}>
        <Row xl={5} className='mb-3'>
          <Col className='d-flex align-items-center'>
            <h4 className='m-0'>{t('requestMap')}</h4>
          </Col>
          <Col className="d-flex justify-content-end align-items-center">
            <Button color='link'
              onClick={handleResetAOI} className='p-0'>
              {t('default-aoi')}
            </Button>
          </Col>
        </Row>
        <Row xl={12}>
          <Formik
            initialValues={{ 
              simulationTitle: '', 
              probabilityRange: '75%',
              mapselection: '', 
              simulationTimeLimit: '',
              ignitionDateTime: null,
              simulationFireSpotting: false,
              boundaryConditions:[],
            }}
            validationSchema={WildfireSimulationSchema}
            onSubmit={values => handleSubmitRequest(values)}
            id="wildfireSimulationForm"
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => {
              console.log('ERRORS: ', errors);
              return (
                <Form onSubmit={handleSubmit} className='d-flex flex-column justify-content-between'>
                  <Row className='w-100'>
                    <Col className='d-flex flex-column justify-content-between'>
                      <Row>
                        {getGeneralErrors(error)}
                      </Row>
  
                      <Row xl={12}>
                        <h5>{t('wildfireSimulation')}</h5>
                      </Row>
  
                      <Row>
                        <FormGroup className="form-group">
                          <Label for="dataLayerType">
                            {t('simulationTitle')}:<RequiredAsterisk />
                          </Label>
                          <Input 
                            name="simulationTitle" 
                            className={getError('simulationTitle',errors,touched)}
                            id="simulationTitle"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.simulationTitle}
                            placeholder="[Type Simulation Title]"
                          />
                          {getError('simulationTitle', errors, touched, false)}
                        </FormGroup>
                      </Row>
  
                      <Row>
                        <FormGroup className='d-flex-column'>
                          <Row>
                            <Label for="probabilityRange" className='d-flex align-items-center'>
                              <i 
                                data-tip 
                                className='bx bx-info-circle font-size-8 p-0 me-1'
                                style={{ cursor: 'pointer' }}
                              />
                              {t('probabilityRange')}:<RequiredAsterisk />
                            </Label>
                          </Row>
                          <Row className='d-flex justify-content-start flex-nowrap gap-2'>
                            {PROBABILITY_RANGES.map(range => (
                              <Label
                                key={range}
                                id={range}
                                check
                                className='w-auto'
                              >
                                <Input
                                  id={range}
                                  name='probabilityRange'
                                  type="radio"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  checked={values.probabilityRange === range}
                                  value={range}
                                  className='me-2'
                                />
                                {range}
                              </Label>
                            ))}
                          </Row>
                        </FormGroup>
                      </Row>
  
                      <Row>
                        <FormGroup className="form-group">
                          <Label for="simulationTimeLimit">
                            {t('simulationTimeLimit')}:<RequiredAsterisk />
                          </Label>
                          <Input 
                            name="simulationTimeLimit" 
                            id="simulationTimeLimit"
                            className={getError('simulationTimeLimit',errors,touched)}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.simulationTimeLimit}
                            placeholder="Type Limit [hours]"
                          />
                          {getError('simulationTimeLimit', errors, touched, false)}
                        </FormGroup>
                      </Row>
  
                      <Row>
                        <FormGroup className="form-group">
                          <Label for="mapSelection">
                            {t('mapSelection')}:<RequiredAsterisk />
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
                          {getError('mapSelection', errors, touched, false)}
                        </FormGroup>
                      </Row>
  
                      <Row className='mb-3 w-100'>
                        <FormGroup className="form-group">
                          <Row>
                            <Col>
                              <Label for="ignitionDateTime">
                                {t('ignitionDateTime')}:<RequiredAsterisk />
                              </Label>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <Input
                                id="ignitionDateTime"
                                name="ignitionDateTime"
                                type="datetime-local"
                                className={getError('ignitionDateTime',errors,touched)}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.ignitionDateTime}
                              />
                            </Col>
                            <Col>
                              <Input
                                id="ignitionDateTime"
                                name="ignitionDateTime"
                                type="datetime-local"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={
                                  getDateOffset(values.ignitionDateTime, values.simulationTimeLimit)
                                }
                              />
                            </Col>
                          </Row>
                        </FormGroup>
                      </Row>
  
                      <Row xl={5} className='d-flex justify-content-between align-items-center flex-nowrap mb-3 w-100'>
                        <FormGroup className='d-flex flex-nowrap align-items-center w-100'>
                          <Label 
                            for="simulationFireSpotting" 
                            className='mb-0 me-3'
                          >
                            {t('simulationFireSpotting')}:
                          </Label>
                          <Input
                            id="simulationFireSpotting"
                            name="simulationFireSpotting"
                            type="checkbox"
                            value={values.simulationFireSpotting}
                            className='m-0'
                            style={{ cursor: 'pointer' }}
                          />
                          {getError('simulationFireSpotting', errors, touched, false)}
                        </FormGroup>
                      </Row>
                    </Col>
  
                    <Col xl={7} className='mx-auto'>
                      <Card className='map-card mb-0' style={{ height: 670 }}>
                        <MapSection
                          viewState={viewState}
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
  
                  <Row>
                    <FormGroup className="form-group">
                      <Label for="boundaryConditions" className='m-0'>
                        {t('boundaryConditions')}:<RequiredAsterisk />
                      </Label>
                      <table className='on-demand-table'
                      >
                        <thead>
                          <tr></tr>
                          <tr>{t('timeHours')}</tr>
                          <tr>{t('windDirection')}</tr>
                          <tr>{t('windSpeed')}</tr>
                          <tr>{t('fuelMoistureContent')}</tr>
                        </thead>
                        <tbody>
                          {tableEntries.map((position) => (
                            <tr key={position}>
                              <td>
                                {<i 
                                  className="bx bx-trash font-size-24 p-0 w-auto"
                                  onClick={() => setTableEntries(
                                    tableEntries.filter(
                                      entry => entry !== position
                                    )
                                  )}
                                  style={{ 
                                    cursor: 'pointer', 
                                    visibility: position === 0 ? 'hidden' : 'visible' 
                                  }} 
                                />}
                              </td>
                              <td>
                                <Input
                                  name={`timeOffset${position}`} 
                                  id={`timeOffset${position}`}
                                  placeholder='[type here]'
                                  value={position === 0 
                                    ? 0 
                                    : values[`timeOffset${position}`]
                                  }
                                  readOnly={position === 0}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                                {getError('timeOffset', errors, touched, false)}
                              </td>
                              <td>
                                <Input
                                  name={`windDirection${position}`} 
                                  id={`windDirection${position}`}
                                  placeholder='[type here]'
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                              </td>
                              <td>
                                <Input
                                  name={`windSpeed${position}`} 
                                  id={`windSpeed${position}`}
                                  placeholder='[type here]'
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                              </td>
                              <td>
                                <Input
                                  name={`fuelMoistureContent${position}`} 
                                  id={`fuelMoistureContent${position}`}
                                  placeholder='[type here]'
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <i
                          onClick={() => setTableEntries(
                            [...tableEntries, tableEntries.length]
                          )}
                          className="bx bx-plus-circle p-0 w-auto"
                          style={{ cursor: 'pointer', alignSelf: 'center', fontSize: '2.5rem' }}
                        />
                      </table>
                      {getError('boundaryConditions', errors, touched, false)}
                    </FormGroup>
                  </Row>
  
                  <Row>
                    <Col>
                      <Button 
                        type="submit"
                        disabled={isSubmitting}
                        className='btn btn-primary'
                        color="primary"
                      >
                        {t('request')}
                      </Button>
                      <Button
                        className='btn btn-secondary ms-3'
                        color="secondary"
                        onClick={handleCancel}
                      >
                        {t('cancel')}
                      </Button>
                    </Col>
                  </Row>
  
                </Form>
              )
            }}
          </Formik>
        </Row>
      </Col>
    </Row>
  )
}

WildfireSimulation.PropTypes = {
  t: PropTypes.any,
  handleCancel: PropTypes.function,
  handleResetAOI: PropTypes.function,
  setBoundingBox: PropTypes.function,
  viewState: PropTypes.object,
  setViewState: PropTypes.function,
} 

export default withTranslation(['dataLayers','common'])(WildfireSimulation);