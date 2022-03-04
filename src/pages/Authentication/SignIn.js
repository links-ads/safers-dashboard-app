import React, { useEffect, useState } from 'react';
import { signIn } from '../../store/appAction';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import { Button, Col, Form, FormGroup, Input, InputGroup, InputGroupText, Label, Row, } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup'

const SignIn = () => {
  const loggingIn = useSelector(state => state.auth.isLoggedIn);
  const [passwordToggle, setPasswordToggle] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (loggingIn)
      navigate('/dashboard');
  }, [loggingIn]);

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
          <div className="container">
            <Form onSubmit={handleSubmit} noValidate>
              <Row form>
                <Col md={6}>
                  <FormGroup className="form-group">
                    <Label for="userEmail">
                      EMAIL ADDRESS:
                    </Label>
                    <Input
                      id="userEmail"
                      className={errors.email ? 'is-invalid' : ''}
                      name="email"
                      placeholder="email address"
                      type="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      autoComplete="on"
                    />
                    {errors.email && touched.email && (<div className="invalid-feedback">{errors.email}</div>)}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="form-group">
                    <Label for="userPassword">
                      PASSWORD:
                    </Label>
                    <InputGroup>
                      <Input
                        id="userPassword"
                        className={errors.password ? 'is-invalid' : ''}
                        name="password"
                        placeholder="password"
                        type="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                        autoComplete="on"
                      />
                      <InputGroupText>
                        <i onClick={() => { setPasswordToggle(!passwordToggle) }} className={`fa ${passwordToggle ? 'fa-eye-slash' : 'fa-eye'}`} />
                      </InputGroupText>
                    </InputGroup>
                    {errors.password && touched.password && (<div className="invalid-feedback">{errors.password}</div>)}
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup className="form-group" check>
                <Input
                  id="rememberMe"
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
              <Button
                className="my-4"
                color="primary"
                disabled={isSubmitting}>
                SIGN IN
              </Button>
              <div className="mt-4">
                <Link to="/auth/forgot-password" className="text-muted">
                  Forgot password
                </Link>
              </div>
            </Form>
          </div>
        </div>
      )}
    </Formik>
  );
}

export default SignIn;
