import React, { useEffect } from 'react';
import { signIn } from '../../store/appAction';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import { Button, Col, Form, FormGroup, Input, Label, Row, } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const loggingIn = useSelector(state => state.auth.isLoggedIn);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validations = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = 'Required';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
    ) {
      errors.email = 'Invalid email address';
    }
    if (!values.password) {
      errors.password = 'Required';
    }
    return errors;
  }
  
  useEffect(() => {
    if (loggingIn)
      navigate('/dashboard');
  }, [loggingIn]);

  return (
    <Formik
      initialValues={{ email: '', password: '', rememberMe: false }}
      validate={values => validations(values)}
      onSubmit={(values, { setSubmitting }) => {
        console.log(values)
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
        <Form onSubmit={handleSubmit} noValidate>
          <Row form>
            <Col md={6}>
              <FormGroup >
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
                />
                {errors.email && touched.email && errors.email}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="userPassword">
                  PASSWORD:
                </Label>
                <Input
                  id="userPassword"
                  className={errors.password ? 'is-invalid' : ''}
                  name="password"
                  placeholder="password"
                  type="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                />
                {errors.password && touched.password && errors.password}
              </FormGroup>
            </Col>
          </Row>
          <FormGroup check>
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
          <Button disabled={isSubmitting}>
            SIGN IN
          </Button>
        </Form>
      )}
    </Formik>
  );
}

export default SignIn;
