import React, { useEffect, useState } from 'react';

import { Formik } from 'formik';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Button, Row, Col, Label, FormGroup, Form } from 'reactstrap';
import toastr from 'toastr';
import * as Yup from 'yup';

import { getTeamList } from 'store/appAction';

import MapInput from '../../../../components/BaseMap/MapInput';
import DateRangePicker from '../../../../components/DateRangePicker/DateRange';
import { getError } from '../../../../helpers/errorHelper';
import {
  createMission,
  resetMissionResponseState,
} from '../../../../store/missions/action';
import 'toastr/build/toastr.min.css';
import { getWKTfromFeature, getGeoFeatures } from '../../../../store/utility';

const CreateMission = ({ t, onCancel, coordinates, setCoordinates }) => {
  const dispatch = useDispatch();

  const { orgList = [] } = useSelector(state => state.common);
  const { info: user } = useSelector(state => state.user);
  const { missionCreated } = useSelector(state => state.missions);
  const { teamList } = useSelector(state => state.common);

  const [orgName, setorgName] = useState('--');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [chatbotUserId, setChatbotUserId] = useState();

  const [dateRange, setDateRange] = useState(null);
  const [desc, setDesc] = useState(null);
  const [validCoords, isValidCoordFormat] = useState(false);

  useEffect(() => {
    dispatch(getTeamList());
  }, [dispatch]);

  useEffect(() => {
    if (orgList.length && user?.organization) {
      const organization = _.find(orgList, { id: user.organization });
      setorgName(organization.name.split('-')[0]);
    }
  }, [orgList, user]);

  useEffect(() => {
    if (missionCreated) {
      toastr.success(missionCreated.msg, '');
      onCancel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missionCreated]);

  //Clear success states on component unmount
  useEffect(() => {
    return () => {
      dispatch(resetMissionResponseState());
    };
  }, [dispatch]);

  const createMissionSchema = Yup.object().shape({
    coordinates: Yup.array().required(),
    dateRange: Yup.array().of(Yup.string()).required(),
    desc: Yup.string().required(),
    title: Yup.string().required(),
  });

  const onSubmit = ({ title }) => {
    console.log('SUBMISSION: ', title);

    // TODO: this needed? Check other forms
    // dates.map(date => moment(date).toISOString());

    const payload = {
      title,
      description: desc,
      start: dateRange[0] ?? null,
      end: dateRange[1] ?? null,
      source: 'Chatbot',
      geometry: coordinates ? getWKTfromFeature(coordinates) : null,
      coordinatorTeamId: selectedTeam?.id,
      coordinatorPersonId: chatbotUserId ? parseInt(chatbotUserId) : null,
    };

    dispatch(createMission(payload));
  };

  return (
    <Formik
      initialValues={{
        coordinates: [],
        dateRange: [],
        desc: '',
        title: '',
      }}
      validationSchema={createMissionSchema}
      onSubmit={onSubmit}
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
      }) => {
        console.log('VALUES: ', values);
        const isSubmitDisabled = !!Object.keys(errors).length;
        return (
          <Form onSubmit={handleSubmit} noValidate>
            <FormGroup className="form-group">
              <Input
                id="title"
                name="title"
                placeholder={t('mission-title', { ns: 'chatBot' })}
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.title ?? ''}
              />
              {getError('title', errors, errors, false)}
            </FormGroup>

            <FormGroup className="form-group mt-3">
              <DateRangePicker
                placeholder={`${t('Start', { ns: 'common' })} ${t('Date', {
                  ns: 'common',
                })} | ${t('End', { ns: 'common' })} ${t('Date', {
                  ns: 'common',
                })}`}
                defaultDateRange={dateRange}
                isTimeEnabled={true}
                onChange={dateRange => setFieldValue('dateRange', dateRange)}
              />
              {getError('dateRange', errors, errors, false)}
            </FormGroup>

            <FormGroup className="form-group mt-3">
              <MapInput
                id="coordinates"
                name="coordinates"
                className={`${getError('coordinates', errors, errors)}`}
                type="textarea"
                placeholder={t('Map Selection', { ns: 'chatBot' })}
                rows="10"
                coordinates={getWKTfromFeature(coordinates)}
                setCoordinates={wkt => {
                  const geojson = getGeoFeatures(wkt);
                  setFieldValue('coordinates', geojson);
                  setCoordinates(geojson);
                }}
                isValidFormat={isValidCoordFormat}
                onBlur={handleBlur}
              />
              {getError('coordinates', errors, errors, false)}
            </FormGroup>

            <div className="mt-3">
              <Label className="fw-bold" htmlFor="target">
                {t('assign-to')}:{' '}
              </Label>
              <Row>
                <Col>
                  <Label className="form-label mt-3 mb-0">
                    {t('organisation')}: {orgName}
                  </Label>
                </Col>
                <Col>
                  <Input
                    id="team"
                    className="btn-sm sort-select-input"
                    name="team"
                    type="select"
                    onChange={e => {
                      const selectedTeam = teamList?.find(
                        team => team.id === Number(e.target.value),
                      );
                      setSelectedTeam(selectedTeam);
                    }}
                    value={selectedTeam?.id ?? ''}
                  >
                    <option value={''}>--{t('team')}--</option>
                    {teamList?.map(team => {
                      return (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      );
                    })}
                  </Input>
                </Col>
                <Col>
                  <Input
                    id="chatbotUser"
                    className="btn-sm sort-select-input"
                    name="chatbotUser"
                    type="select"
                    disabled={!selectedTeam?.id}
                    onChange={handleChange}
                    value={chatbotUserId}
                  >
                    <option value={''}>--{t('chatbot-user')}--</option>
                    {selectedTeam?.members.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </Input>
                </Col>
              </Row>
            </div>

            <FormGroup className="form-group mt-3">
              <Input
                id="desc"
                type="textarea"
                name="desc"
                placeholder={t('mission-desc', { ns: 'chatBot' })}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.desc ?? ''}
                rows="10"
              />
              {getError('desc', errors, errors, false)}
            </FormGroup>

            <div className="mt-3">
              <Button type="button" onClick={onCancel}>
                {t('cancel')}
              </Button>
              <Button
                type="submit"
                className="mx-3"
                disabled={isSubmitDisabled}
              >
                {t('send')}
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

CreateMission.propTypes = {
  coordinates: PropTypes.any,
  onCancel: PropTypes.func,
  t: PropTypes.any,
  setCoordinates: PropTypes.func,
};

export default withTranslation(['common'])(CreateMission);
