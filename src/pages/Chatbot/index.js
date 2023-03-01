import React, { useEffect, useState } from 'react';

import classnames from 'classnames';
import { useTranslation, withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Container,
} from 'reactstrap';

import { GENERAL } from 'constants/common';
import { configSelector } from 'store/common.slice';
import { userInfoSelector } from 'store/user.slice';

import Comms from './Comms';
import Missions from './Missions';
import People from './People';
import Reports from './Reports';

const ChatbotTab = ({
  selectedTab,
  tabId,
  title,
  iconClass,
  isDisabled = false,
}) => {
  const navigate = useNavigate();

  return (
    <NavItem className={isDisabled ? 'disabled' : ''}>
      <NavLink
        className={classnames({
          active: selectedTab === tabId,
          cursor: 'pointer',
          disabled: isDisabled ? 'disabled' : '',
        })}
        onClick={() => {
          navigate(`/chatbot?tab=${tabId}`);
        }}
      >
        <span className="d-none d-sm-block me-2">
          <i className={`fas ${iconClass}`}></i>
        </span>
        <span className="d-block">{title}</span>
      </NavLink>
    </NavItem>
  );
};

const Chatbot = () => {
  const [selectedTab, setSelectedTab] = useState();
  const config = useSelector(configSelector);
  const user = useSelector(userInfoSelector);
  const isProfessionalUser = user.is_professional;
  const pollingFrequency =
    config?.polling_frequency * GENERAL.MILLISEC_TO_SECOND ?? 0;
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const queryString = location.search;
    const params = new URLSearchParams(queryString);
    const tab = params.get('tab');

    if (!tab) {
      setSelectedTab('1');
    } else {
      setSelectedTab(tab);
    }
  }, [location.search]);

  const renderContent = tab => {
    if (customActiveTab !== tab) {
      return null;
    }

    switch (tab) {
      case '1':
        return <People pollingFrequency={pollingFrequency} />;
      case '2':
        return <Comms pollingFrequency={pollingFrequency} />;
      case '3':
        return <Missions pollingFrequency={pollingFrequency} />;
      case '4':
        return <Reports pollingFrequency={pollingFrequency} />;
      default:
        throw new Error('Unknown tab');
    }
  };

  return (
    <div className="page-content">
      <Container fluid="true" className="chatbot p-0">
        <div className="tab-container p-3">
          <Nav tabs className="nav-default nav-tabs-custom nav-justified">
            <ChatbotTab
              selectedTab={selectedTab}
              tabId="1"
              title={t('people', { ns: 'common' })}
              iconClass="fa-user-alt"
            />

            <ChatbotTab
              selectedTab={selectedTab}
              tabId="2"
              title={t('Communications', { ns: 'common' })}
              iconClass="fa-envelope"
            />

            <ChatbotTab
              selectedTab={selectedTab}
              tabId="3"
              title={t('mission', { ns: 'common' })}
              iconClass="fa-checkered"
              isDisabled={!isProfessionalUser}
            />

            <ChatbotTab
              selectedTab={selectedTab}
              tabId="4"
              title={t('Reports', { ns: 'common' })}
              iconClass="fa-file-image"
            />
          </Nav>
          <TabContent activeTab={customActiveTab} className="p-3">
            <TabPane tabId="1">{renderContent('1')}</TabPane>
            <TabPane tabId="2">{renderContent('2')}</TabPane>
            <TabPane tabId="3">{renderContent('3')}</TabPane>
            <TabPane tabId="4">{renderContent('4')}</TabPane>
          </TabContent>
        </div>
      </Container>
    </div>
  );
};

export default withTranslation(['common'])(Chatbot);
