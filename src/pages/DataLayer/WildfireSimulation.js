/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux';
import { Button, Input, FormGroup, Label, Row, Col, Card, Form } from 'reactstrap';
import { Formik } from 'formik';
import MapSection from './Map';
import * as Yup from 'yup'
import { getGeneralErrors, getError }  from '../../helpers/errorHelper';
import { withTranslation } from 'react-i18next'
import DateRangePicker from '../../components/DateRangePicker/DateRange';
import RequiredAsterisk from '../../components/required-asterisk'
import { DATA_LAYERS_PANELS } from './constants';
import 'react-rangeslider/lib/index.css'
import { getBoundingBox } from '../../helpers/mapHelper';

const PROBABILITY_RANGES = ['50%', '75%','90%']

const WildfireSimulationSchema = Yup.object().shape({

});


  
const WildfireSimulation = ({ 
  t,
  setActiveTab,
  handleResetAOI,
}) => {
  const error = useSelector(state => state.auth.error);

  const [tableEntries, setTableEntries] = useState([1])

  //const defaultAoi = useSelector(state => state.user.defaultAoi);

  //const handleSubmitRequest = (event) => { alert('Clicked request');};
  //const handleCancel = (event) => { alert('Clicked canel');}

  const [viewState, setViewState] = useState(undefined);
  const [iconLayer, setIconLayer] = useState(undefined);
  const [midPoint, setMidPoint] = useState([]);
  const [boundingBox, setBoundingBox] = useState(undefined);
  const [currentZoomLevel, setCurrentZoomLevel] = useState(undefined);
  const [newWidth, setNewWidth] = useState(600);
  const [newHeight, setNewHeight] = useState(600);
  const [coordinates, setCoordinates] = useState([]);
  //const [togglePolygonMap, setTogglePolygonMap] = useState(false);
  //const [toggleCreateNewMessage, setToggleCreateNewMessage] = useState(false);

  //const handleSubmitRequest = (event) => { alert('Clicked request');};

  const getReportsByArea = () => {
    setBoundingBox(getBoundingBox(midPoint, currentZoomLevel, newWidth, newHeight));
  }

  const handleViewStateChange = (e) => {
    if (e && e.viewState) {
      setMidPoint([e.viewState.longitude, e.viewState.latitude]);
      setCurrentZoomLevel(e.viewState.zoom);
    }
  };

  return (
    <Row>
      <Col xl={5}>
        <Row className='mb-3'>
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
              datalayertype: '', 
              requesttitle: '', 
              mapselection: '', 
              startdate: null, 
              enddate: null, 
              frequency: null,
              resolution: null, 
            }}
            validationSchema={WildfireSimulationSchema}
            onSubmit={(values) => {console.log('values', values)}}
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
            }) => (
              <Form onSubmit={handleSubmit} className='d-flex flex-column justify-content-between'>
                <Row>
                  {getGeneralErrors(error)}
                </Row>
                <Row xl={12}>
                  {/* // TODO: add translation */}
                  <h5>{t('wildfireSimulation')}</h5>
                </Row>
                <Row>
                  <FormGroup className="form-group">
                    <Label for="dataLayerType">
                      {t('simulationTitle')}<RequiredAsterisk />
                    </Label>
                    <Input 
                      name="simulationTitle" 
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
                  <FormGroup>
                    <i 
                      data-tip 
                      className='bx bx-info-circle font-size-8 me-3 p-0'
                    />
                    <h5 className='m-0'>{t('probabilityRange')}:</h5>
                  </FormGroup>
                </Row>
                <Row>
                  <FormGroup className='d-flex flex-nowrap align-items-center gap-3'>
                    {PROBABILITY_RANGES.map(range => (
                      <Label
                        key={range}
                        id={range}
                        check
                      >
                        <Input
                          id={range}
                          name='probabilityRange'
                          type="radio"
                          onChange={handleChange}
                          checked={values.probabilityRange === range}
                          value={range}
                          className='me-2'
                        />
                        {range}
                      </Label>
                    ))}
                  </FormGroup>
                </Row>

                <Row className='mb-3 w-100'>
                  <h5 className='m-0'>{t('simulationTimeLimit')}</h5>
                </Row>
                <Row>
                  <FormGroup className="form-group">
                    <Input 
                      name="simulationTimeLimit" 
                      id="simulationTimeLimit"
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
                    <h5 className='m-0'>{t('mapSelection')}</h5>
                    <Input 
                      name="mapSelection" 
                      id="mapSelection"
                      type="textarea"
                      rows="5"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.mapSelection}
                      placeholder="Map Selection (Ignition zone/ point)"
                    />
                    {getError('mapSelection', errors, touched, false)}
                  </FormGroup>
                </Row>

                <Row className='mb-3 w-100'>
                  <h5 className='m-0'>{t('ignitionDateTime')}</h5>
                </Row>
                <Row className='mb-3 w-100'>
                  <DateRangePicker />
                </Row>

                <Row xl={5} className='d-flex justify-content-between align-items-center flex-nowrap mb-3 w-100'>
                  <i 
                    data-tip 
                    className='bx bx-info-circle font-size-8 me-3 p-0 w-auto'
                  />
                  <h5 className='m-0'>{t('simulationFireSpotting')}</h5>
                  <button>Y</button>
                  <button>N</button>
                  {getError('simulationFireSpotting', errors, touched, false)}
                </Row>

                <Row className='mb-3 w-100'>
                  <h5 className='m-0'>{t('boundaryConditions')}</h5>
                </Row>
                <Row>
                  <FormGroup className="form-group">
                    <table style={{ display: 'flex' }}>
                      <thead style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        marginRight: '1rem'
                      }}>
                        <tr>{t('timeHours')}</tr>
                        <tr>{t('windDirection')}<RequiredAsterisk /></tr>
                        <tr>{t('windSpeed')}<RequiredAsterisk /></tr>
                        <tr>{t('fuelMoistureContent')}<RequiredAsterisk /></tr>
                      </thead>
                      <tbody style={{
                        maxwidth:'2048px',
                        display: 'flex',
                        overflowX: 'scroll',
                      }}>
                        {tableEntries.map((position) => {
                          return (
                            <tr key={position} style={{
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between'
                            }}>
                              <td 
                                style={{
                                  display: 'flex'
                                }}
                              >
                                {position}
                                &nbsp;
                                <div
                                  onClick={() => setTableEntries(
                                    tableEntries.filter(
                                      entry => entry !== position
                                    )
                                  )}
                                  style={{
                                    fontSize: '2rem',
                                    cursor: 'pointer'
                                  }}
                                >
                                  X
                                </div>
                              </td>
                              <td>
                                <Input
                                  name={`windDirection${position}`} 
                                  id={`windDirection${position}`}
                                  placeholder='[type here]'
                                />
                              </td>
                              <td>
                                <Input
                                  name={`windSpeed${position}`} 
                                  id={`windSpeed${position}`}
                                  placeholder='[type here]'
                                />
                              </td>
                              <td>
                                <Input
                                  name={`fuelMoistureContent${position}`} 
                                  id={`fuelMoistureContent${position}`}
                                  placeholder='[type here]'
                                />
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                      <div 
                        onClick={() => setTableEntries(
                          [...tableEntries, tableEntries.length + 1]
                        )}
                        style={{ fontSize: '2.5rem', cursor: 'pointer', alignSelf: 'center' }}
                      >
                        +
                      </div>
                    </table>
                    {getError('boundaryConditions', errors, touched, false)}
                  </FormGroup>
                </Row>
                <Row>
                  <Col>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className='btn btn-primary'
                      color="primary"
                    >
                      {t('request')}
                    </button>
                    <Button
                      onClick={() => setActiveTab(DATA_LAYERS_PANELS.onDemandMapLayers)}
                      className='btn btn-secondary'
                      color="secondary"
                    >
                      {t('cancel')}
                    </Button>
                  </Col>
                </Row>
              </Form>
            )}
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
  )
}

WildfireSimulation.PropTypes = {
  t: PropTypes.any,
  setActiveTab: PropTypes.any,
  handleResetAOI: PropTypes.function
} 

export default withTranslation(['dataLayers','common'])(WildfireSimulation);