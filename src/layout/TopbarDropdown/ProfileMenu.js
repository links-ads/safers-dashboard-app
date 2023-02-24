import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import { signOut } from 'store/authentication.slice';
import { userInfoSelector } from 'store/user.slice';

import user1 from '../../assets/images/users/profile.png';

//i18n

// users

const ProfileMenu = props => {
  // Declare a new state variable, which we'll call 'menu'
  const [menu, setMenu] = useState(false);

  const dispatch = useDispatch();
  const { username } = useSelector(userInfoSelector);

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item "
          id="page-header-user-dropdown"
          tag="button"
        >
          <img
            className="rounded-circle header-profile-user"
            src={user1}
            alt="Header Avatar"
          />
          <span className="d-none d-xl-inline-block ms-2 me-1 text-capitalize">
            {username}
          </span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem tag="a" href="/my-profile/view">
            {' '}
            <i className="bx bx-user font-size-16 align-middle me-1" />
            <span className="text-capitalize">{props.t('profile')} </span>
          </DropdownItem>
          <div className="dropdown-divider" />
          <DropdownItem
            className="clickable"
            tag="span"
            onClick={() => {
              dispatch(signOut());
            }}
          >
            {' '}
            <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger logout" />
            <span className="text-capitalize">{props.t('logout')} </span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any,
};

export default withTranslation(['common'])(ProfileMenu);
