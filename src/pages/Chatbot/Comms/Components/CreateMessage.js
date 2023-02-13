import React, { useEffect, useState } from 'react';

import { Formik } from 'formik';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Button, Label, Row, Col, FormGroup, Form } from 'reactstrap';
import toastr from 'toastr';
import * as Yup from 'yup';

import { getWKTfromFeature, getGeoFeatures } from 'store/utility';

import MapInput from '../../../../components/BaseMap/MapInput';
import DateRangePicker from '../../../../components/DateRangePicker/DateRange';
import { getError } from '../../../../helpers/errorHelper';
import {
  createMsg,
  resetCommsResponseState,
} from '../../../../store/comms/action';
import 'toastr/build/toastr.min.css';

const CreateMessage = ({ coordinates, onCancel, setCoordinates }) => {
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const messageSchema = Yup.object().shape({
    dateRange: Yup.array()
      .of(Yup.date())
      .required(t('field-empty-err', { ns: 'common' })),
    coordinates: Yup.string().required(t('field-empty-err', { ns: 'common' })),
    scope: Yup.string().required(t('field-empty-err', { ns: 'common' })),
    restriction: Yup.string().when('scope', {
      is: 'Restricted',
      then: Yup.string().required(
        t('Restriction needed if scope is restricted', { ns: 'common' }),
      ),
    }),
    description: Yup.string().required(t('field-empty-err', { ns: 'common' })),
  });

  const { orgList = [] } = useSelector(state => state.common);
  const { info: user } = useSelector(state => state.user);
  const { msgCreated } = useSelector(state => state.comms);

  const [orgName, setorgName] = useState('');
  const [, setScope] = useState('');
  const [, setDateRange] = useState(null);
  const [, setDesc] = useState(null);
  const [, setRestriction] = useState(undefined);
  const [, isValidCoordFormat] = useState(false);

  const resetState = () => {
    setScope('');
    setDateRange(null);
    setCoordinates([]);
    setScope('');
    setDesc(null);
    setRestriction(undefined);
  };

  useEffect(() => {
    if (orgList.length && user?.organization) {
      const organization = _.find(orgList, { id: user.organization });
      setorgName(organization.name.split('-')[0]);
    }
  }, [orgList, user]);

  useEffect(() => {
    if (msgCreated) {
      toastr.success(msgCreated.msg, '');
      resetState();
      onCancel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msgCreated]);

  //Clear success states on component unmount
  useEffect(() => {
    return () => {
      dispatch(resetCommsResponseState());
    };
  }, [dispatch]);

  const handleDateRangePicker = dates => {
    setDateRange(dates.map(date => moment(date).format('YYYY-MM-DD')));
  };

  const submitMsg = ({
    description,
    dateRange,
    scope,
    restriction,
    coordinates,
  }) => {
    const payload = {
      message: description,
      start: dateRange[0] ? dateRange[0] : null,
      end: dateRange[1] ? dateRange[1] : null,
      scope,
      restriction,
      geometry: coordinates,
    };
    dispatch(createMsg(payload));
  };

  return (
    <Formik
      initialValues={{
        dateRange: '',
        coordinates: [],
        scope: '',
        restriction: '',
        description: '',
      }}
      validationSchema={messageSchema}
      onSubmit={submitMsg}
      id="messageForm"
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
      }) => {
        return (
          <Form onSubmit={handleSubmit} noValidate>
            <FormGroup className="form-group mt-3">
              <DateRangePicker
                name="dateRange"
                type="text"
                placeholder={`${t('Start', { ns: 'common' })} ${t('Date', {
                  ns: 'common',
                })} | ${t('End', { ns: 'common' })} ${t('Date', {
                  ns: 'common',
                })}`}
                className={`${getError('dateRange', errors, errors)}`}
                setDates={handleDateRangePicker}
                isTooltipInput={true}
                showIcons={true}
                onBlur={handleBlur}
                onChange={value => setFieldValue('dateRange', value)}
                value={values.dateRange}
              />
              {getError('dateRange', errors, errors, false)}
            </FormGroup>
            <FormGroup className="form-group mt-3">
              <MapInput
                id="coordinates"
                className={`${getError('coordinates', errors, errors)}`}
                type="textarea"
                name="coordinates"
                placeholder={t('Map Selection', { ns: 'chatBot' })}
                rows="10"
                coordinates={getWKTfromFeature(coordinates)}
                setCoordinates={wkt => {
                  const geojson = getGeoFeatures(wkt);
                  setCoordinates(geojson);
                }}
                isValidFormat={isValidCoordFormat}
                onBlur={handleBlur}
                handleChange={handleChange}
                value={values.coordinates}
              />
              {getError('coordinates', errors, touched, false)}
            </FormGroup>
            <Label className="form-label mt-3 mb-0">
              {t('organisation', { ns: 'common' })}: {orgName}
            </Label>
            <Row className="my-3">
              <Col xl={1} md={2}>
                <Label htmlFor="target">
                  {t('target', { ns: 'common' })}:{' '}
                </Label>
              </Col>
              <Col xl={5} className="pe-xl-0 text-center">
                <Input
                  id="scope"
                  className={`btn-sm sort-select-input me-2 mb-2 ${getError(
                    'scope',
                    errors,
                    errors,
                  )}`}
                  name="scope"
                  type="select"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.scope}
                >
                  <option value="">--{t('scope', { ns: 'common' })}--</option>
                  <option value="Public">
                    {t('public', { ns: 'common' })}
                  </option>
                  <option value="Restricted">
                    {t('restricted', { ns: 'common' })}
                  </option>
                </Input>
                {getError('scope', errors, touched, false)}
              </Col>
              {values.scope === 'Restricted' ? (
                <Col xl={5}>
                  <Input
                    id="restriction"
                    className={`btn-sm sort-select-input ${getError(
                      'restriction',
                      errors,
                      errors,
                    )}`}
                    name="restriction"
                    type="select"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.restriction}
                  >
                    <option value="">--{t('Restrictions')}--</option>
                    <option value="Citizen">{t('Citizen')}</option>
                    <option value="Professional">{t('Professional')}</option>
                    <option value="Organization">{t('Organisation')}</option>
                  </Input>
                  {getError('restriction', errors, touched, false)}
                </Col>
              ) : null}
            </Row>
            <FormGroup className="form-group mt-3">
              <Input
                id="description"
                className={`${getError('desc', errors, errors)}`}
                type="textarea"
                name="description"
                placeholder={t('msg-desc', { ns: 'chatBot' })}
                onChange={e => {
                  handleChange(e);
                }}
                onBlur={handleBlur}
                rows="10"
                value={values.description}
              />
              {getError('description', errors, touched, false)}
            </FormGroup>
            <div className="mt-3">
              <Button type="button" onClick={onCancel}>
                {t('cancel', { ns: 'common' })}
              </Button>
              <Button
                type="submit"
                onClick={() => submitMsg(values)}
                className="mx-3"
                disabled={Object.keys(errors).length > 0}
              >
                {t('send', { ns: 'common' })}
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

CreateMessage.propTypes = {
  coordinates: PropTypes.any,
  onCancel: PropTypes.func,
  setCoordinates: PropTypes.func,
};

export default CreateMessage;
