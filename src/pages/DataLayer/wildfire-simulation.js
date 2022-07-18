import React from 'react';
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux';
import { Button, Input, FormGroup, Label, Row, Col, Card, Form } from 'reactstrap';
import { Formik } from 'formik';
import BaseMap from '../../components/BaseMap/BaseMap';
import * as Yup from 'yup'
import { getGeneralErrors, getError }  from '../../helpers/errorHelper';
import { withTranslation } from 'react-i18next'
import DateRangePicker from '../../components/DateRangePicker/DateRange';
import 'react-rangeslider/lib/index.css'

const PROBABILITY_RANGES = ['50%', '75%','90%']

const WildfireSimulationSchema = Yup.object();

const WildfireSimulation = ({t}) => {
  const error = useSelector(state => state.auth.error);

  const handleSubmitRequest = (event) => { alert('Clicked request');};

  const handleCancel = (event) => { alert('Clicked canel');}

  return (
    <div>
      <Row>
        <Col xl={5}>

          <Row xl={12}>
            <Col className='d-flex align-items-center justify-content-between flex-nowrap mb-3'>
              <h4 className='m-0'>{t('requestamap')}</h4>
              <Button
                className="request-map btn-orange"
                onClick={() => console.log('AOI click')}
              >
                {t('aoilocation')}
              </Button>
            </Col>
          </Row>

          <Row xl={12}>
            <h5>Wilfire Simulation</h5>
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
              id="wildfire-simulation-form"
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
                <Form onSubmit={handleSubmit} noValidate>
                  <Row>
                    {getGeneralErrors(error)}
                  </Row>

                  <Row>
                    <FormGroup className="form-group">
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
                      <h5 className='m-0'>Probability Range:</h5>
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
                    <h5 className='m-0'>Simulation Time Limit:</h5>
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
                    <h5 className='m-0'>Ignition Date &amp; Time:</h5>
                  </Row>
                  <Row className='mb-3 w-100'>
                    <DateRangePicker />
                  </Row>

                  <Row className='mb-3 w-100'>
                    <h5 className='m-0'>Ignition Date &amp; Time:</h5>
                  </Row>
                  <Row className='d-flex-row align-items-center flex-nowrap mb-3 w-100'>
                    <i 
                      data-tip 
                      className='bx bx-info-circle font-size-8 me-3 p-0 w-auto'
                    />
                    <h5 className='m-0'>Simulation Fire Spotting:</h5>
                    <button>Y</button>
                    <button>N</button>
                  </Row>

                  <div>
                    <div>Boundary conditions (table)</div>
                  </div>
                </Form>
              )}
            </Formik>
          </Row>

        </Col>
        <Col xl={7} className='mx-auto'>
          <Card className='map-card mb-0' style={{ height: 670 }}>
            <BaseMap
              layers={[]}
              initialViewState={{}}
              widgets={[]}
              screenControlPosition='top-right'
              navControlPosition='bottom-right'
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

WildfireSimulation.PropTypes = {
  t: PropTypes.any
}

export default withTranslation(['dataLayers','common'])(WildfireSimulation);