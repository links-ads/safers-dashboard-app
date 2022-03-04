import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import SignIn from './SignIn';
import SignUp from './SignUp';

const Authentication = () => {
  const DEFAULT_ACTIVE_TAB = 'sign-in';
  const { activeTab } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!activeTab) {
      navigate(`/auth/${DEFAULT_ACTIVE_TAB}`);
    }
  }, []);

  const toggleTab = tab => {
    if (activeTab !== tab) {
      navigate(`/auth/${tab}`);
    }
  }
  return (
    <div>
      <Nav tabs>
        <NavItem>
          <NavLink className={activeTab == 'sign-in' ? 'active' : ''} onClick={() => toggleTab('sign-in')}>
            SIGN IN
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className={activeTab == 'sign-up' ? 'active' : ''} onClick={() => toggleTab('sign-up')}>
            SIGN UP
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane title='SIGN IN' tabId="sign-in"><SignIn /></TabPane>
        <TabPane title='SIGN UP' tabId="sign-up"><SignUp /></TabPane>
      </TabContent>
    </div>
  );
}

export default Authentication;
