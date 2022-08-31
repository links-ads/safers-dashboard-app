import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, FormGroup, Label, Row, Col, Card, Form } from 'reactstrap';
import { Formik } from 'formik';
import MapSection from './Map';
import * as Yup from 'yup'
import { getGeneralErrors, getError }  from '../../helpers/errorHelper';
import RequiredAsterisk from '../../components/required-asterisk'
import {
  postMapRequest,
  getAllMapRequests
} from '../../store/appAction';

import { withTranslation } from 'react-i18next'
import 'react-rangeslider/lib/index.css'

const postEventMonitoringSchema = Yup.object().shape({
  dataLayerType: Yup.array()
    .required('This field cannot be empty'),
  requestTitle: Yup.string().optional(),
  mapSelection: Yup.string()
    .required('This field cannot be empty'),
  startDate: Yup.date()
    .required('This field cannot be empty'),
  endDate: Yup.date()
    .required('This field cannot be empty'),
});

const PostEventMonitoring = ({
  t,
  handleResetAOI,
  backToOnDemandPanel,
}) => {
  const dispatch = useDispatch();
  const error = useSelector(state => state.auth.error);

  const onSubmit = (formData) => {
    const payload = {
      data_types: formData.dataLayerType,
      geometry: formData.mapSelection,
      title: formData.requestTitle,
      parameters: {
        start: `${formData.startDate}T00:00:00.000`,
        end: `${formData.endDate}T00:00:00.000`,
      },
    }
    
    dispatch(postMapRequest(payload));
    dispatch(getAllMapRequests());
    backToOnDemandPanel();
  }

  // hardcoded for now, this will be replaced with an API call in time
  const layerTypes = [
    {id: '37006', name: 'Generate vegetation recovery map'},
    {id: '37005', name: 'Generate historical severity map (dNBR)'},
    {id: '37004', name: 'Provide landslide susceptibility information'},
    {id: '37003', name: 'Generate soil recovery map (Vegetation Index)'},
    {id: '37002', name: 'Generate burn severity map (dNBR)'},
    {id: '32005', name: 'Get critical points of infrastructure, e.g. airports, motorways, hospitals, etc.'}
  ];

  return (
    <Row>
      <Col>
        <Row>
          <Formik
            initialValues={{ 
              dataLayerType: '', 
              requestTitle: '', 
              mapSelection: '', 
              startDate: null, 
              endDate: null, 
            }}
            validationSchema={postEventMonitoringSchema}
            onSubmit={onSubmit}
            id="fireAndBurnedAreaForm"
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
                  setFieldValue,
                  isSubmitting,
                }
              ) => (
                <Form onSubmit={handleSubmit} className='d-flex flex-column justify-content-between'>
                  <Row>
                    <Col xl={5} className='d-flex flex-column justify-content-between'>
                      <Row>
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
                          <h5>{t('postEventMonitoring')}</h5>
                        </Row>
                        <Row>
                          <FormGroup className="form-group">
                            <Label for="dataLayerType">
                              {t('dataLayerType')}<RequiredAsterisk />
                            </Label>
                            <Input 
                              name="dataLayerType"
                              id="dataLayerType"
                              type="select"
                              className={
                                errors.dataLayerType ? 'is-invalid' : ''
                              }
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.dataLayerType}
                              multiple
                            >
                              <option disabled value=''>
                      Select Data Layer Type(s)
                              </option>
                              {layerTypes.map(item => (
                                <option key={`option_${item.name}`} value={item.id}>{`${item.id} - ${item.name}`}</option>
                              ))}
                            </Input>
                            {getError('dataLayerType', errors, touched, false)}
                          </FormGroup>
                        </Row> 
                        <Row>
                          <FormGroup className="form-group">
                            <Label for="requesTitle">
                              {t('requestTitle')}
                            </Label>
                            <Input 
                              name="requestTitle" 
                              id="requestTitle"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.requestTitle}
                              placeholder="[type request title]"
                            />
                            {getError('requestTitle', errors, touched, false)}
                          </FormGroup>
                        </Row>
                        <Row>
                          <FormGroup className='form-group'>
                            <Label for="mapSelection">
                              {t('mapSelection')}<RequiredAsterisk />
                            </Label>
                            <Input
                              id="mapSelection"
                              name="mapSelection"
                              type="textarea"
                              rows="5"
                              className={errors.mapSelection ? 'is-invalid' : ''}
                              onChange={({ target: { value } })=>{
                                setFieldValue('mapSelection', value)
                              }}
                              onBlur={handleBlur}
                              value={values.mapSelection}
                              placeholder='Enter Well Known Text or draw a polygon on the map'
                            />
                            {getError('mapSelection', errors, touched, false)}
                          </FormGroup>
                        </Row>
                        <Row>
                          <FormGroup className='form-group'>
                            <Row>
                              <Col>
                                <Label for="startDate">
                                  {t('startDate')}<RequiredAsterisk />
                                </Label>
                                <Input
                                  id="startDate"
                                  name="startDate"
                                  type="date"
                                  className={
                                    errors.startDate ? 'is-invalid' : ''
                                  }
                                  onChange={handleChange}
                                  onBlur={handleBlur} 
                                  value={values.startDate}
                                />
                                {getError('startDate', errors, touched, false)}
                              </Col>
                              <Col>
                                <Label for="endDate">
                                  {t('endDate')}<RequiredAsterisk />
                                </Label>
                                <Input
                                  id="endDate"
                                  name="endDate"
                                  type="date"
                                  className={
                                    errors.endDate ? 'is-invalid' : ''
                                  }
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.endDate}
                                />
                                {getError('endDate', errors, touched, false)}
                              </Col>
                            </Row>
                          </FormGroup>
                        </Row>
                      </Row>
                      <Row>
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
                              onClick={backToOnDemandPanel}
                              className='btn btn-secondary ms-3'
                              color="secondary"
                            >
                              {t('cancel')}
                            </Button>
                          </Col>
                        </Row>
                      </Row>
                    </Col>
                    <Col xl={7} className='mx-auto'>
                      <Card className='map-card mb-0' style={{ height: 670 }}>
                        <MapSection 
                          setCoordinates={value => {
                            setFieldValue('mapSelection', value)
                          }}
                          coordinates={values.mapSelection}
                          togglePolygonMap={true}
                        />
                      </Card>
                    </Col>
                  </Row>
                </Form>
              )
            }
          </Formik>
        </Row>
      </Col>
    </Row>
  );
}

PostEventMonitoring.propTypes = {
  t: PropTypes.any,
  handleResetAOI: PropTypes.func,
  backToOnDemandPanel: PropTypes.func,

}

export default withTranslation(['dataLayers','common'])(PostEventMonitoring);