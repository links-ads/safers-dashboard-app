import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Input, FormGroup, Label, Row, Col, Card, Form } from 'reactstrap';
import { Formik } from 'formik';
import MapSection from './Map';
import * as Yup from 'yup'
import { getGeneralErrors, getError }  from '../../helpers/errorHelper';
import { getBoundingBox } from '../../helpers/mapHelper';
import RequiredAsterisk from '../../components/required-asterisk'
import { withTranslation } from 'react-i18next'
import 'react-rangeslider/lib/index.css'
import { DATA_LAYERS_PANELS } from './constants';
import {
  getMapRequests,
  getAllMapRequests,
  setNewOnDemandState
} from '../../store/appAction';
//import { formatDefaultDate } from '../../store/utility';

const fireAndBurnedAreaSchema = Yup.object().shape({
  datalayertype: Yup.array()
    .required('This field cannot be empty'),
  requestTitle: Yup.string().optional(),
  mapSelection: Yup.string()
    .required('This field cannot be empty'),
  startDate: Yup.date()
    .required('This field cannot be empty'),
  endDate: Yup.date()
    .required('This field cannot be empty'), 
  frequency: Yup.number().min(1).optional('Should be >=1'), 
  resolution: Yup.number().min(10).max(60)
    .optional('Should be between 10 and 60'), 
});

const FireAndBurnedArea = ({ 
  t, 
  setActiveTab,
  handleResetAOI,
  viewState,
}) => {

  const dispatch = useDispatch();

  const error = useSelector(state => state.auth.error);
  //const mapRequest = useSelector(state => state.dataLayer.mapRequest);

  //const [iconLayer, setIconLayer] = useState(undefined);
  const [midPoint, setMidPoint] = useState([]);
  const [, setBoundingBox] = useState(undefined);
  const [currentZoomLevel, setCurrentZoomLevel] = useState(undefined);
  const [newWidth, setNewWidth] = useState(600);
  const [newHeight, setNewHeight] = useState(600);
  const [coordinates, setCoordinates] = useState('');
  //const [maprequest, setMapRequest] = useState({});


  const shapeFormData = (formData) => {
    return({
      title: formData.requestTitle,
      parameters: {
        start: `${formData.startDate}T00:00:00.000`,
        end: `${formData.endDate}T00:00:00.000`,
        frequency: formData.frequency,
        resolution: formData.resolution,
      },
      data_types: formData.dataLayerType,
      geometry: formData.wkt,
    });
  };

  const submitMe = (formData) => {
    const shapedData = shapeFormData(formData);
    console.log('shapedData', shapedData);
    dispatch(getMapRequests(shapedData));
    dispatch(setNewOnDemandState(true,true));
    dispatch(getAllMapRequests())
  }

  const getReportsByArea = () => {
    setBoundingBox(getBoundingBox(midPoint, currentZoomLevel, newWidth, newHeight));
  }

  const handleViewStateChange = ({ viewState }) => {
    if (viewState) {
      setMidPoint([viewState.longitude, viewState.latitude]);
      setCurrentZoomLevel(viewState.zoom);
    }
  };

  // TODO:  hard wired for now, this will be replaced with an API call in time
  const layerTypes = [
    {id: 36004, name:'Impact quantification'},
    {id: 36005, name:'Fire front and smoke'},
    {id: 36003, name:'Burned area geospatial image'},
    {id: 36002, name:'Burned area severity map'},
    {id: 36001, name:'Burned area delineation map'}
  ];

  return (
    <Row>
      <Col xl={5} className='d-flex flex-column justify-content-between'>
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
        <Row className='h-100'>
          <Formik
            initialValues={{ 
              dataLayerType: '', 
              requestTitle: '', 
              mapSelection: '', 
              startDate: null, 
              endDate: null, 
              frequency: null,
              resolution: null, 
            }}
            validationSchema={fireAndBurnedAreaSchema}
            onSubmit={(values, { setSubmitting }) => {
              console.log('values', values);
              setSubmitting(false);
            }}
            id="fireAndBurnedAreaForm"
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
              <Form onSubmit={handleSubmit} noValidate className='d-flex flex-column justify-content-between'>
                <Row>
                  {getGeneralErrors(error)}
                </Row>
                <Row>
                  <h5>{t('fireAndBurnedAreas')}</h5>
                </Row>
                <Row>
                  <FormGroup className="form-group">
                    <Label for="dataLayerType">
                      {t('datalayertype')}<RequiredAsterisk />
                    </Label>
                    <Input 
                      name="dataLayerType"
                      id="dataLayerType"
                      type="select"
                      className={getError('dataLayerType',errors,touched)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.dataLayerType}
                      multiple
                    >
                      <option disabled value=''>
                        {t('selectlayertypes')}
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
                      className={getError('requestTitle',errors,touched)}
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
                    {coordinates && coordinates.length>0 ? '' : getError('mapSelection', errors, touched, false)}
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
                          className={getError('startDate',errors,touched)}
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
                          className={getError('endDate',errors,touched)}
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
                      <Col>
                        <Label for="frequency" className='mb-0'>
                          {t('frequency')}
                        </Label>
                      </Col>
                      <Col>
                        <Input
                          id="frequency"
                          name="frequency"
                          type="num"
                          className={getError('frequency',errors,touched)}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder='[type here]'
                          value={values.frequency}
                        />
                        {getError('frequency', errors, touched, false)}
                      </Col>
                      <Col>
                        {t('frequencyInstructions')}
                      </Col>
                    </Row>
                  </FormGroup>
                </Row>
                <Row>
                  <FormGroup>
                    <Row className='d-flex align-items-baseline'>
                      <Col>
                        <Label for="resolution" className='mb-0'>
                          {t('resolution')}
                        </Label>
                      </Col>
                      <Col>
                        <Input
                          id="resolution"
                          name="resolution"
                          type="num"
                          placeholder='10'
                          className={getError('resolution',errors,touched)}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.resolution ?? 10}
                        />
                        {getError('resolution', errors, touched, false)}
                      </Col>
                      <Col>
                        <div>{t('resolutionInstructions')}</div>
                      </Col>
                    </Row>
                  </FormGroup>
                </Row>
                <Row>
                  <Col>
                    <Button 
                      type="submit"
                      onClick={()=>{
                        submitMe({...values, wkt:coordinates});
                        setActiveTab(DATA_LAYERS_PANELS.onDemandMapLayers);
                      }
                      }
                      disabled={isSubmitting}
                      className='btn btn-primary'
                      color="primary"
                    >
                      {t('request')}
                    </Button>
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
            )
            }
          </Formik>
        </Row>
      </Col>
      <Col xl={7} className='mx-auto'>
        <Card className='map-card mb-0' style={{ height: 670 }}>
          <MapSection
            viewState={viewState}
            //iconLayer={}
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
  );
}

FireAndBurnedArea.propTypes = {
  t: PropTypes.any,
  setActiveTab: PropTypes.function,
  handleResetAOI: PropTypes.function,
  viewState: PropTypes.object
}

// TODO: multiple translation files does not work
export default withTranslation(['dataLayers', 'common'])(FireAndBurnedArea);
