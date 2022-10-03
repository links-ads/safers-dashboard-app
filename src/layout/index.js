import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import PollingHelper from '../helpers/pollingHelper';
import { refreshOAuthToken } from '../store/appAction';

const Layout = ({leftSideBarType, changeSidebarType, children}) => {

  const MILLISECONDS = 1000;
  const dispatch = useDispatch();
  const [isMobile] = useState(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  const { tokenExpiresIn, tokenUpdatedLast } = useSelector(state => state.auth);

  useEffect(() => {
    const interval_val = tokenExpiresIn;
    if(interval_val) {
      const interval = interval_val - 3; //reduce 3 seconds so the request is made before expiry 
      const timer = setTimeout(() => {
        dispatch(refreshOAuthToken());
      }, interval * MILLISECONDS);
      return () => clearTimeout(timer);
    }
  }, [tokenExpiresIn, tokenUpdatedLast]);

  const toggleMenuCallback = () => {
    if (leftSideBarType === 'default') {
      changeSidebarType('condensed', isMobile)
    } else if (leftSideBarType === 'condensed') {
      changeSidebarType('default', isMobile)
    }
  }

  return (
    <>
      <div id='layout-wrapper'>
        <Header toggleMenuCallback={toggleMenuCallback} />
        <Sidebar />
        <PollingHelper>
          <div className='main-content'>{children}</div>
        </PollingHelper>
        <Footer />
      </div>
    </>
  )

}


Layout.propTypes = {
  changeSidebarType: PropTypes.func,
  children: PropTypes.object,
  leftSideBarType: PropTypes.any,
}



export default Layout;
