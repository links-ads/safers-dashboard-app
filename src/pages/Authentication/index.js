import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Nav, NavItem, NavLink, TabContent, TabPane, Container, Row, Col } from 'reactstrap';
import SignIn from './SignIn';
import SignUp from './SignUp';

import logodark from '../../assets/images/background-light-logo.png'
import logolight from '../../assets/images/background-light-logo.png'

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
      <Container fluid className="p-0" data-test="containerComponent">
        <Row className="g-0">
          <Col xl={7} className="bg-overlay">
            <p data-test="overlay-text"> Structured Approaches for<br></br>
                  Forest fire Emergencies<br></br> in Resilient Societies</p>
    
          </Col>
          <Col xl={5}>
            <div className="auth-full-page-content">
              <div className="w-100">
                <div className="mb-4 mb-md-5">
                  <div className="d-block auth-logo">
                    <img
                      src={logodark}
                      alt=""
                      
                      className="auth-logo-dark"
                    />
                    <img
                      src={logolight}
                      alt=""
                      
                      className="auth-logo-light"
                    />
                  </div>
                </div>
                <div className='tab-container'>
                  <Nav tabs className='nav-tabs-custom'>
                    <NavItem>
                      <NavLink data-test="sign-in-tab" className={activeTab == 'sign-in' ? 'active' : ''} onClick={() => toggleTab('sign-in')}>
                      SIGN IN
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink data-test="sign-up-tab" className={activeTab == 'sign-up' ? 'active' : ''} onClick={() => toggleTab('sign-up')}>
                      SIGN UP
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent activeTab={activeTab}>
                    <TabPane title='SIGN IN' tabId="sign-in"><SignIn /></TabPane>
                    <TabPane title='SIGN UP' tabId="sign-up"><SignUp /></TabPane>
                  </TabContent>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Authentication;
