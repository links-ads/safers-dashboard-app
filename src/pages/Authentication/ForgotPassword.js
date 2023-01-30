import React from 'react';

import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Alert,
} from 'reactstrap';
import * as Yup from 'yup';

import { reqResetPsw } from '../../store/appAction';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const forgotPswresponse = useSelector(state => state.auth.forgotPswresponse);
  const navigate = useNavigate();

  const signUpSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('The field cannot be empty'),
  });

  if (forgotPswresponse) {
    return (
      <div className="forgot-psw">
        <Alert color="success" role="alert">
          Please check your email for the instructions on password resetting.
        </Alert>
      </div>
    );
  }

  return (
    <Formik
      initialValues={{
        email: '',
      }}
      validationSchema={signUpSchema}
      onSubmit={(values, { setSubmitting }) => {
        dispatch(reqResetPsw(values));
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
        <>
          <div className="forgot-psw">
            <h1 className="h4 forgot-psw">Forgot Password?</h1>
            <p className="h5 forgot-psw">
              Enter your email address here to reset your password
            </p>
          </div>
          <div className="tab-container">
            <div className="container auth-form">
              <Form onSubmit={handleSubmit} noValidate>
                <Row form>
                  <Col>
                    <FormGroup className="form-group">
                      <Label for="userEmail">EMAIL ADDRESS:</Label>
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
                      {errors.email && touched.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
                <div className="center-sign-in">
                  <Button
                    type="button"
                    className="my-4 sign-in-btn"
                    color="secondary"
                    disabled={isSubmitting}
                    onClick={() => {
                      navigate('/auth/sign-in');
                    }}
                  >
                    BACK
                  </Button>
                  <Button
                    className="my-4 sign-in-btn"
                    color="primary"
                    disabled={isSubmitting}
                  >
                    SEND MAIL
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </>
      )}
    </Formik>
  );
};

export default ForgotPassword;
