import React, { useState } from 'react';

import classnames from 'classnames';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
} from 'reactstrap';

import ResetPsw from './ResetPsw';
import UpdateProfile from './UpdateProfile';
import AoiHelper from '../../helpers/aoiHelper';

//i18n

const MyProfile = ({ t }) => {
  const [customActiveTab, setCustomActiveTab] = useState('1');

  const toggleCustom = tab => {
    if (customActiveTab !== tab) {
      setCustomActiveTab(tab);
    }
  };

  return (
    <div className="page-content">
      <Container fluid="true" className="p-0">
        <Row className="g-0">
          <Col>
            <div className="tab-container p-3">
              <Nav tabs className="nav-default nav-tabs-custom nav-justified">
                <NavItem>
                  <NavLink
                    style={{ cursor: 'pointer' }}
                    className={classnames({
                      active: customActiveTab === '1',
                    })}
                    onClick={() => {
                      toggleCustom('1');
                    }}
                  >
                    <span className="d-none d-sm-block me-2">
                      <i className="fas fa-user-alt"></i>
                    </span>
                    <span className="d-block">{t('My Profile')}</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    style={{ cursor: 'pointer' }}
                    className={classnames({
                      active: customActiveTab === '2',
                    })}
                    onClick={() => {
                      toggleCustom('2');
                    }}
                    data-testid="updateProfilePasswordBtn"
                  >
                    <span className="d-none d-sm-block me-2">
                      <i className="fas fa-lock"></i>
                    </span>
                    <span className="d-block">{t('Change Password')}</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    style={{ cursor: 'pointer' }}
                    className={classnames({
                      active: customActiveTab === '3',
                    })}
                    onClick={() => {
                      toggleCustom('3');
                    }}
                  >
                    <span className="d-none d-sm-block me-2">
                      <i className="fas fa-flag-checkered"></i>
                    </span>
                    <span className="d-block">
                      {t('Area of Interest', { ns: 'common' })}
                    </span>
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={customActiveTab} className="p-3">
                <TabPane tabId="1">
                  <UpdateProfile />
                </TabPane>
                <TabPane tabId="2">
                  <ResetPsw />
                </TabPane>
                <TabPane tabId="3">
                  <Row>
                    <Col lg={12}>
                      <Card color="dark default-panel">
                        <CardBody>
                          <CardTitle className="mb-2 dflt-seperator">
                            <h3 className="h5 mb-0">{t('select-aoi')}</h3>
                          </CardTitle>
                          <AoiHelper />
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

MyProfile.propTypes = {
  t: PropTypes.any,
};

export default withTranslation(['myprofile'])(MyProfile);
