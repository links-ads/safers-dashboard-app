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

import MapInput from 'components/BaseMap/MapInput';
import DateRangePicker from 'components/DateRangePicker/DateRange';
import { getError } from 'helpers/errorHelper';
import {
  fetchTeams,
  organisationsSelector,
  teamsSelector,
} from 'store/common/common.slice';
import {
  createMission,
  resetMissionResponseState,
  missionCreatedSelector,
} from 'store/missions/missions.slice';
import 'toastr/build/toastr.min.css';
import { getGeoFeatures, getWKTfromFeature } from 'store/utility';

const FORM_INITIAL_STATE = {
  coordinates: '',
  dateRange: [],
  teamId: '',
  personId: '',
  desc: '',
  title: '',
};

const CreateMission = ({ t, onCancel, coordinates, setCoordinates }) => {
  const dispatch = useDispatch();

  const orgList = useSelector(organisationsSelector);
  const { info: user } = useSelector(state => state.user);
  const missionCreated = useSelector(missionCreatedSelector);
  const teamList = useSelector(teamsSelector);

  const [orgName, setorgName] = useState('--');
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    dispatch(fetchTeams());
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
    coordinates: Yup.string().required(t('field-empty-err', { ns: 'common' })),
    dateRange: Yup.array()
      .of(Yup.date())
      .min(2, t('field-empty-err', { ns: 'common' })),
    teamId: Yup.string().optional(),
    personId: Yup.string().optional(),
    desc: Yup.string().required(t('field-empty-err', { ns: 'common' })),
    title: Yup.string().required(t('field-empty-err', { ns: 'common' })),
  });

  const onSubmit = ({
    coordinates,
    dateRange,
    desc,
    personId,
    teamId,
    title,
  }) => {
    const dates = dateRange.map(date => moment(date).toISOString());

    const payload = {
      title,
      description: desc,
      start: dates[0] ?? null,
      end: dates[1] ?? null,
      source: 'Chatbot',
      geometry: coordinates,
      coordinatorTeamId: teamId ? parseInt(teamId) : null,
      coordinatorPersonId: personId ? parseInt(personId) : null,
    };

    dispatch(createMission(payload));
  };

  return (
    <Formik
      initialValues={FORM_INITIAL_STATE}
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
      }) => (
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
            {getError('title', errors, touched, false)}
          </FormGroup>

          <FormGroup className="form-group mt-3">
            <DateRangePicker
              placeholder={`${t('Start', { ns: 'common' })} ${t('Date', {
                ns: 'common',
              })} | ${t('End', { ns: 'common' })} ${t('Date', {
                ns: 'common',
              })}`}
              isTimeEnabled={true}
              onChange={dateRange => setFieldValue('dateRange', dateRange)}
            />
            {getError('dateRange', errors, touched, false)}
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
              setCoordinates={wkt => setCoordinates(getGeoFeatures(wkt))}
              handleChange={handleChange}
              onBlur={handleBlur}
            />
            {getError('coordinates', errors, touched, false)}
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
                  id="teamId"
                  className="btn-sm sort-select-input"
                  name="teamId"
                  type="select"
                  onChange={({ target: { value } }) => {
                    const selectedTeam = teamList?.find(
                      team => team.id === Number(value),
                    );
                    setFieldValue('teamId', value);
                    setSelectedTeam(selectedTeam);
                  }}
                  value={values.teamId}
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
                {getError('teamId', errors, touched, false)}
              </Col>
              <Col>
                <Input
                  id="chatbotUser"
                  className="btn-sm sort-select-input"
                  name="chatbotUser"
                  type="select"
                  disabled={!selectedTeam?.id}
                  onChange={({ target: { value } }) =>
                    setFieldValue('personId', value)
                  }
                  value={values.personId}
                >
                  <option value={''}>--{t('chatbot-user')}--</option>
                  {selectedTeam?.members.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </Input>
                {getError('personId', errors, touched, false)}
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
            {getError('desc', errors, touched, false)}
          </FormGroup>

          <div className="mt-3">
            <Button type="button" onClick={onCancel}>
              {t('cancel')}
            </Button>
            <Button type="submit" className="mx-3">
              {t('send')}
            </Button>
          </div>
        </Form>
      )}
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
