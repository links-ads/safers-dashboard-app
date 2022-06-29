import React, { useState } from 'react';
import { Nav, NavItem, NavLink, TabPane, TabContent } from 'reactstrap';
import DataLayer from './DataLayer';

// eslint-disable-next-line react/prop-types
const DataLayerDashboard = ({ t }) => {
  const [activeTab, setActiveTab] = useState('0');
  console.log('activeTab', activeTab);
  console.log('t', t);
  return(
    <div className='page-content'>
      <div className='mx-2 sign-up-aoi-map-bg'>
        <div className='col-xl-5'>
          {/* <p className='align-self-baseline alert-title'>{t('Data Layers', { ns: 'dataLayers' })}</p> */}
          <h4 lassName='align-self-baseline alert-title'>Data Layers</h4>
          <Nav pills fill>
            <NavItem>
              <NavLink
                className={{'active': activeTab===0}}
                onClick={()=>setActiveTab('0')}
              >
                Operational Map Layers
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={{'active': activeTab===1}}
                onClick={()=>setActiveTab('1')}
              >
                On-Demand Map Layers
              </NavLink>
            </NavItem>
          </Nav>
        </div>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="0">
            <DataLayer />
          </TabPane>
          <TabPane tabId="1">
            <div className='mx-2 sign-up-aoi-map-bg'>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nisi quis eleifend quam adipiscing. Odio eu feugiat pretium nibh ipsum consequat nisl vel pretium. Imperdiet dui accumsan sit amet nulla facilisi morbi. In nisl nisi scelerisque eu ultrices vitae auctor eu augue. Euismod nisi porta lorem mollis aliquam ut porttitor leo a. Cras fermentum odio eu feugiat pretium nibh ipsum consequat. Suspendisse in est ante in nibh. Bibendum at varius vel pharetra. Quisque non tellus orci ac auctor augue mauris. Quam vulputate dignissim suspendisse in est. Adipiscing elit pellentesque habitant morbi tristique.</p>
            </div>
          </TabPane>
        </TabContent>
      </div>
    </div>
  );
};

export default DataLayerDashboard;