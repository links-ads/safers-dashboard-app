import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Nav, NavItem, NavLink, TabContent, TabPane, Container, Row, Col } from 'reactstrap';
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
      <Container fluid className="p-0">
        <Row className="g-0">
          <Col xl={6}>
            <div className="auth-full-bg pt-lg-5 p-4">
              <div className="w-100">
                <div className="bg-overlay"></div>
              </div>
            </div>
          </Col>
          <Col xl={6}>
            <div className="auth-full-page-content p-md-5 p-4">
              <div className="w-100">
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
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Authentication;
