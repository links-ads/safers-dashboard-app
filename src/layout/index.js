import React from 'react';

import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import {
  refreshOAuthToken,
  tokenLastUpdatedSelector,
  tokenExpiresInSelector,
} from 'store/authentication/authentication.slice';

import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';
import { GENERAL } from '../constants/common';
import useTimeout from '../customHooks/useTimeout';
import PollingHelper from '../helpers/pollingHelper';

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const tokenLastUpdated = useSelector(tokenLastUpdatedSelector);
  const tokenExpiresIn = useSelector(tokenExpiresInSelector);

  const interval =
    (tokenExpiresIn - GENERAL.API_GAP) * GENERAL.MILLISEC_TO_SECOND;
  useTimeout(
    () => {
      dispatch(refreshOAuthToken());
    },
    interval,
    [tokenLastUpdated],
  );

  return (
    <div id="layout-wrapper">
      <Header />
      <Sidebar />
      <PollingHelper>
        <div className="main-content">{children}</div>
      </PollingHelper>
      <Footer />
    </div>
  );
};

Layout.propTypes = {
  changeSidebarType: PropTypes.func,
  children: PropTypes.object,
  leftSideBarType: PropTypes.any,
};

export default Layout;
