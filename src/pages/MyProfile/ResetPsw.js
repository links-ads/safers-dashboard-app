import React, { useState, useEffect }  from 'react';
import { Row, Col, Card, CardBody, CardTitle, Form, Label, Input, InputGroup, InputGroupText } from 'reactstrap';
import { Formik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { resetProfilePsw } from '../../store/appAction';
import { passwordHelper, pwdRegEx, pwdValidationTxt }  from '../../helpers/passwordHelper'
import { getGeneralErrors, getError }  from '../../helpers/errorHelper'
import toastr from 'toastr';
import 'toastr/build/toastr.min.css'


const ResetPsw = () => {
  const resetPswSuccessRes = useSelector(state => state.user.resetPswSuccessRes);
  const error = useSelector(state => state.user.resetPswFailRes);
  const [passwordToggle, setPasswordToggle] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if(resetPswSuccessRes?.detail) {
      toastr.success(resetPswSuccessRes.detail, '');
    }  
  }, [resetPswSuccessRes]);

  const pswResetSchema = Yup.object().shape({
    current_password: Yup.string()
      .required('The field cannot be empty'),
    new_password1: Yup.string()
      .matches(
        pwdRegEx,
        pwdValidationTxt
      )
      .required('The field cannot be empty'),
    new_password2: Yup.string()
      .oneOf([Yup.ref('new_password1')], 'Passwords must match'),
  });

  return (
    <Row>
      <Col lg={12}>
        <Card color="dark default-panel">
          <CardBody>
            <CardTitle className="mb-2 dflt-seperator">
              <h3 className="h5 mb-0">Personal Details</h3>
            </CardTitle>
            <Formik
              initialValues={{
                current_password: '',
                new_password1: '',
                new_password2: '',
              }}
              validationSchema={pswResetSchema}
              onSubmit={(values, { setSubmitting }) => {
                dispatch(resetProfilePsw(values));
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
                handleReset,
              }) => (
                <Form className='p-3' onSubmit={handleSubmit} noValidate>
                  {getGeneralErrors(error)}
                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <Label htmlFor="formrow-email-Input">CURRENT PASSWORD</Label>
                        <InputGroup>
                          <Input
                            type={passwordToggle ? 'text' : 'password'}
                            id="current_password"
                            className={getError('current_password', errors, touched)}
                            name="current_password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.current_password}
                            autoComplete="on"
                          />
                          <InputGroupText>
                            <i data-testid="sign-up-password-toggle" onClick={() => { setPasswordToggle(!passwordToggle) }} className={`fa ${passwordToggle ? 'fa-eye-slash' : 'fa-eye'}`} />
                          </InputGroupText>
                        </InputGroup>
                        {getError('current_password', errors, touched, false)}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <Label htmlFor="formrow-password-Input">NEW PASSWORD</Label>
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
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <Label htmlFor="formrow-password-Input">CONFIRM PASSWORD</Label>
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
                      </div>
                    </Col>
                  </Row>
                  <div className='mt-2 text-end'>
                    <button type="submit" className="btn btn-primary w-md me-2" disabled={isSubmitting}>
                    CHANGE PASSWORD
                    </button>
                    <button type="button" onClick={handleReset} className="btn btn-secondary w-md">
                    CLEAR
                    </button>
                  </div>
                </Form>
              )}
            </Formik >
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}

export default ResetPsw;
