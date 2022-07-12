import React from 'react';
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux';
import { Button, Input, FormGroup, Label, Row, Col, Card, Form } from 'reactstrap';
import { Formik } from 'formik';
import BaseMap from '../../components/BaseMap/BaseMap';
import * as Yup from 'yup'
import { getGeneralErrors, getError }  from '../../helpers/errorHelper';
import { withTranslation } from 'react-i18next'
import 'react-rangeslider/lib/index.css'

const WildfireSimulationSchema = Yup.object();

const WildfireSimulation = ({t}) => {
  const error = useSelector(state => state.auth.error);

  const handleSubmitRequest = (event) => { alert('Clicked request');};

  const handleCancel = (event) => { alert('Clicked canel');}

  return (
    <div>
      <Row>
        <Col xl={5}>
          <Row>
            <Col xl={12}>
              <div className='d-flex justify-content-end'>
                <Button 
                  className="mb-3" 
                  onClick={() => console.log('AOI click')}
                >
                  AOI Location
                </Button>
              </div>
            </Col>
            <Col>
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
                      <h4>{t('Wildfire Simulation')}</h4>
                    </Row>
                    <Row>
                      <div>
                        <div>Title input</div>
                        <div>Probability range</div>
                        <div>Time limit input</div>
                        <div>Map selection</div>
                        <div>Date/time</div>
                        <div>Fire spotting</div>
                        <div>Boundary conditions</div>
                      </div>
                    </Row>
                  </Form>
                )}
              </Formik>
            </Col>
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