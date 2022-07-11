/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input, FormGroup, Label, Row, Col, Card, Form } from 'reactstrap';
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
  resolution: Yup.string()
    .required('The field cannot be empty'), 
});

const FireAndBurnedArea = ({ t }) => {
  console.log('t',t);

  const handleSubmitRequest = (event) => { alert('Clicked request');};
  const handleCancel = (event) => { alert('Clicked canel');}

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
                      <h5>{t('fireandburnedareas')}</h5>
                    </Row>
                    <Row>
                      <FormGroup className="form-group">
                        <Label for="datalayertype">
                          {t('datalayertype')}
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
                      </FormGroup>
                    </Row> 
                    <Row>
                      <FormGroup className="form-group">
                        <Label for="requesttitle">
                          {t('requesttitle')}
                        </Label>
                        <Input 
                          name="requesttitle" 
                          id="requesttitle"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.requesttitle}
                          placeholder="[type request title]"
                        />
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup className='form-group'>
                        <Label for="mapselection">
                          {t('mapselection')}
                        </Label>
                        <Input
                          id="mapselection"
                          name="mapselection"
                          type="textarea"
                          rows="5"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.mapselection}
                          placeholder='Enter a comma-separated list of vertices, or draw a polygon on the map. If you enter coordinates these should be in WSG84, longitude then latitude.'
                        />
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup className='form-group'>
                        <Row>
                          <Col>
                            <Label for="startdate">
                              {t('startdate')}
                            </Label>
                            <Input
                              id="startdate"
                              name="startdate"
                              type="date"
                              onChange={handleChange}
                              onBlur={handleBlur} 
                              value={values.startdate}
                            />
                          </Col>
                          <Col>
                            <Label for="enddate">
                              {t('enddate')}
                            </Label>
                            <Input
                              id="enddate"
                              name="enddate"
                              type="date"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.enddate}
                            />
                          </Col>
                        </Row>
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup>
                        <Row>
                          <Col>
                            <Label for="frequency">
                              {t('frequency')}
                            </Label>
                          </Col>
                          <Col>
                            <Input
                              id="frequency"
                              name="frequency"
                              type="num"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.frequency}
                            />
                          </Col>
                          <Col>
                            <p>Integers only, &#x2265;1</p>
                          </Col>
                        </Row>
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup>
                        <Row>
                          <Col>
                            <Label for="resolution">
                              {t('resolution')}
                            </Label>
                          </Col>
                          <Col>
                            <Input
                              id="resolution"
                              name="resolution"
                              type="num"
                              placeholder='10'
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.resolution}
                            />
                          </Col>
                          <Col>
                            <div>{t('resolutioninstructions')}</div>
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
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button
                          value={{}} 
                          onClick={handleCancel}
                          className='btn btn-secondary'
                          color="secondary"
                        >
                          {t('cancel')}
                        </Button>
                      </Col>
                      <Col></Col>
                      <Col></Col>
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
    </div>
  );
}

FireAndBurnedArea.propTypes = {
  t: PropTypes.any,
}

export default withTranslation(['dataLayers','common'])(FireAndBurnedArea);