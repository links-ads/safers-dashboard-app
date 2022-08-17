import React, { useState } from 'react';
import { signIn } from '../../store/appAction';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import { Button, Col, Form, FormGroup, Input, InputGroup, InputGroupText, Label, Row, } from 'reactstrap';
import { Link } from 'react-router-dom';
import { getGeneralErrors, getError }  from '../../helpers/errorHelper';
import OAuth2 from './OAuth2';
import * as Yup from 'yup'
import { Conditional } from '../../Utility/conditional';

const SignIn = () => {
  const { errorSignIn:genError  } = useSelector(state => state.auth);
  const [passwordToggle, setPasswordToggle] = useState(false);
  const dispatch = useDispatch();
  const config = useSelector(state => state.common.config);
  const signInSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('The field cannot be empty'),
    password: Yup.string()
      .required('The field cannot be empty'),
  });

  return (
    <Formik
      initialValues={{ email: '', password: '', rememberMe: false }}
      validationSchema={signInSchema}
      onSubmit={(values, { setSubmitting }) => {
        dispatch(signIn(values));
        setSubmitting(false);
      }}
      id="login-form"
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
          {getGeneralErrors(genError)}
          <div className="container auth-form" data-test="signInComponent">
            <Form onSubmit={handleSubmit} noValidate>

              <Conditional condition={config?.allow_local_signin}>      
                <Row form>
                  <Col>
                    <FormGroup className="form-group">
                      <Label for="userEmail">
                      EMAIL ADDRESS:
                      </Label>
                      <Input
                        id="signInUserEmail"
                        className={getError('email', errors, touched)}
                        name="email"
                        placeholder="email address"
                        type="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                        autoComplete="on"
                        data-testid="sign-in-email"
                      />
                      {getError('email', errors, touched, false)}
                    </FormGroup>
                  </Col>
                  <Col >
                    <FormGroup className="form-group">
                      <Label for="userPassword">
                      PASSWORD:
                      </Label>
                      <InputGroup>
                        <Input
                          id="signInUserPassword"
                          className={getError('password', errors, touched)}
                          name="password"
                          placeholder="password"
                          type={passwordToggle ? 'text' : 'password'}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.password}
                          autoComplete="on"
                          data-testid="sign-in-password"
                        />
                        <InputGroupText>
                          <i data-testid="password-toggle" onClick={() => { setPasswordToggle(!passwordToggle) }} className={`fa ${passwordToggle ? 'fa-eye-slash' : 'fa-eye'}`} />
                        </InputGroupText>
                      </InputGroup>
                      {getError('password', errors, touched, false)}
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup className="form-group" check>
                  <Input
                    id="rememberMe"
                    data-testid="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    value={values.rememberMe}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Label
                    check
                    for="rememberMe"
                  >
                  Remember Me
                  </Label>
                </FormGroup>
                <div className="form-group center-sign-in">
                  <Button
                    className="sign-in-btn"
                    color="primary"
                    data-testid="signInButton"
                    disabled={isSubmitting}>
                  SIGN IN
                  </Button>

                </div>
                <div className="mt-1 pb-3 center-sign-in dflt-seperator">
                  <Link to="/auth/forgot-password" className="text-muted">
                  Forgot password?
                  </Link>
                </div>
              </Conditional>

              <Conditional condition={config?.allow_remote_signin}>
                <div className='mt-3'>
                  <OAuth2/>
                </div>
              </Conditional>
              
            </Form>
          </div>
        </div>
      )}
    </Formik>
  );
}

export default SignIn;
