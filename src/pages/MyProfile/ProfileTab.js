import React from 'react';

import classnames from 'classnames';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { NavItem, NavLink } from 'reactstrap';

const ProfileTab = ({ t, selectedTab, tabId, toggleTab, title, iconClass }) => (
  <NavItem>
    <NavLink
      className={classnames({
        active: selectedTab === tabId,
        cursor: 'pointer',
      })}
      onClick={() => {
        toggleTab(tabId);
      }}
    >
      <span className="d-none d-sm-block me-2">
        <i className={`fas ${iconClass}`}></i>
      </span>
      <span className="d-block">{t(title)}</span>
    </NavLink>
  </NavItem>
);

ProfileTab.propTypes = {
  t: PropTypes.func,
  selectedTab: PropTypes.string,
  tabId: PropTypes.string,
  toggleTab: PropTypes.func,
  title: PropTypes.string,
  iconClass: PropTypes.string,
};

export default withTranslation(['myprofile'])(ProfileTab);
