import React, { useState, useEffect } from 'react';

import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Media,
  Form,
  Label,
  Input,
  Modal,
} from 'reactstrap';
import toastr from 'toastr';
import * as Yup from 'yup';

import avatar from 'assets/images/users/profile.png';
import { getGeneralErrors, getError } from 'helpers/errorHelper';
import { signOut } from 'store/authentication.slice';
import {
  fetchOrganisations,
  fetchRoles,
  organisationsSelector,
  rolesSelector,
} from 'store/common.slice';
import {
  fetchUserProfile,
  updateUserProfile,
  deleteUserProfile,
  resetStatus,
  userInfoSelector,
  deleteAccSuccessResSelector,
  deleteAccFailResSelector,
  updateStatusSelector,
  defaultAoiSelector,
} from 'store/user.slice';

import 'toastr/build/toastr.min.css';

//i18n

const UpdateProfile = ({ t }) => {
  toastr.options = {
    preventDuplicates: true,
  };

  const deleteAccSuccessRes = useSelector(deleteAccSuccessResSelector);
  const deleteAccFailRes = useSelector(deleteAccFailResSelector);
  const updateStatus = useSelector(updateStatusSelector);
  const user = useSelector(userInfoSelector);
  const id = user.id;
  const defaultAoi = useSelector(defaultAoiSelector);

  const orgList = useSelector(organisationsSelector);
  const roles = useSelector(rolesSelector);

  const [modal_backdrop, setmodal_backdrop] = useState(false);
  const [orgName, setorgName] = useState('');
  const [citizenId, setcitizenId] = useState('');
  const [currentRole, setCurrentRole] = useState(null);

  const usersRole = roles.find(role => role.name === user?.role);

  const formInit = {
    firstName: user?.profile?.user?.firstName ?? '',
    lastName: user?.profile?.user?.lastName ?? '',
    organization: user?.organization ?? '',
    role: usersRole?.title ?? '',
  };

  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserProfile(id));

    if (roles.length === 0) dispatch(fetchRoles());
    if (orgList.length === 0) dispatch(fetchOrganisations());
  }, [dispatch, id, orgList.length, roles.length]);

  useEffect(() => {
    if (user && roles.length) {
      const currentRoleObj = roles.find(role => role.id === user.role);
      if (currentRoleObj) {
        setCurrentRole(currentRoleObj.name);
      }
      const objCitizen = roles.find(role => role.name === 'citizen');
      setcitizenId(objCitizen.id);
    }
  }, [user, roles]);

  useEffect(() => {
    if (updateStatus) {
      toastr.success(t('updated-info', { ns: 'common' }), '');
      dispatch(resetStatus());
    }
  }, [dispatch, t, updateStatus]);

  if (deleteAccSuccessRes) {
    dispatch(signOut());
  }

  useEffect(() => {
    const error = deleteAccFailRes ? deleteAccFailRes : false;
    setError(error);
  }, [deleteAccFailRes]);

  useEffect(() => {
    if (orgList.length && user?.organization) {
      const organization = orgList.find(org => org.name === user.organization);
      setorgName(organization.name.split('-')[0]);
    }
  }, [orgList, user]);

  const confirmAccDelete = () => {
    dispatch(deleteUserProfile(id));
    setmodal_backdrop(false);
  };

  const tog_modal = () => {
    setmodal_backdrop(!modal_backdrop);
    removeBodyCss();
  };

  const removeBodyCss = () => {
    document.body.classList.add('no_padding');
  };

  };

  const myProfileSchema = Yup.object().shape({
    firstName: Yup.string().required(t('field-empty-err', { ns: 'common' })),
    lastName: Yup.string().required(t('field-empty-err', { ns: 'common' })),
  });

  if (!user) {
    return null;
  }

  return (
    <>
      <Row>
        <Col lg={12}>{getGeneralErrors(error)}</Col>
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
                  </div>
                  <Media body className="ms-4 align-self-center">
                    <h1 className="h5">
                      {user.firstName} {user.lastName}
                    </h1>
                    <h2 className="h6">{currentRole}</h2>
                  </Media>
                </Media>
              </CardTitle>
              <div className="p-4">
                <Row className="prof-list">
                  <Col md="6" className="p-2 dflt-seperator">
                    <i className="bx bx-mail-send me-2"></i>
                    <span>{t('Email')}</span>
                  </Col>
                  <Col md="6" className="p-2 dflt-seperator">
                    {user.email}
                  </Col>
                  <Col md="6" className="p-2 dflt-seperator">
                    <i className="bx bx-shopping-bag me-2"></i>
                    <span>{t('Organization', { ns: 'common' })}</span>
                  </Col>
                  <Col md="6" className="p-2 dflt-seperator">
                    {orgName}
                  </Col>
                  <Col md="6" className="p-2 dflt-seperator">
                    <i className="bx bx-flag me-2"></i>
                    <span>{t('Area of Interest', { ns: 'common' })}</span>
                  </Col>
                  <Col md="6" className="p-2 dflt-seperator">
                    {defaultAoi?.features[0].properties.name}
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
                <h3 className="h5 mb-0">{t('Personal Details')}</h3>
              </CardTitle>
              <Formik
                enableReinitialize={true}
                initialValues={formInit}
                validationSchema={myProfileSchema}
                onSubmit={(values, { setSubmitting }) => {
                  dispatch(
                    updateUserProfile({
                      ...user,
                      profile: {
                        ...user.profile,
                        user: {
                          ...user.profile.user,
                          firstName: values.firstName,
                          lastName: values.lastName,
                        },
                      },
                    }),
                  );
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
                  <Form className="p-3" onSubmit={handleSubmit} noValidate>
                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="formrow-email-Input">
                            {t('First Name')}
                          </Label>
                          <Input
                            type="text"
                            id="firstName"
                            className={getError('firstName', errors, touched)}
                            name="firstName"
                            placeholder="First name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.firstName}
                            autoComplete="on"
                            data-testid="update-profile-firstName"
                          />
                          {getError('firstName', errors, touched, false)}
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="clearfix mb-3">
                          <Label htmlFor="formrow-password-Input">
                            {t('Last Name')}
                          </Label>
                          <Input
                            type="text"
                            id="lastName"
                            className={getError('lastName', errors, touched)}
                            name="lastName"
                            placeholder="Last name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.lastName}
                            autoComplete="on"
                            data-testid="update-profile-lastName"
                          />
                          {getError('lastName', errors, touched, false)}
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="formrow-password-Input">
                            {t('Organization', { ns: 'common' })}
                          </Label>
                          <Input
                            type="text"
                            id="organization"
                            className={getError(
                              'organization',
                              errors,
                              touched,
                            )}
                            name="organization"
                            value={values.organization}
                            data-testid="update-profile-org"
                            disabled={true}
                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="formrow-password-Input">
                            {t('Role')}
                          </Label>
                          <Input
                            type="text"
                            id="role"
                            className={getError('role', errors, touched)}
                            name="role"
                            value={values.role}
                            data-testid="update-profile-role"
                            disabled={true}
                          />
                        </div>
                      </Col>
                    </Row>
                    <div className="text-center">
                      <button
                        type="submit"
                        data-testid="updateProfileButton"
                        className="btn btn-primary w-md me-2"
                        disabled={isSubmitting}
                      >
                        {t('update-details')}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary w-md"
                        onClick={() => {
                          tog_modal();
                        }}
                        data-toggle="modal"
                      >
                        {t('delete-account')}
                      </button>
                      <Modal
                        isOpen={modal_backdrop}
                        toggle={() => {
                          tog_modal();
                        }}
                        scrollable={true}
                        id="staticBackdrop"
                      >
                        <div className="modal-header">
                          <h5 className="modal-title" id="staticBackdropLabel">
                            {t('Warning', { ns: 'common' })}!
                          </h5>
                          <button
                            type="button"
                            className="btn-close"
                            onClick={() => {
                              setmodal_backdrop(false);
                            }}
                            aria-label="Close"
                          ></button>
                        </div>
                        <div className="modal-body">
                          <p>{t('confirm-delete-text')}.</p>
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-light"
                            onClick={() => {
                              setmodal_backdrop(false);
                            }}
                          >
                            {t('Close', { ns: 'common' })}
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                              confirmAccDelete();
                            }}
                          >
                            {t('Yes', { ns: 'common' })}
                          </button>
                        </div>
                      </Modal>
                    </div>
                  </Form>
                )}
              </Formik>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

UpdateProfile.propTypes = {
  t: PropTypes.any,
};

export default withTranslation(['myprofile'])(UpdateProfile);
