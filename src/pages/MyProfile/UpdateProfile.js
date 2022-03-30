import React, { useState, useEffect, useRef }  from 'react';
import { Row, Col, Card, CardBody, CardTitle, Media, Form, Label, Input,   Modal } from 'reactstrap';
import avatar from '../../assets/images/users/avatar-1.jpg';
import { Formik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { getInfo, updateInfo, uploadProfImg, getRoleList, getOrgList, deleteAccount, signOut } from '../../store/appAction';
import { getGeneralErrors, getError }  from '../../helpers/errorHelper';
import _ from 'lodash';

import countryList  from 'country-list';
import * as Yup from 'yup';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css'


const UpdateProfile = () => {
  toastr.options = {
    preventDuplicates: true,
  }
  const {id} = useSelector(state => state.auth.user);
  const { uploadFileSuccessRes, deleteAccSuccessRes, uploadFileFailRes, deleteAccFailRes, updateStatus, info:user } = useSelector(state => state.user);
  const { orgList = [], roleList:roles = [] } = useSelector(state => state.common);
  const [modal_backdrop, setmodal_backdrop] = useState(false);
  const [orgName, setorgName] = useState('');
  const [citizenId, setcitizenId] = useState('');

  const formInit =   {
    first_name: user?.profile?.first_name || '',
    last_name: user?.profile?.last_name || '',
    organization: user?.organization || '',
    country: user?.profile?.country || '',
    city: user?.profile?.city || '',
    role: user?.role || '',
    address: user?.profile?.address || ''
  };
  const [error, setError] = useState(false);
  const fileUploader = useRef(null);
  const dispatch = useDispatch();

  const countryObj = countryList.getNameList();
  const countryNameArr = Object.keys(countryObj);

  useEffect(() => {
    dispatch(getInfo(id))
    if(orgList.length===0)
      dispatch(getRoleList());
    if(orgList.length===0)
      dispatch(getOrgList());
  }, []);
  
  if(uploadFileSuccessRes?.detail) {
    toastr.success(uploadFileSuccessRes.detail, '');
  }  
  if(updateStatus?.detail) {
    toastr.success(updateStatus.detail, '');
  }  
  if(deleteAccSuccessRes){
    dispatch(signOut());
  }

  useEffect(() => {
    const error = uploadFileFailRes ? uploadFileFailRes : (deleteAccFailRes ? deleteAccFailRes : false);
    setError(error);
  }, [uploadFileFailRes, deleteAccFailRes]);

  useEffect(() => {
    if(orgList.length){
      const organization = _.find(orgList, { id: user.organization });
      setorgName(organization.name.split('-')[0])
    }
  }, [orgList]);

  useEffect(() => {
    if(roles.length){
      const role = _.find(roles, { name: 'Citizen' });
      setcitizenId(role.id)
    }
  }, [roles]);

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
    first_name: Yup.string()
      .required('The field cannot be empty'),
    last_name: Yup.string()
      .required('The field cannot be empty'),
    role: Yup.string()
      .required('The field cannot be empty'),
  })
    .when((values, schema) => {
      if (values.role !== citizenId) {
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
                    <h1 className="h5">{user.firstName} {user.lastName}</h1>
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
                    {user.address}
                  </Col>
                  <Col md="6" className='p-2 dflt-seperator'>
                    <i className='bx bx-shopping-bag me-2'></i><span>Organization</span> 
                  </Col>
                  <Col md="6" className='p-2 dflt-seperator'>
                    {orgName}
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
                enableReinitialize={true}
                initialValues={formInit}
                validationSchema={myProfileSchema}
                onSubmit={(values, { setSubmitting }) => {
                  console.log(values)
                  dispatch(updateInfo(id, values));
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
                            id="first_name"
                            className={getError('first_name', errors, touched)}
                            name="first_name"
                            placeholder="First name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.first_name}
                            autoComplete="on"
                          />
                          {getError('first_name', errors, touched, false)}
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="formrow-password-Input">Last Name</Label>
                          <Input
                            type="text"
                            id="last_name"
                            className={getError('last_name', errors, touched)}
                            name="last_name"
                            placeholder="Last name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.last_name}
                            autoComplete="on"
                          />
                          {getError('last_name', errors, touched, false)}
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
                            disabled={values.role === citizenId}
                            value={values.role === citizenId ? '' : values.organization}
                            autoComplete="on"
                          >
                            <option value={''} >{values.role === citizenId ? 'N/A' : '--Select organisation--'}</option>
                            {orgList.map((org, index) => { return (<option key={index} value={org.id}>{org.name}</option>) })}
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
                            id="role"
                            className={getError('role', errors, touched)}
                            name="role"
                            placeholder="select role"
                            type="select"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.role}
                          >
                            <option value={''} >--Select your role--</option>
                            {roles.map((roleObj, index) => { return (<option key={index} value={roleObj.id}>{roleObj.name}</option>) })}
                          </Input>
                          {getError('role', errors, touched, false)}
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
