import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import { Button, Col, Form, FormGroup, Input, InputGroup, InputGroupText, Label, Row, } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import PasswordChecklist from 'react-password-checklist'
import PasswordStrengthBar from 'react-password-strength-bar';
import { signUp as registration } from '../../store/appAction';
import { organisations, roles } from '../../constants/dropdowns';

const SignUp = () => {
  const loggingIn = useSelector(state => state.auth.isLoggedIn);
  const [passwordToggle, setPasswordToggle] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (loggingIn)
      navigate('/dashboard');
  }, [loggingIn]);

  const validations = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = 'The field cannot be empty';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
    ) {
      errors.email = 'Invalid email address';
    }
    if (!values.password) {
      errors.password = 'The field cannot be empty';
    } else {
      //todo
    }
    if (!values.firstName)
      errors.firstName = 'The field cannot be empty';
    if (!values.lastName)
      errors.lastName = 'The field cannot be empty';
    if (!values.userRole)
      errors.userRole = 'The field cannot be empty';
    if (!values.userOrg)
      errors.userOrg = 'The field cannot be empty';

    return errors;
  }
  return (
    <Formik
      initialValues={{
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        userRole: '',
        userOrg: '',
        agreeTermsConditions: false
      }}
      validate={values => validations(values)}
      onSubmit={(values, { setSubmitting }) => {
        console.log(values)
        dispatch(registration(values));
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
                    <Label for="firstName">
                      FIRST NAME:
                    </Label>
                    <Input
                      id="firstName"
                      className={errors.firstName ? 'is-invalid' : ''}
                      name="firstName"
                      placeholder="first name"
                      type="text"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.firstName}
                      autoComplete="on"
                    />
                    {errors.firstName && touched.firstName && (<div className="invalid-feedback">{errors.firstName}</div>)}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="form-group">
                    <Label for="lastName">
                      LAST NAME:
                    </Label>
                    <Input
                      id="lastName"
                      className={errors.lastName ? 'is-invalid' : ''}
                      name="lastName"
                      placeholder="last name"
                      type="lastName"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.lastName}
                      autoComplete="on"
                    />
                    {errors.lastName && touched.lastName && (<div className="invalid-feedback">{errors.lastName}</div>)}
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
                        type={passwordToggle ? 'text' : 'password'}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                        autoComplete="on"
                      />
                      <InputGroupText>
                        <i onClick={() => { setPasswordToggle(!passwordToggle) }} className={`fa ${passwordToggle ? 'fa-eye-slash' : 'fa-eye'}`} />
                      </InputGroupText>
                    </InputGroup>
                    {values.password && (<>
                      <PasswordStrengthBar password={values.password} />
                      <PasswordChecklist
                        rules={['minLength', 'capital', 'lowercase', 'number']}
                        minLength={8}
                        value={values.password}
                        messages={{
                          minLength: '8 characters long',
                          capital: 'Uppercase letter',
                          lowercase: 'Lowercase letter',
                          number: 'Must contain number'
                        }}
                      />
                    </>)}
                    {errors.password && touched.password && (<div className="invalid-feedback">{errors.password}</div>)}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="form-group">
                    <Label for="userRole">
                      SELECT YOUR ROLE:
                    </Label>
                    <Input
                      id="userRole"
                      className={errors.userRole ? 'is-invalid' : ''}
                      name="userRole"
                      placeholder="select role"
                      type="select"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.userRole}
                    >
                      <option value={''} >--Select your role--</option>
                      {roles.map((role, index) => { return (<option key={index} value={role}>{role}</option>) })}
                    </Input>
                    {errors.lastName && touched.lastName && (<div className="invalid-feedback">{errors.lastName}</div>)}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="form-group">
                    <Label for="userOrg">
                      SELECT ORGANISATION:
                    </Label>
                    <Input
                      id="userOrg"
                      className={errors.userOrg ? 'is-invalid' : ''}
                      name="userOrg"
                      placeholder="select organisation"
                      type="select"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.userOrg}
                    >
                      <option value={''} >--Select organisation--</option>
                      {organisations.map((org, index) => { return (<option key={index} value={org.code}>{org.code} - {org.name}</option>) })}
                    </Input>
                    {errors.lastName && touched.lastName && (<div className="invalid-feedback">{errors.lastName}</div>)}
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup className="form-group" check>
                <Input
                  id="agreeTermsConditions"
                  name="agreeTermsConditions"
                  type="checkbox"
                  value={values.agreeTermsConditions}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Label
                  check
                  for="rememberMe"
                >
                  <p>
                    <span>I agree to the </span>
                    <Link to="/terms-of-user">
                      Terms of User
                    </Link>
                    <span> and </span>
                    <Link to="/privacy-policy">
                      Privacy Policy
                    </Link>
                    <span>, to the processing of my personal data, and to receive emails</span>
                  </p>
                </Label>
              </FormGroup>
              <Button
                className="my-4"
                color="primary"
                disabled={isSubmitting}>
                SIGN UP
              </Button>
            </Form>
          </div>
        </div>
      )
      }
    </Formik >
  );
}

export default SignUp;
