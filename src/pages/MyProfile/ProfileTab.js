import React from 'react';

import classnames from 'classnames';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { NavItem, NavLink } from 'reactstrap';

const ProfileTab = ({
  t,
  customActiveTab,
  thisTabId,
  toggleCustom,
  title,
  iconClass,
}) => {
  return (
    <NavItem>
      <NavLink
        style={{ cursor: 'pointer' }}
        className={classnames({
          active: customActiveTab === thisTabId,
        })}
        onClick={() => {
          toggleCustom(thisTabId);
        }}
      >
        <span className="d-none d-sm-block me-2">
          <i className={`fas ${iconClass}`}></i>
        </span>
        <span className="d-block">{t(title)}</span>
      </NavLink>
    </NavItem>
  );
};

ProfileTab.propTypes = {
  t: PropTypes.func,
  customActiveTab: PropTypes.string,
  thisTabId: PropTypes.string,
  toggleCustom: PropTypes.func,
  title: PropTypes.string,
  iconClass: PropTypes.string,
};

export default withTranslation(['myprofile'])(ProfileTab);
