import React, { useState } from 'react';
import { Nav, Row, Col, NavItem, NavLink, TabPane, TabContent } from 'reactstrap';
import DataLayer from './DataLayer';
import OnDemandDataLayer from './OnDemandDataLayer';

const DataLayerDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  return(
    <div className='page-content'>
      <div className='mx-2 sign-up-aoi-map-bg'>
        <Row>
          <Col xl={5} className='mb-3'>
            <Row>
              <Col xl={4}><h4>Data Layers</h4></Col>
              <Col xl={8}>
                <Nav className='d-flex flex-nowrap' pills fill>
                  <NavItem>
                    <NavLink
                      className={{'active': activeTab===0}}
                      onClick={()=>setActiveTab(0)}
                    >
                Operational Map Layers
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={{'active': activeTab===1}}
                      onClick={()=>setActiveTab(1)}
                    >
                On-Demand Map Layers
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
            </Row>
          </Col>
          <Col xl={7}/>
        </Row>
        <TabContent activeTab={activeTab}>
          <TabPane tabId={0}>
            <DataLayer />
          </TabPane>
          <TabPane tabId={1}>
            <OnDemandDataLayer />
          </TabPane>
        </TabContent>
      </div>
    </div>
  );
};

export default DataLayerDashboard;
