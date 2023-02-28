import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import {
  Nav,
  TabContent,
  TabPane,
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
} from 'reactstrap';

import AreaOfInterestPanel from 'components/AreaOfInterestPanel';

import ProfileTab from './ProfileTab';
import ResetPsw from './ResetPsw';
import UpdateProfile from './UpdateProfile';

//i18n

const MyProfile = ({ t }) => {
  const [selectedTab, setSelectedTab] = useState('1');

  const selectTab = tab => {
    if (selectedTab !== tab) {
      setSelectedTab(tab);
    }
  };

  return (
    <div className="page-content">
      <Container fluid="true" className="p-0">
        <Row className="g-0">
          <Col>
            <div className="tab-container p-3">
              <Nav tabs className="nav-default nav-tabs-custom nav-justified">
                <ProfileTab
                  selectedTab={selectedTab}
                  tabId={'1'}
                  selectTab={selectTab}
                  title={'My Profile'}
                  iconClass="fa-user-alt"
                ></ProfileTab>
                <ProfileTab
                  selectedTab={selectedTab}
                  tabId={'2'}
                  selectTab={selectTab}
                  title={'Change Password'}
                  iconClass="fa-lock"
                ></ProfileTab>
                <ProfileTab
                  selectedTab={selectedTab}
                  tabId={'3'}
                  selectTab={selectTab}
                  title={'Area of Interest'}
                  iconClass="fa-flag-checkered"
                ></ProfileTab>
              </Nav>
              <TabContent activeTab={selectedTab} className="p-3">
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
                          <AreaOfInterestPanel />
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
