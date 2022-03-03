import React from 'react';
import { signIn } from '../../store/appAction';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik';
import { Button, Col, Form, FormGroup, Input, Label, Row, } from 'reactstrap';

const SignIn = () => {
  const dispatch = useDispatch();
  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validate={values => {
        const errors = {};
        if (!values.email) {
          errors.email = 'Required';
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
          errors.email = 'Invalid email address';
        }
        return errors;
      }}
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
        <Form onSubmit={handleSubmit}>
          <Row form>
            <Col md={6}>
              <FormGroup>
                <Label for="userEmail">
                  EMAIL ADDRESS:
                </Label>
                <Input
                  id="userEmail"
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
              name="check"
              type="checkbox"
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
