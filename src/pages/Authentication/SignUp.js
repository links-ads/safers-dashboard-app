import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import { Button, Col, Form, FormGroup, Input, InputGroup, InputGroupText, Label, Row, Progress, List } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup'
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


  const signUpSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('The field cannot be empty'),
    password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
        'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number'
      )
      .required('The field cannot be empty'),
    firstName: Yup.string()
      .required('The field cannot be empty'),
    lastName: Yup.string()
      .required('The field cannot be empty'),
    userRole: Yup.string()
      .required('The field cannot be empty'),
    agreeTermsConditions: Yup.bool()
      .oneOf([true], 'Please accept the terms and conditions')
  }) .when((values, schema) => {
    if (values.userRole !== 'Citizen') {
      return schema.shape({
        userOrg: Yup.string().required('The field cannot be empty'),
      });
    }
  });

  const pswStrengthIndicator = (password) => {
    let chkUpperCase = false, chkLowerCase = false, hasNumber = false, chkLength = false, pswStrengthColor = 'Secondary';
    let strengthScore = 0, pswStrength = 'Weak';

    if(password.length > 7) {
      strengthScore++;
      chkLength = true;
    }

    if(password.match(/(?=.*[A-Z])/)){
      strengthScore++;
      chkUpperCase = true;
    }
    if(password.match(/(?=.*[a-z])/)){
      strengthScore++;
      chkLowerCase = true;
    }
    if(password.match(/(?=.*[0-9])/)){
      strengthScore++
      hasNumber = true;
    }

    switch(strengthScore) {
    case 1:
    case 2:
      pswStrengthColor = 'danger';
      break;
    case 3:
      pswStrengthColor = 'warning';
      pswStrength = 'Average';
      break;
    case 4:
      pswStrengthColor = 'success';
      pswStrength = 'Strong';
      break;
    default:
      pswStrengthColor = 'Secondary';
      pswStrength = 'Weak';

    }

    const iconClass = 'float-start fs-4 fw-bold me-1';
    const successIcon = 'bx bx-check-circle text-success';
    const errorIcon = 'bx bx-x-circle text-danger';
    return (<>
      <Row className='mt-2'>
        <Col>
          <Progress id="pswStrength" multi width={25}>
            <Progress bar color={strengthScore > 0 ? pswStrengthColor : ''} value={25} className="rounded grey" />
            <Progress bar color={strengthScore > 1 ? pswStrengthColor : ''} value={25} className="ms-2 rounded grey" />
            <Progress bar color={strengthScore > 2 ? pswStrengthColor : ''} value={25} className="ms-2 rounded grey" />
            <Progress bar color={strengthScore > 3 ? pswStrengthColor : ''} value={25} className="ms-2 rounded grey" />
          </Progress>
        </Col>
        <Col>
          <span color={pswStrengthColor} className="float-end">{pswStrength}</span>
        </Col>
      </Row>
      <Row>
        <Col>
          <List id="pswInstructions" type="unstyled" className='mt-3'>
            <li className='mb-1'><i className={`${iconClass} ${chkLength ? successIcon : errorIcon}`}></i><span className={!chkLength? 'text-white' : ''}>8 characters long</span></li>
            <li className='mb-1'><i className={`${iconClass} ${chkUpperCase ? successIcon :errorIcon}`}></i><span className={!chkUpperCase? 'text-white' : ''}>Uppercase letter</span></li>
            <li className='mb-1'><i className={`${iconClass} ${chkLowerCase ? successIcon : errorIcon}`}></i><span className={!chkLowerCase? 'text-white' : ''}>Lowercase letter</span></li>
            <li className='mb-1'><i className={`${iconClass} ${hasNumber ? successIcon : errorIcon}`}></i><span className={!hasNumber? 'text-white' : ''}>Must contain number</span></li>
          </List>
        </Col>
      </Row>
    </>)
  }

  const getError = (key, errors, touched, errStyle=true) => {
    if(errors[key] && touched[key]){
      return (errStyle ? 'is-invalid': <div className="invalid-feedback d-block">{errors[key]}</div> )
    }
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
      validationSchema={signUpSchema}
      onSubmit={(values, { setSubmitting }) => {
        console.log(values)
        dispatch(registration(values));
        setSubmitting(false);
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
          <div className="container auth-form">
            <Form onSubmit={handleSubmit} noValidate>
              <Row form>
                <Col>
                  <FormGroup className="form-group">
                    <Label for="userEmail">
                      EMAIL ADDRESS:
                    </Label>
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
                      data-testid = "sign-up-email"
                    />
                    {getError('email', errors, touched, false)}
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup className="form-group">
                    <Label for="firstName">
                      FIRST NAME:
                    </Label>
                    <Input
                      id="firstName"
                      className={getError('firstName', errors, touched)}
                      name="firstName"
                      data-testid="sign-up-firstName"
                      placeholder="first name"
                      type="text"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.firstName}
                      autoComplete="on"
                    />
                    {getError('firstName', errors, touched, false)}
                  </FormGroup>
                </Col>
                <Col >
                  <FormGroup className="form-group">
                    <Label for="lastName">
                      LAST NAME:
                    </Label>
                    <Input
                      id="lastName"
                      className={getError('lastName', errors, touched)}
                      name="lastName"
                      placeholder="last name"
                      type="lastName"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.lastName}
                      autoComplete="on"
                      data-testid="sign-up-lastName"
                    />
                    {getError('lastName', errors, touched, false)}
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup className="form-group">
                    <Label for="userPassword">
                      PASSWORD:
                    </Label>
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
                        <i data-testid="sign-up-password-toggle" onClick={() => { setPasswordToggle(!passwordToggle) }} className={`fa ${passwordToggle ? 'fa-eye-slash' : 'fa-eye'}`} />
                      </InputGroupText>
                    </InputGroup>
                    {values.password && (<>{pswStrengthIndicator(values.password)}</>)}
                    {getError('password', errors, touched, false)}
                  </FormGroup>
                </Col>
                <Col >
                  <FormGroup className="form-group">
                    <Label for="userRole">
                      SELECT YOUR ROLE:
                    </Label>
                    <Input
                      id="userRole"
                      className={getError('userRole', errors, touched)}
                      name="userRole"
                      placeholder="select role"
                      type="select"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.userRole}
                      data-testid="sign-up-role"
                    >
                      <option value={''} >--Select your role--</option>
                      {roles.map((role, index) => { return (<option key={index} value={role}>{role}</option>) })}
                    </Input>
                    {getError('userRole', errors, touched, false)}
                  </FormGroup>
                </Col>
                <Col className={values.userRole == 'Citizen' ? 'd-none': ''}>
                  <FormGroup className="form-group">
                    <Label for="userOrg">
                      SELECT ORGANISATION:
                    </Label>
                    <Input
                      id="userOrg"
                      className={getError('userOrg', errors, touched)}
                      name="userOrg"
                      placeholder="select organisation"
                      type="select"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.userOrg}
                      data-testid="sign-up-org"
                    >
                      <option value={''} >--Select organisation--</option>
                      {organisations.map((org, index) => { return (<option key={index} value={org.code}>{org.code} - {org.name}</option>) })}
                    </Input>
                    {getError('userOrg', errors, touched, false)}
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup className="form-group" check>
                    <Input
                      id="agreeTermsConditions"
                      name="agreeTermsConditions"
                      type="checkbox"
                      value={values.agreeTermsConditions}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      data-testid="sign-up-agreeTermsConditions"
                    />
                    <Label
                      check
                      for="agreeTermsConditions"
                    >
                      <p className='mb-0'>
                        <span>I agree to the </span>
                        <a href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" rel="noreferrer" target="_blank">
                          Terms of User
                        </a>
                        <span> and </span>
                        <a href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" rel="noreferrer" target="_blank">
                          Privacy Policy
                        </a>
                        <span>, to the processing of my personal data, and to receive emails</span>
                      </p>
                    </Label>
                    {getError('agreeTermsConditions', errors, touched, false)}
                  </FormGroup>
                </Col>
              </Row>
              <div className='center-sign-in'>
                <Button
                  className="my-4 sign-in-btn"
                  color="primary"
                  disabled={isSubmitting}
                  data-testid="sign-up-btn">
                SIGN UP
                </Button>
              </div>
            </Form>
          </div>
        </div>
      )
      }
    </Formik >
  );
}

export default SignUp;
