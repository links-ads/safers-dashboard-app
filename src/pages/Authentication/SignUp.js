import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import { Button, Col, Form, FormGroup, Input, InputGroup, InputGroupText, Label, Row, Progress, List } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
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
    userOrg: Yup.string()
      .required('The field cannot be empty'),
    agreeTermsConditions: Yup.bool()
      .oneOf([true], 'Please accept the terms and conditions')
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
          <List type="unstyled" className='mt-3'>
            <li className='mb-1'><i className={`${iconClass} ${chkLength ? successIcon : errorIcon}`}></i>8 characters long</li>
            <li className='mb-1'><i className={`${iconClass} ${chkUpperCase ? successIcon :errorIcon}`}></i>Uppercase letter</li>
            <li className='mb-1'><i className={`${iconClass} ${chkLowerCase ? successIcon : errorIcon}`}></i>Lowercase letter</li>
            <li className='mb-1'><i className={`${iconClass} ${hasNumber ? successIcon : errorIcon}`}></i>Must contain number</li>
          </List>
        </Col>
      </Row>
    </>)
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
                <Col>
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
                <Col >
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
                <Col>
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
                    {values.password && (<>{pswStrengthIndicator(values.password)}</>)}
                    {errors.password && touched.password && (<div className="invalid-feedback">{errors.password}</div>)}
                  </FormGroup>
                </Col>
                <Col >
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
                    {errors.userRole && touched.userRole && (<div className="invalid-feedback">{errors.userRole}</div>)}
                  </FormGroup>
                </Col>
                <Col >
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
                    {errors.userOrg && touched.userOrg && (<div className="invalid-feedback">{errors.userOrg}</div>)}
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
                    />
                    {errors.agreeTermsConditions && (<div className="invalid-feedback">{errors.agreeTermsConditions}</div>)}
                    <Label
                      check
                      for="agreeTermsConditions"
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
                </Col>
              </Row>
              <div className='center-sign-in'>
                <Button
                  className="my-4 sign-in-btn"
                  color="primary"
                  disabled={isSubmitting}>
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
