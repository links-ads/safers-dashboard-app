import React, { useState } from 'react';

import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Form,
  Label,
  Input,
} from 'reactstrap';
import * as Yup from 'yup';

import { getError } from 'helpers/errorHelper';
import { updateUserProfile } from 'store/user.slice';

import { DeleteAccountModal } from './DeleteAccountModal';

export const ProfileForm = ({ user, usersRole, usersOrganization }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const formInit = {
    firstName: user?.profile?.user?.firstName ?? '',
    lastName: user?.profile?.user?.lastName ?? '',
    organization: usersOrganization?.title ?? '',
    role: usersRole?.title ?? '',
  };

  const myProfileSchema = Yup.object().shape({
    firstName: Yup.string().required(t('field-empty-err', { ns: 'common' })),
    lastName: Yup.string().required(t('field-empty-err', { ns: 'common' })),
  });

  const submitProfile = (values, { setSubmitting }) => {
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
  };

  return (
    <Card color="dark default-panel">
      <CardBody>
        <CardTitle className="mb-2 dflt-seperator">
          <h3 className="h5 mb-0">{t('Personal Details')}</h3>
        </CardTitle>
        <Formik
          enableReinitialize={true}
          initialValues={formInit}
          validationSchema={myProfileSchema}
          onSubmit={submitProfile}
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
                      {t('First Name', { ns: 'myprofile' })}
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
                      {t('Last Name', { ns: 'myprofile' })}
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
                      className={getError('organization', errors, touched)}
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
                      {t('Role', { ns: 'myprofile' })}
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
                  {t('update-details', { ns: 'myprofile' })}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary w-md"
                  onClick={() => setIsDeleteModalVisible(!isDeleteModalVisible)}
                  data-toggle="modal"
                >
                  {t('delete-account', { ns: 'myprofile' })}
                </button>
              </div>
            </Form>
          )}
        </Formik>

        <DeleteAccountModal
          user={user}
          isDeleteModalVisible={isDeleteModalVisible}
          setIsDeleteModalVisible={setIsDeleteModalVisible}
        />
      </CardBody>
    </Card>
  );
};
