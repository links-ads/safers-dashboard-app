import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Input, FormGroup, Label, Row, Col, Card, Form } from 'reactstrap';
import { Formik } from 'formik';
import moment from 'moment';
import MapSection from './Map';
import * as Yup from 'yup'
import { getGeneralErrors, getError }  from '../../helpers/errorHelper';
import { withTranslation } from 'react-i18next'
import 'react-rangeslider/lib/index.css'
import {
  postMapRequest,
  getAllMapRequests
} from '../../store/appAction';
import {
  area as getFeatureArea,
  featureCollection,
  bbox,
  bboxPolygon
} from '@turf/turf';
import wkt from 'wkt';

Yup.addMethod(Yup.date, 'max30Days', function (message) {
  return this.test(
    'max30Days',
    message,
    (date, { parent }) => {
      const startDate = parent.startDate;

      // if startDate not yet been entered, allow validation to pass
      if (startDate.toString() === 'Invalid Date') {
        return true;
      }

      const rangeCheck = moment(date).isBetween(
        startDate, 
        moment(startDate).add(30, 'days')
      )

      return rangeCheck;
    }
  )
})

const fireAndBurnedAreaSchema = Yup.object().shape({
  dataLayerType: Yup.array()
    .required('This field cannot be empty'),
  requestTitle: Yup.string().optional(),
  mapSelection: Yup.string()
    .required('This field cannot be empty'),
  startDate: Yup.date()
    .typeError('Must be valid date selection')
    .required('This field cannot be empty'),
  endDate: Yup.date()
    .typeError('Must be valid date selection')
    .required('This field cannot be empty')
    .max30Days('End date must be no greater than 30 days from start date'),
  frequency: Yup.number()
    .integer('This field must be an integer')
    .typeError('This field must be a number')
    .min(1, 'Should be at least 1')
    .optional(), 
  resolution: Yup.number()
    .typeError('This field must be a number')
    .min(10, 'Should be at least 10')
    .max(60, 'Should be at most 60')
    .optional('Should be between 10 and 60'), 
  isAreaValid: Yup.boolean().oneOf([true], 'Sorry, this would give too large an output. Reduce the spatial resolution or try a smaller area.')
});

const FireAndBurnedArea = ({ 
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
        frequency: formData.frequency || null,
        resolution: formData.resolution || null,
      },
    }

    dispatch(postMapRequest(payload));
    dispatch(getAllMapRequests())
    backToOnDemandPanel()
  }

  // hardcoded for now, this will be replaced with an API call in time
  const layerTypes = [
    {id: 36004, name:'Impact quantification'},
    {id: 36005, name:'Fire front and smoke'},
    {id: 36003, name:'Burned area geospatial image'},
    {id: 36002, name:'Burned area severity map'},
    {id: 36001, name:'Burned area delineation map'}
  ];

  const checkRasterSizeWithinLimits = (features, spatial_resolution) => {
    const MAX_RASTER_SIZE = 15000;

    if (features) {
      // get Bounding box as that's what affects raster size
      const bboxExtents = bbox(features);
      const bboxArea = getFeatureArea(bboxPolygon(bboxExtents));
      const maxValidArea = Math.pow(spatial_resolution * MAX_RASTER_SIZE,2.0);
      return bboxArea < maxValidArea;
    }
    return false;
  }

  return (
    <Row>
      <Col>
        <Row>
          <Formik
            initialValues={{ 
              dataLayerType: '', 
              requestTitle: '', 
              mapSelection: '', 
              isAreaValid: false,
              startDate: null, 
              endDate: null, 
              frequency: '',
              resolution: 10, 
            }}
            validationSchema={fireAndBurnedAreaSchema}
            onSubmit={onSubmit}
            id="fireAndBurnedAreaForm"
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              isSubmitting,
            }) => (
              <Form onSubmit={handleSubmit} className='d-flex flex-column justify-content-between'>
                <Row>
                  <Col xl={5} className='d-flex flex-column justify-content-between'>
                    <Row>
                      <Row>
                        <Col>
                          <h4>{t('requestMap')}</h4>
                        </Col>
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
                        <h5>{t('fireAndBurnedAreas')}</h5>
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
                              {t('selectLayerTypes')}
                            </option>
                            {layerTypes.map(item => (
                              <option key={`option_${item.name}`} value={item.id}>{`${item.id} - ${item.name}`}</option>
                            ))}
                          </Input>
                          {getError('dataLayerType', errors, touched)}
                        </FormGroup>
                      </Row> 
                      <Row>
                        <FormGroup className="form-group">
                          <Label for="requestTitle">
                            {t('requestTitle')}
                          </Label>
                          <Input 
                            name="requestTitle" 
                            id="requestTitle"
                            className={
                              errors.requestTitle ? 'is-invalid' : ''
                            }
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.requestTitle}
                            placeholder="[Type Request Title]"
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

                              if (!value) {
                                setFieldValue('isAreaValid', true);
                              } else {
                                const { features } = featureCollection(
                                  wkt.parse(value)
                                );
                                const areaIsValid = checkRasterSizeWithinLimits(features, values.resolution);

                                setFieldValue('isAreaValid', areaIsValid);
                              }
                            }}
                            onBlur={handleBlur}
                            value={values.mapSelection}
                            placeholder='Enter Well Known Text or draw a polygon on the map'
                          />
                          {getError('mapSelection', errors, touched, false)}
                          {getError('isAreaValid', errors, touched, false, true)}
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
                      <Row>
                        <FormGroup>
                          <Row className='d-flex align-items-baseline'>
                            <Col xl={3}>
                              <Label for="frequency" className='mb-0'>
                                {t('frequency')}
                              </Label>
                            </Col>
                            <Col xl={4}>
                              <Input
                                id="frequency"
                                name="frequency"
                                type="num"
                                className={
                                  errors.frequency ? 'is-invalid' : ''
                                }
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder='[type here]'
                                value={values.frequency}
                              />
                              {getError('frequency', errors, touched, false)}
                            </Col>
                            <Col xl={5} />
                          </Row>
                        </FormGroup>
                      </Row>
                      <Row>
                        <FormGroup>
                          <Row className='d-flex align-items-baseline'>
                            <Col xl={3}>
                              <Label for="resolution" className='mb-0'>
                                {t('resolution')}
                              </Label>
                            </Col>
                            <Col xl={4}>
                              <Input
                                id="resolution"
                                name="resolution"
                                type="num"
                                placeholder='10'
                                className={
                                  errors.resolution ? 'is-invalid' : ''
                                }
                                onChange={({ target: { value } }) => {
                                  const parsedValue = parseInt(value);

                                  setFieldValue('resolution', parsedValue);

                                  const areaIsValid = checkRasterSizeWithinLimits(values.mapSelection, parsedValue);

                                  setFieldValue('isAreaValid', areaIsValid);
                                }}
                                onBlur={handleBlur}
                                value={values.resolution}
                              />
                              {getError('resolution', errors, touched, false)}
                            </Col>
                            <Col xl={5} />
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
                        setCoordinates={(wktConversion, areaIsValid) => {
                          setFieldValue('mapSelection', wktConversion);
                          setFieldValue('isAreaValid', areaIsValid);
                        }}
                        coordinates={values.mapSelection}
                        togglePolygonMap={true}
                        handleAreaValidation={feature => {
                          const areaIsValid = checkRasterSizeWithinLimits(feature, values.resolution);

                          return areaIsValid;
                        }}
                      />
                    </Card>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </Row>
      </Col>
    </Row>
  );
}

FireAndBurnedArea.propTypes = {
  t: PropTypes.any,
  handleResetAOI: PropTypes.func,
  backToOnDemandPanel: PropTypes.func,
}

export default withTranslation(['dataLayers', 'common'])(FireAndBurnedArea);
