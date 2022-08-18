import React, { useState } from 'react';
import { Nav, Row, Col, NavItem, NavLink, TabPane, TabContent } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import DataLayer from './DataLayer';
import OnDemandDataLayer from './OnDemandDataLayer';

const dataLayerPanels = {
  DATA_LAYER: 0,
  ON_DEMAND_DATA_LAYER: 1,
  FIRE_AND_BURNED_AREA:2,
  POST_EVENT_MONITORING: 3,
  WILDfIRE_SIMULATION: 4,
}

const DataLayerDashboard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(dataLayerPanels.DATA_LAYER);

  const searchDataLayers = (value, data, callback) => {
    if (!value) callback(data);
  
    // 'text' property is used as it appears in 
    // both Operational and On-Demand layers
    const searchResult = data.filter(
      layer => layer.text.toLowerCase().includes(value.toLowerCase())
    );
  
    callback(searchResult);
  };

  return(
    <div className='page-content'>
      <div className='mx-2 sign-up-aoi-map-bg'>
        <Row>
          <Col xl={5} className='mb-3'>
            <Row>
              <Col xl={4}><h4>{t('Data Layers')}</h4></Col>
              <Col xl={8}>
                <Nav className='d-flex flex-nowrap' pills fill>
                  <NavItem>
                    <NavLink
                      className={{'active': activeTab===0}}
                      onClick={()=>setActiveTab(0)}
                    >
                      {t('Operational Map Layers')}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={{'active': activeTab===1}}
                      onClick={()=>setActiveTab(1)}
                    >
                      {t('On-Demand Map Layers')}
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
            </Row>
          </Col>
          <Col xl={7}/>
        </Row>
        <TabContent activeTab={activeTab}>
          <TabPane tabId={dataLayerPanels.DATA_LAYER}>
            <DataLayer t={t} searchDataLayers={searchDataLayers} />
          </TabPane>
          <TabPane tabId={dataLayerPanels.ON_DEMAND_DATA_LAYER}>
            <OnDemandDataLayer
              t={t}
              setActiveTab={setActiveTab} 
              dataLayerPanels={dataLayerPanels}
              searchDataLayers={searchDataLayers}
            />
          </TabPane>
          <TabPane tabId={dataLayerPanels.FIRE_AND_BURNED_AREA}>
            <div>Fire and Burned Area form.</div>
          </TabPane>
          <TabPane tabId={dataLayerPanels.POST_EVENT_MONITORING}>
            <div>Post Event Monitoring</div>
          </TabPane>
          <TabPane tabId={dataLayerPanels.WILDfIRE_SIMULATION}>
            <div>Wildfire Simulation</div>
          </TabPane>
        </TabContent>
      </div>
    </div>
  );
};

export default DataLayerDashboard;
