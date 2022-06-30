import React, { useState } from 'react';
import { Nav, Row, Col, NavItem, NavLink, TabPane, TabContent } from 'reactstrap';
import DataLayer from './DataLayer';
import OnDemandDataLayer from './OnDemandDataLayer';

const DataLayerDashboard = () => {
  const [activeTab, setActiveTab] = useState('0');
  
  return(
    <div className='page-content'>
      <div className='mx-2 sign-up-aoi-map-bg'>
        <container className='col-xl-8'>
          <Row>
            <Col><h4>Data Layers</h4></Col>
          </Row>
          <Row>
            <Col>
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
            </Col>
            <Col />
            <Col />
            <Col />
          </Row> 
        </container>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="0">
            <DataLayer />
          </TabPane>
          <TabPane tabId="1">
            <div className='mx-2 sign-up-aoi-map-bg'>
              <OnDemandDataLayer />
            </div>
          </TabPane>
        </TabContent>
      </div>
    </div>
  );
};

export default DataLayerDashboard;