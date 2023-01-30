import React, { useState, useEffect } from 'react';

import { Formik } from 'formik';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Row,
} from 'reactstrap';
import toastr from 'toastr';
import * as Yup from 'yup';

import { endpoints } from '../../api/endpoints';
import { BASE_URL } from '../../config';
import { getGeneralErrors, getError } from '../../helpers/errorHelper';
import {
  passwordHelper,
  pwdRegEx,
  pwdValidationTxt,
} from '../../helpers/passwordHelper';
import {
  signUpOauth2 as registration,
  getOrgList,
  getRoleList,
} from '../../store/appAction';

const SignUp = () => {
  const navigate = useNavigate();

  const [passwordToggle, setPasswordToggle] = useState(false);
  const orgList = useSelector(state => state.common.orgList);
  const roles = useSelector(state => state.common.roleList);
  const error = useSelector(state => state.auth.error);
  const [citizenId, setcitizenId] = useState('');
  const docTNM = BASE_URL + endpoints.common.termsNconditions;
  const docPP = BASE_URL + endpoints.common.privacyPolicy;
  const signUpOauth2Success = useSelector(
    state => state.auth.signUpOauth2Success,
  );
  const config = useSelector(state => state.common.config);

  if (error) {
    window.scrollTo(0, 0);
  }

  // const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (roles.length === 0) dispatch(getOrgList());
    if (orgList.length === 0) dispatch(getRoleList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (roles.length) {
      const role = _.find(roles, { name: 'citizen' });
      setcitizenId(role.name);
    }
  }, [roles]);

  useEffect(() => {
    if (signUpOauth2Success) {
      navigate('/auth/sign-in');
      toastr.success(
        'Successfully signed up.  Please sign in via SSO now.',
        '',
      );
    }
  }, [navigate, signUpOauth2Success]);

  const signUpSchema = Yup.object()
    .shape({
      email: Yup.string()
        .email('Invalid email address')
        .required('The field cannot be empty'),
      password: Yup.string()
        .matches(pwdRegEx, pwdValidationTxt)
        .required('The field cannot be empty'),
      first_name: Yup.string().required('The field cannot be empty'),
      last_name: Yup.string().required('The field cannot be empty'),
      role: Yup.string().required('The field cannot be empty'),
      accepted_terms: Yup.bool().oneOf(
        [true],
        'Please accept the terms and conditions',
      ),
    })
    .when((values, schema) => {
      if (values.role !== citizenId) {
        return schema.shape({
          organization: Yup.string().required('The field cannot be empty'),
        });
      }
    });

  const formSubmit = (values, setSubmitting) => {
    values.organization =
      values.role === citizenId ? null : values.organization;
    dispatch(registration(values));
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        role: '',
        organization: '',
        accepted_terms: false,
      }}
      enableReinitialize={true}
      validationSchema={signUpSchema}
      onSubmit={(values, { setSubmitting }) => {
        formSubmit(values, setSubmitting);
      }}
      data-test="signUpComponent"
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
        <div className="jumbotron">
          {getGeneralErrors(error)}
          <div className="container auth-form">
            <Form onSubmit={handleSubmit} noValidate>
              {config?.allow_signup ? (
                <>
                  <Row form>
                    <Col>
                      <FormGroup className="form-group">
                        <Label for="userEmail">EMAIL ADDRESS:</Label>
                        <Input
                          id="userEmail"
                          className={getError('email', errors, touched)}
                          name="email"
                          placeholder="email address"
                          type="email"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.email}
                          autoComplete="on"
                          data-testid="sign-up-email"
                        />
                        {getError('email', errors, touched, false)}
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup className="form-group">
                        <Label for="first_name">FIRST NAME:</Label>
                        <Input
                          id="first_name"
                          className={getError('first_name', errors, touched)}
                          name="first_name"
                          data-testid="sign-up-firstName"
                          placeholder="first name"
                          type="text"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.first_name}
                          autoComplete="on"
                        />
                        {getError('first_name', errors, touched, false)}
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup className="form-group">
                        <Label for="last_name">LAST NAME:</Label>
                        <Input
                          id="last_name"
                          className={getError('last_name', errors, touched)}
                          name="last_name"
                          placeholder="last name"
                          type="text"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.last_name}
                          autoComplete="on"
                          data-testid="sign-up-lastName"
                        />
                        {getError('last_name', errors, touched, false)}
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup className="form-group">
                        <Label for="userPassword">PASSWORD:</Label>
                        <InputGroup>
                          <Input
                            id="userPassword"
                            className={getError('password', errors, touched)}
                            name="password"
                            placeholder="password"
                            type={passwordToggle ? 'text' : 'password'}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                            autoComplete="on"
                            data-testid="sign-up-password"
                          />
                          <InputGroupText>
                            <i
                              data-testid="sign-up-password-toggle"
                              onClick={() => {
                                setPasswordToggle(!passwordToggle);
                              }}
                              className={`fa ${
                                passwordToggle ? 'fa-eye-slash' : 'fa-eye'
                              }`}
                            />
                          </InputGroupText>
                        </InputGroup>
                        {values.password && (
                          <>{passwordHelper(values.password)}</>
                        )}
                        {getError('password', errors, touched, false)}
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup className="form-group">
                        <Label for="role">SELECT YOUR ROLE:</Label>
                        <Input
                          id="role"
                          className={getError('role', errors, touched)}
                          name="role"
                          placeholder="select role"
                          type="select"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.role}
                          data-testid="sign-up-role"
                        >
                          <option value={''}>--Select your role--</option>
                          {roles.map(role => {
                            return (
                              <option key={role.name} value={role.name}>
                                {role.label}
                              </option>
                            );
                          })}
                        </Input>
                        {getError('role', errors, touched, false)}
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup className="form-group">
                        <Label for="organization">
                          SELECT YOUR ORGANISATION:
                        </Label>
                        <Input
                          id="organization"
                          className={getError('organization', errors, touched)}
                          name="organization"
                          placeholder="select organisation"
                          type="select"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={
                            values.role === citizenId ? '' : values.organization
                          }
                          data-testid="sign-up-org"
                          disabled={values.role === citizenId}
                        >
                          <option value={''}>--Select organisation--</option>
                          {orgList.map(org => {
                            return (
                              <option key={org.name} value={org.name}>
                                {org.name}
                              </option>
                            );
                          })}
                        </Input>
                        {getError('organization', errors, touched, false)}
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup className="form-group" check>
                        <Input
                          id="accepted_terms"
                          name="accepted_terms"
                          type="checkbox"
                          value={values.accepted_terms}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          data-testid="sign-up-agreeTermsConditions"
                        />
                        <Label check for="accepted_terms">
                          <p className="mb-0">
                            <span>I agree to the </span>
                            <a href={docTNM} rel="noreferrer" target="_blank">
                              Terms of User
                            </a>
                            <span> and </span>
                            <a href={docPP} rel="noreferrer" target="_blank">
                              Privacy Policy
                            </a>
                            <span>
                              , to the processing of my personal data, and to
                              receive emails
                            </span>
                          </p>
                        </Label>
                        {getError('accepted_terms', errors, touched, false)}
                      </FormGroup>
                    </Col>
                  </Row>
                  <div className="center-sign-in">
                    <Button
                      className="my-4 sign-in-btn"
                      color="primary"
                      disabled={isSubmitting}
                      data-testid="signUpButton"
                    >
                      SIGN UP
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <h5>Sorry, registration is not available at the moment</h5>
                </>
              )}
            </Form>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default SignUp;
