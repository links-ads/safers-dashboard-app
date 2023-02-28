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

import ProfileTab from './ProfileTab';
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
                <ProfileTab
                  customActiveTab={customActiveTab}
                  thisTabId={'1'}
                  toggleCustom={toggleCustom}
                  title={'My Profile'}
                  iconClass="fa-user-alt"
                ></ProfileTab>
                <ProfileTab
                  customActiveTab={customActiveTab}
                  thisTabId={'2'}
                  toggleCustom={toggleCustom}
                  title={'Change Password'}
                  iconClass="fa-lock"
                ></ProfileTab>
                <ProfileTab
                  customActiveTab={customActiveTab}
                  thisTabId={'3'}
                  toggleCustom={toggleCustom}
                  title={'Area of Interest'}
                  iconClass="fa-flag-checkered"
                ></ProfileTab>
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
