import React, { useState } from 'react';
import { Formik } from 'formik';
import { Button, Col, Form, FormGroup, Input, Label, Row, InputGroup, InputGroupText, Alert } from 'reactstrap';
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux';
import { resetPsw } from '../../store/appAction';
import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { passwordHelper, pwdRegEx, pwdValidationTxt }  from '../../helpers/passwordHelper'
import { getGeneralErrors, getError }  from '../../helpers/errorHelper'

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { otp: token, uid } = useParams();
  const [passwordToggle, setPasswordToggle] = useState(false);
  const error = useSelector(state => state.auth.resetPswError);
  const resetPswRes = useSelector(state => state.auth.resetPswRes);

  const signUpSchema = Yup.object().shape({
    new_password1: Yup.string()
      .matches(
        pwdRegEx,
        pwdValidationTxt
      )
      .required('The field cannot be empty'),
    new_password2: Yup.string()
      .oneOf([Yup.ref('new_password1')], 'Passwords must match'),
  });

  if(resetPswRes) {
    return (
      <div className='forgot-psw'>
        <Alert color="success" role="alert">
          {resetPswRes}. Please <Link to='/auth/sign-in'>Sign in</Link>
        </Alert>  
      </div>
    );
  }

  return (
    <Formik
      initialValues={{
        new_password1: '',
        new_password2: '',
      }}
      validationSchema={signUpSchema}
      onSubmit={(values, { setSubmitting }) => {
        dispatch(resetPsw({...values, token, uid}));
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
      }) =>(
        <>
          <div className='forgot-psw'>
            <h1 className='h4 forgot-psw'>Reset your password</h1>  
          </div>
          <div className='tab-container'>
            <div className="container auth-form">
              {getGeneralErrors(error)}
              <Form onSubmit={handleSubmit} noValidate>
                <Row form>
                  <Col>
                    <FormGroup className="form-group">
                      <Label for="new_password1">
                        New password:
                      </Label>
                      <InputGroup>
                        <Input
                          id="new_password1"
                          className={errors.new_password1 ? 'is-invalid' : ''}
                          name="new_password1"
                          placeholder="new password"
                          type={passwordToggle ? 'text' : 'password'}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.new_password1}
                          autoComplete="on"
                        />
                        <InputGroupText>
                          <i data-testid="sign-up-password-toggle" onClick={() => { setPasswordToggle(!passwordToggle) }} className={`fa ${passwordToggle ? 'fa-eye-slash' : 'fa-eye'}`} />
                        </InputGroupText>
                      </InputGroup>
                      {values.new_password1 && (<>{passwordHelper(values.new_password1)}</>)}
                      {getError('new_password1', errors, touched, false)}
                    </FormGroup>
                    <FormGroup className="form-group">
                      <Label for="new_password2">
                        Confirm password:
                      </Label>
                      <InputGroup>
                        <Input
                          id="new_password2"
                          className={getError('new_password2', errors, touched)}
                          name="new_password2"
                          placeholder="confirm password"
                          type={passwordToggle ? 'text' : 'password'}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.new_password2}
                          autoComplete="on"
                        />
                        <InputGroupText>
                          <i data-testid="sign-up-password-toggle" onClick={() => { setPasswordToggle(!passwordToggle) }} className={`fa ${passwordToggle ? 'fa-eye-slash' : 'fa-eye'}`} />
                        </InputGroupText>
                      </InputGroup>
                      {getError('new_password2', errors, touched, false)}
                    </FormGroup>
                  </Col>
                </Row>
                <div className='center-sign-in'>
                  <Button
                    type="button"
                    className="my-4 sign-in-btn"
                    color="secondary"
                    disabled={isSubmitting}
                    onClick={()=>{navigate('/auth/sign-in');}}>
                    Cancel
                  </Button>
                  <Button
                    className="my-4 sign-in-btn"
                    color="primary"
                    disabled={isSubmitting}>
                    Change
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </>
      )}
    </Formik>
  );
}

export default ResetPassword;
