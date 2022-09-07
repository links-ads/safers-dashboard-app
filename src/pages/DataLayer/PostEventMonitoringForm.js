import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, FormGroup, Label, Row, Col, Card, Form } from 'reactstrap';
import { 
  area as getFeatureArea, 
  featureCollection 
} from '@turf/turf';
import wkt from 'wkt';
import { Formik } from 'formik';
import MapSection from './Map';
import * as Yup from 'yup'
import { getGeneralErrors, getError }  from '../../helpers/errorHelper';
import {
  postMapRequest,
  getAllMapRequests
} from '../../store/appAction';

import { withTranslation } from 'react-i18next'
import 'react-rangeslider/lib/index.css'

// Fifty thousand hectares = 500 km2 = 500 million m2
const MAX_GEOMETRY_AREA = {
  label: '50,000 hectares',
  value: 500000000
};

const MIN_START_DATE = {
  label: 'May 1st, 2018',
  date: '2018-05-01',
};
const MIN_END_DATE = '2018-05-02';

const postEventMonitoringSchema = Yup.object().shape({
  dataLayerType: Yup.array()
    .required('This field cannot be empty'),
  requestTitle: Yup.string().optional(),
  mapSelection: Yup.string()
    .required('This field cannot be empty'),
  mapSelectionArea: Yup.number()
    .typeError('Selected area must be valid Well-Known Text')
    .max(MAX_GEOMETRY_AREA.value, `Selected Area must be no greater than ${MAX_GEOMETRY_AREA.label}`),
  startDate: Yup.date()
    .typeError('Must be valid date selection')
    .required('This field cannot be empty')
    .min(
      MIN_START_DATE.date, 
      `Date must be at least ${MIN_START_DATE.label}`
    ),
  endDate: Yup.date()
    .min(
      MIN_END_DATE, 
      `Date must be greater than ${MIN_START_DATE.label}`
    )
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
        start: new Date(formData.startDate).toISOString(),
        end: new Date(formData.endDate).toISOString(),
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
              mapSelectionArea: null,
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
                              {t('dataLayerType')}
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
                              {t('mapSelection')}
                            </Label>
                            <Input
                              id="mapSelection"
                              name="mapSelection"
                              type="textarea"
                              rows="5"
                              className={errors.mapSelection ? 'is-invalid' : ''}
                              onChange={({ target: { value } }) => {
                                setFieldValue('mapSelection', value);

                                const { features } = featureCollection(
                                  wkt.parse(value)
                                );

                                if (features) {
                                  const area = getFeatureArea(features);
                                  setFieldValue('mapSelectionArea', Math.ceil(area));
                                }
                              }}
                              onBlur={handleBlur}
                              value={values.mapSelection}
                              placeholder='Enter Well Known Text or draw a polygon on the map'
                            />
                            {getError('mapSelection', errors, touched, false)}
                            {getError('mapSelectionArea', errors, touched, false)}
                          </FormGroup>
                        </Row>
                        <Row>
                          <FormGroup className='form-group'>
                            <Row>
                              <Col>
                                <Label for="startDate">
                                  {t('startDate')}
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
                                  {t('endDate')}
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
                          setCoordinates={(wktConversion, originalGeojson) => {
                            setFieldValue('mapSelection', wktConversion);

                            const area = getFeatureArea(originalGeojson);
                            console.log('area map: ', area);
                            if (area) {
                              setFieldValue('mapSelectionArea', Math.ceil(area));
                            }
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