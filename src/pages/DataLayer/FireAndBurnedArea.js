/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { Input, FormGroup, Label, Row, Col, Card, Form } from 'reactstrap';
import { Formik } from 'formik';
import BaseMap from '../../components/BaseMap/BaseMap';
import * as Yup from 'yup'

//i18n
import { withTranslation } from 'react-i18next'
import 'react-rangeslider/lib/index.css'

const fireAndBurnedAreaSchema = Yup.object().shape({
  datalayertype: Yup.string()
    .required('The field cannot be empty'),
  requesttitle: Yup.string()
    .required('The field cannot be empty'),
  mapselection: Yup.string()
    .required('The field cannot be empty'),
  startdate: Yup.string()
    .required('The field cannot be empty'),
  enddate: Yup.string()
    .required('The field cannot be empty'), 
  frequency: Yup.string()
    .required('The field cannot be empty'), 
  spatialresolution: Yup.string()
    .required('The field cannot be empty'), 
});

const FireAndBurnedArea = ({ t }) => {
  console.log('t',t);
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
                spatialresolution: null, 
              }}
              validationSchema={fireAndBurnedAreaSchema}
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
                      <FormGroup className="form-group">
                        <Label for="datalayertype">
                          Layer type:
                        </Label>
                        <Input 
                          name="datalayertype"
                          id="datalayertype"
                          type="select"
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
                      </FormGroup>
                    </Row> 
                    <Row>
                      <FormGroup className="form-group">
                        <Label for="requesttitle">
                          Request Title:
                        </Label>
                        <Input 
                          name="requesttitle" 
                          id="requesttitle"
                          placeholder="[type request title]"
                        />
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup className='form-group'>
                        <Label for="mapselection">
                          Map Selection
                        </Label>
                        <Input
                          id="mapselection"
                          name="mapselection"
                          type="textarea"
                          rows="5"
                          placeholder='Enter a comma-separated list of vertices, or draw a polygon on the map. If you enter coordinates these should be in WSG84, longitude then latitude.'
                        />
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup className='form-group'>
                        <Row>
                          <Col>
                            <Label for="startdate">
                            Start Date
                            </Label>
                            <Input
                              id="startdate"
                              name="startdate"
                              type="date"
                            />
                          </Col>
                          <Col>
                            <Label for="enddate">
                            End Date
                            </Label>
                            <Input
                              id="enddate"
                              name="enddate"
                              type="date"
                            />
                          </Col>
                        </Row>
                      </FormGroup>
                    </Row>
                  </Form>
                )
              }

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
    </div >
  );
}

FireAndBurnedArea.propTypes = {
  t: PropTypes.any,
}

export default withTranslation(['common'])(FireAndBurnedArea);