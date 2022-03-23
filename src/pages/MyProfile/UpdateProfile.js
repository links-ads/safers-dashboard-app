import React, { useState, useEffect, useRef }  from 'react';
import { Row, Col, Card, CardBody, CardTitle, Media, Form, Label, Input,   Modal } from 'reactstrap';
import avatar from '../../assets/images/users/avatar-1.jpg';
import { Formik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { getInfo, updateInfo, uploadProfImg, getRoleList, getOrgList, deleteAccount, signOut } from '../../store/appAction';
import { getGeneralErrors, getError }  from '../../helpers/errorHelper';

import countryList  from 'country-list';
import * as Yup from 'yup';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css'


const UpdateProfile = () => {
  toastr.options = {
    preventDuplicates: true,
  }
  const user = useSelector(state => state.myprofile.user);
  const uploadFileSuccessRes = useSelector(state => state.myprofile.uploadFileSuccessRes);
  const deleteAccSuccessRes = useSelector(state => state.myprofile.deleteAccSuccessRes);
  const uploadFileFailRes = useSelector(state => state.myprofile.uploadFileFailRes);
  const deleteAccFailRes = useSelector(state => state.myprofile.deleteAccFailRes);
  const orgList = useSelector(state => state.common.orgList);
  const roles = useSelector(state => state.common.roleList);
  const [modal_backdrop, setmodal_backdrop] = useState(false);
  const [error, setError] = useState(false);
  const fileUploader = useRef(null);
  const dispatch = useDispatch();

  const countryObj = countryList.getNameList();
  const countryNameArr = Object.keys(countryObj);

  useEffect(() => {
    dispatch(getInfo())
    if(orgList.length===0)
      dispatch(getRoleList());
    if(orgList.length===0)
      dispatch(getOrgList());
  }, []);

  useEffect(() => {
    if(uploadFileSuccessRes?.detail) {
      toastr.success(uploadFileSuccessRes.detail, '');
    }  
  }, [uploadFileSuccessRes]);

  useEffect(() => {
    if(deleteAccSuccessRes){
      dispatch(signOut());
    }
  }, [deleteAccSuccessRes]);

  useEffect(() => {
    const error = uploadFileFailRes ? uploadFileFailRes : (deleteAccFailRes ? deleteAccFailRes : false);
    setError(error);
  }, [uploadFileFailRes, deleteAccFailRes]);

  const onChangeFile = (event) => {
    event.stopPropagation();
    event.preventDefault();
    var file = event.target.files[0];
    dispatch(uploadProfImg(file));
  }


  const confirmAccDelete = () => {
    dispatch(deleteAccount());
    setmodal_backdrop(false);
  }

  const tog_modal = () => {
    setmodal_backdrop(!modal_backdrop);
    removeBodyCss();
  }

  const removeBodyCss = () => {
    document.body.classList.add('no_padding');
  }

  const handleClick = () => {
    fileUploader.current.click();
  }

  const myProfileSchema = Yup.object().shape({
    firstname: Yup.string()
      .required('The field cannot be empty'),
    lastname: Yup.string()
      .required('The field cannot be empty'),
    country: Yup.string()
      .required('The field cannot be empty'),
    city: Yup.string()
      .required('The field cannot be empty'),
    userRole: Yup.string()
      .required('The field cannot be empty'),
    address: Yup.string()
      .required('The field cannot be empty'),
  })
    .when((values, schema) => {
      if (values.userRole !== 'Citizen') {
        return schema.shape({
          organization: Yup.string().required('The field cannot be empty'),
        });
      }
    });

  return (
    <>
      <Row>
        <Col lg={12}>
          {getGeneralErrors(error)}
        </Col>
      </Row>
      <Row>
        <Col lg={4}>
          <Card color="dark default-panel">
            <CardBody>
              <CardTitle className="mb-2 dflt-seperator pb-3">
                <Media>
                  <div className="ms-3">
                    <img
                      src={avatar}
                      alt=""
                      className="avatar-md rounded-circle img-thumbnail"
                    />
                    <div className='text-center mt-2'><a className='lnk-edit' onClick={(e)=>{handleClick(e)}}>Edit Image</a></div>
                    <input type="file" id="file" ref={fileUploader} style={{display: 'none'}} onChange={(e) => {onChangeFile(e)}}/>
                  </div>
                  <Media body className="ms-4 align-self-center">
                    <h1 className="h5">{user.name}</h1>
                    <h2 className="h6">{user.title}</h2>
                  </Media>
                </Media>
              </CardTitle>
              <div className="p-4">
                <Row className='prof-list'>
                  <Col md="6" className='p-2 dflt-seperator'>
                    <i className='bx bx-mail-send me-2'></i><span>Email</span>
                  </Col>
                  <Col md="6" className='p-2 dflt-seperator'>
                    {user.email}
                  </Col>
                  <Col md="6" className='p-2 dflt-seperator'>
                    <i className='bx bx-map me-2'></i><span>Location</span> 
                  </Col>
                  <Col md="6" className='p-2 dflt-seperator'>
                    {user.location}
                  </Col>
                  <Col md="6" className='p-2 dflt-seperator'>
                    <i className='bx bx-shopping-bag me-2'></i><span>Company</span> 
                  </Col>
                  <Col md="6" className='p-2 dflt-seperator'>
                    {user.company}
                  </Col>
                  <Col md="6" className='p-2 dflt-seperator'>
                    <i className='bx bx-map me-2'></i><span>Area of Interest</span> 
                  </Col>
                  <Col md="6" className='p-2 dflt-seperator'>
                    {user.aoi}
                  </Col>
                </Row>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col lg={8}>
          <Card color="dark default-panel">
            <CardBody>
              <CardTitle className="mb-2 dflt-seperator">
                <h3 className="h5 mb-0">Personal Details</h3>
              </CardTitle>
              <Formik
                initialValues={{
                  firstname: '',
                  lastname: '',
                  organization: '',
                  country: '',
                  city: '',
                  role: '',
                  address: ''
                }}
                validationSchema={myProfileSchema}
                onSubmit={(values, { setSubmitting }) => {
                  console.log(values)
                  dispatch(updateInfo(values));
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
                  <Form className='p-3' onSubmit={handleSubmit} noValidate>
                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="formrow-email-Input">First Name</Label>
                          <Input
                            type="text"
                            id="firstname"
                            className={getError('firstname', errors, touched)}
                            name="firstname"
                            placeholder="First name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.firstname}
                            autoComplete="on"
                          />
                          {getError('firstname', errors, touched, false)}
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="formrow-password-Input">Last Name</Label>
                          <Input
                            type="text"
                            id="lastname"
                            className={getError('lastname', errors, touched)}
                            name="lastname"
                            placeholder="Last name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.lastname}
                            autoComplete="on"
                          />
                          {getError('lastname', errors, touched, false)}
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="formrow-password-Input">Organization</Label>
                          <Input
                            type="select"
                            id="organization"
                            className={getError('organization', errors, touched)}
                            name="organization"
                            placeholder="organization"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={values.userRole === 'Citizen'}
                            value={values.userRole === 'Citizen' ? '' : values.organization}
                            autoComplete="on"
                          >
                            <option value={''} >{values.userRole === 'Citizen' ? 'N/A' : '--Select organisation--'}</option>
                            {orgList.map((org, index) => { return (<option key={index} value={org.name}>{org.name}</option>) })}
                          </Input>
                          {getError('organization', errors, touched, false)}
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="formrow-password-Input">Country</Label>
                          <Input
                            id="country"
                            className={getError('country', errors, touched)}
                            name="country"
                            placeholder="select country"
                            type="select"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.country}
                          >
                            <option value={''} >--Select your country--</option>
                            {countryNameArr.map((value) => { return (<option key={countryObj[value]} value={countryObj[value]}>{value}</option>) })}
                          </Input>
                          {getError('country', errors, touched, false)}
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="formrow-password-Input">City</Label>
                          <Input
                            type="text"
                            id="city"
                            className={getError('city', errors, touched)}
                            name="city"
                            placeholder="city"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.city}
                            autoComplete="on"
                          />
                          {getError('city', errors, touched, false)}
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="formrow-password-Input">Role</Label>
                          <Input
                            id="userRole"
                            className={getError('userRole', errors, touched)}
                            name="userRole"
                            placeholder="select role"
                            type="select"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.userRole}
                          >
                            <option value={''} >--Select your role--</option>
                            {roles.map((role, index) => { return (<option key={index} value={role.name}>{role.name}</option>) })}
                          </Input>
                          {getError('userRole', errors, touched, false)}
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="formrow-password-Input">Address</Label>
                          <Input
                            type="text"
                            id="address"
                            className={getError('address', errors, touched)}
                            name="address"
                            placeholder="address"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.address}
                            autoComplete="on"
                          />
                          {getError('address', errors, touched, false)}
                        </div>
                      </Col>
                    </Row>
                    <div className='text-center'>
                      <button type="submit" className="btn btn-primary w-md me-2" disabled={isSubmitting}>
                      UPDATE DETAILS
                      </button>
                      <button type="button" className="btn btn-secondary w-md"
                        onClick={() => {
                          tog_modal()
                        }}
                        data-toggle="modal">
                        DELETE MY ACCOUNT
                      </button>
                      <Modal
                        isOpen={modal_backdrop}
                        toggle={() => {
                          tog_modal()
                        }}
                        scrollable={true}
                        id="staticBackdrop"
                      >
                        <div className="modal-header">
                          <h5 className="modal-title" id="staticBackdropLabel">Warning!</h5>
                          <button type="button" className="btn-close"
                            onClick={() => {
                              setmodal_backdrop(false)
                            }} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                          <p>Please confirm if you want to delete this account.</p>
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-light" onClick={() => {
                            setmodal_backdrop(false)
                          }}>Close</button>
                          <button type="button" className="btn btn-primary" onClick={() => {confirmAccDelete()}}>Yes</button>
                        </div>
                      </Modal>
                    </div>
                  </Form>
                )}
              </Formik >
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default UpdateProfile;
