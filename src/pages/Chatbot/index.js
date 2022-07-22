import React , { useState } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane, Container } from 'reactstrap';

import classnames from 'classnames';
import { useTranslation } from 'react-i18next';
import People from './People';
import Reports from './Reports';
import Comms from './Comms';
import Missions from './Missions';

const Chatbot = () => {

  const [customActiveTab, setCustomActiveTab] = useState('4');
  const { t } = useTranslation();

  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setCustomActiveTab(tab)
    }
  }

  const renderContent = (tab) => {
    if(customActiveTab !== tab) {
      return null;
    }

    switch(tab) {
    case '1': 
      return <People />;
    case '2':
      return <Comms />;
    case '3':
      return <Missions />;
    case '4':
      return <Reports />;
    }
  }

  return (
    <div className='page-content'>
      <Container fluid className='chatbot p-0'>
        <div className='tab-container p-3'>
          <Nav tabs className='nav-default nav-tabs-custom nav-justified'>
            <NavItem>
              <NavLink
                style={{ cursor: 'pointer' }}
                className={classnames({
                  active: customActiveTab === '1',
                })}
                onClick={() => {
                  toggleCustom('1')
                }}
              >
                <span className='d-none d-sm-block me-2'><i className='fas fa-user-alt'></i></span>
                <span className='d-block'>{t('People')}</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                style={{ cursor: 'pointer' }}
                className={classnames({
                  active: customActiveTab === '2',
                })}
                onClick={() => {
                  toggleCustom('2')
                }}
                data-testid="updateProfilePasswordBtn"
              >
                <span className='d-none d-sm-block me-2'><i className='fas fa-envelope'></i></span>
                <span className='d-block'>{t('Comms')}</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                style={{ cursor: 'pointer' }}
                className={classnames({
                  active: customActiveTab === '3',
                })}
                onClick={() => {
                  toggleCustom('3')
                }}
              >
                <span className='d-none d-sm-block me-2'><i className='fas fa-flag-checkered'></i></span>
                <span className='d-block'>{t('Mission', { ns: 'common' })}</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                style={{ cursor: 'pointer' }}
                className={classnames({
                  active: customActiveTab === '4',
                })}
                onClick={() => {
                  toggleCustom('4')
                }}
              >
                <span className='d-none d-sm-block me-2'><i className='fas fa-file-image'></i></span>
                <span className='d-block'>{t('Reports', { ns: 'common' })}</span>
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={customActiveTab} className="p-3">
            <TabPane tabId="1">              
              {renderContent('1')}
            </TabPane>
            <TabPane tabId="2">
              {renderContent('2')}
            </TabPane>
            <TabPane tabId="3">
              {renderContent('3')}
            </TabPane>
            <TabPane tabId="4">
              {renderContent('4')}
            </TabPane>
          </TabContent>
        </div>
      </Container>
    </div >

  );
}

export default Chatbot;
