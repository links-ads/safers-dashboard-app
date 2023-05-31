import React, { useEffect } from 'react';

import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col } from 'reactstrap';
import toastr from 'toastr';

import { organisationsSelector, rolesSelector } from 'store/common.slice';
import {
  resetStatus,
  userInfoSelector,
  updateStatusSelector,
} from 'store/user.slice';

import 'toastr/build/toastr.min.css';
import { Profile } from './Profile';
import { ProfileForm } from './ProfileForm';

toastr.options = {
  preventDuplicates: true,
};

const UpdateProfile = ({ t }) => {
  const updateStatus = useSelector(updateStatusSelector);
  const user = useSelector(userInfoSelector);
  const roles = useSelector(rolesSelector);
  const organizations = useSelector(organisationsSelector);

  const dispatch = useDispatch();

  const usersRole = roles.find(role => role.name === user?.role);
  const usersOrganization = organizations.find(
    organization => organization.name === user?.organization,
  );

  useEffect(() => {
    if (updateStatus) {
      toastr.success(t('updated-info', { ns: 'common' }), '');
      dispatch(resetStatus());
    }
  }, [dispatch, t, updateStatus]);

  if (!user) {
    return null;
  }

  return (
    <Row>
      <Col lg={4}>
        <Profile
          user={user}
          usersRole={usersRole}
          usersOrganization={usersOrganization}
        />
      </Col>
      <Col lg={8}>
        <ProfileForm
          user={user}
          usersRole={usersRole}
          usersOrganization={usersOrganization}
        />
      </Col>
    </Row>
  );
};

UpdateProfile.propTypes = {
  t: PropTypes.any,
};

export default withTranslation(['myprofile'])(UpdateProfile);
