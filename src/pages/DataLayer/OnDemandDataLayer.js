import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Input, Card, InputGroup, InputGroupText, Modal } from 'reactstrap';
import { BitmapLayer } from 'deck.gl';
import { getDataLayerTimeSeriesData } from '../../store/appAction';
import BaseMap from '../../components/BaseMap/BaseMap';

import OnDemandTreeView from './OnDemandTreeView';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import { getIconLayer } from '../../helpers/mapHelper';
import { withTranslation } from 'react-i18next'
import SimpleBar from 'simplebar-react';
import { DATA_LAYERS_PANELS } from './constants';

const OnDemandDataLayer = ({ 
  t,
  mapRequests,
  sourceOptions,
  domainOptions,
  setActiveTab,
  setCurrentLayer,
  layerSource,
  setLayerSource,
  dataDomain,
  setDataDomain,
  sortByDate,
  setSortByDate,
  handleResetAOI, 
  getSlider,
  getLegend,
  bitmapLayer,
  viewState,
  featureInfoData,
  currentLayer,
  dispatch
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [searchedMapRequests, setSearchedMapRequests] = useState(null);  
  
  const [tempSelectedPixel, setTempSelectedPixel] = useState([]);  
  const [selectedPixel, setSelectedPixel] = useState([]);
  const [tempLayerData, setTempLayerData] = useState(null);

  // places fetched map requests into local state, 
  // so that search filtering can then be applied
  useEffect(() => {
    setSearchedMapRequests(mapRequests)
  }, [mapRequests]);

  const handleSearch = ({ target: { value } }) => {
    if (!value) setSearchedMapRequests(mapRequests);
  
    const searchResult = mapRequests.filter(
      layer => layer.category.toLowerCase().includes(value.toLowerCase())
    );
  
    setSearchedMapRequests(searchResult);
  };

  const toggleModal = () => setModalIsOpen(prev => !prev);

  const handleDialogButtonClick = ({ target: { value } }) => {
    setActiveTab(+value);
    toggleModal();
  } 

  const getPixelValue = () => {
    var valueString = '';
    if(featureInfoData?.features?.length > 0 && featureInfoData?.features[0]?.properties) {
      for (const key in featureInfoData.features[0].properties) {
        if (Object.hasOwnProperty.call(featureInfoData.features[0].properties, key)) {
          valueString = valueString+`${key}: ${featureInfoData.features[0].properties[key]}\n`;
        }
      }
    }
    return valueString;
  }  

  const clearInfo = () => {
    setSelectedPixel([]);  
    setTempLayerData(null);
  }

  const renderClearBtn = () => {
    return (
      <div className='position-absolute' style={{ top: '5px', right: '10px' }}>
        <button onClick={clearInfo} className="custom-clear-btn d-flex justify-content-center align-items-center" type="button">
          <i className="bx bx-x" style={{ fontSize: '25px' }}></i>
        </button>
      </div>
    );
  }
  
  const toggleDisplayLayerInfo = () => {
    setSelectedPixel(tempSelectedPixel);
    apiFetch('GetFeatureInfo');
  }

  const apiFetch = (requestType) => {
    var tempUrl = ''
    if(requestType == 'GetFeatureInfo') {
      tempUrl = currentLayer.pixel_url.replace('{bbox}', `${tempSelectedPixel[0]},${tempSelectedPixel[1]},${tempSelectedPixel[0]+0.0001},${tempSelectedPixel[1]+0.0001}`);
    }
    dispatch(getDataLayerTimeSeriesData(tempUrl, requestType));
  }

  const generateGeoJson = (data)=> {    
    const layer = getIconLayer(
      [{ geometry: { coordinates : data.coordinate} }], 
      null, 
      'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png', 
      {
        getSize: () => 5,
        iconMapping: {
          marker: {
            x: 0,
            y: 0,
            width: 128,
            height: 128,
            anchorY: 128,
            mask: true
          }
        },
        sizeScale: 8,
        sizeMinPixels: 40,
        sizeMaxPixels: 40,
        getColor: () => [57, 58, 58],
      }
    );
    setTempLayerData(layer);
    setTempSelectedPixel(data.coordinate);
  }

  return (
    <>
      <Modal
        centered
        isOpen={modalIsOpen}
        toggle={toggleModal}
        id="data-layer-dialog"
        style={{ maxWidth: '50rem' }}
      >
        <div className='d-flex flex-column align-items-center p-5'>
          <h2>{t('Select Data Type')}</h2>
          <div className='d-flex flex-nowrap gap-5 my-5'>
            <button
              value={DATA_LAYERS_PANELS.fireAndBurnedAreas} 
              onClick={handleDialogButtonClick}
              className='data-layers-dialog-btn'
            >
              {t('Fire and Burned Area')}
            </button>
            <button 
              value={DATA_LAYERS_PANELS.postEventMonitoring} 
              onClick={handleDialogButtonClick}
              className='data-layers-dialog-btn'
            >
              {t('Post Event Monitoring')}
            </button>
            <button
              value={DATA_LAYERS_PANELS.wildfireSimulation} 
              onClick={handleDialogButtonClick}
              className='data-layers-dialog-btn'
            >
              {t('Wildfire Simulation')}
            </button>
          </div>
          <button 
            onClick={toggleModal}
            className='data-layers-dialog-cancel'
          >
            {t('Cancel')}
          </button>
        </div>
      </Modal>
      <Row>
        <Col xl={5}>
          <Row xl={12}>
            <Col>
              <div className='d-flex justify-content-end'>
                <Button 
                  className="request-map btn-orange mb-3" 
                  onClick={toggleModal}>
                  {t('Request a map')}
                </Button>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xl={10}>
              <Row>
                <Col xl={4}>
                  <Input
                    id="sortByDate"
                    className="btn-sm sort-select-input"
                    name="sortByDate"
                    placeholder="Sort By : Date"
                    type="select"
                    onChange={(e) => setSortByDate(e.target.value)}
                    value={sortByDate}
                  >
                    <option value={'-date'} >{t('Sort By')} : {t('Date')} {t('desc')}</option>
                    <option value={'date'} >{t('Sort By')} : {t('Date')} {t('asc')}</option>
                  </Input>
                </Col>
                <Col xl={4}>
                  <Input
                    id="layerSource"
                    className="btn-sm sort-select-input"
                    name="layerSource"
                    placeholder="layerSource"
                    type="select"
                    onChange={(e) => setLayerSource(e.target.value)}
                    value={layerSource}
                  >
                    <option value={''} >Source: All</option>
                    {sourceOptions?.map((option) => (
                      <option key={option} value={option}>
                          Source: {option}
                      </option>
                    )) ?? []}
                  </Input>
                </Col>
                <Col xl={4}>
                  <Input
                    id="dataDomain"
                    className="btn-sm sort-select-input"
                    name="dataDomain"
                    placeholder="Domain"
                    type="select"
                    onChange={(e) => setDataDomain(e.target.value)}
                    value={dataDomain}
                  >
                    <option value={''} >Domain : All</option>
                    {domainOptions?.map((option) => (
                      <option key={option} value={option}>
                          Domain: {option}
                      </option>
                    )) ?? []}
                  </Input>
                </Col>
              </Row>
            </Col>
            <Col xl={2} className="d-flex justify-content-end align-items-center">
              <Button color='link'
                onClick={handleResetAOI} className='p-0'>
                {t('default-aoi')}
              </Button>
            </Col>
          </Row>
          <hr />
          <Row className='mb-3'>
            <Col xl={12}>
              <InputGroup>
                <InputGroupText className='border-end-0'>
                  <i className='fa fa-search' />
                </InputGroupText>
                <Input
                  id="searchEvent"
                  name="searchEvent"
                  placeholder="Search by keyword"
                  autoComplete="on"
                  onChange={handleSearch}
                />
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <SimpleBar style={{ 
                maxHeight: '500px', 
                margin: '5px', 
                zIndex: '100' 
              }}>
                <OnDemandTreeView
                  data={searchedMapRequests}
                  setCurrentLayer={setCurrentLayer}
                />
              </SimpleBar>
            </Col>
          </Row>
        </Col>
        <Col xl={7} className='mx-auto'>
          <Card className='map-card mb-0' style={{ height: 670 }}>
            <ContextMenuTrigger id={'OnDemandDataLayerMapMenu'}>
              <BaseMap
                layers={[new BitmapLayer(bitmapLayer), tempLayerData]}
                initialViewState={viewState}
                widgets={[]}
                screenControlPosition='top-right'
                navControlPosition='bottom-right'
                onClick={generateGeoJson}
              />
            </ContextMenuTrigger>
            <ContextMenu id={'OnDemandDataLayerMapMenu'} className="geo-menu">
              {currentLayer?.id && <MenuItem className="geo-menuItem" onClick={toggleDisplayLayerInfo}>
                    Get Feature Info
              </MenuItem>}
            </ContextMenu>
            {getSlider()}
            {getLegend()}
          </Card>
        </Col>
      </Row>
      
      {selectedPixel?.length > 0 && <div className='mt-2 sign-up-aoi-map-bg position-relative'>
        {getPixelValue()}
        {renderClearBtn()}
      </div>}
    </>
  );
}

OnDemandDataLayer.propTypes = {
  t: PropTypes.any,
  mapRequests: PropTypes.any,
  sourceOptions: PropTypes.array,
  domainOptions: PropTypes.array,
  setActiveTab: PropTypes.func,
  setCurrentLayer: PropTypes.any,
  layerSource: PropTypes.any,
  setLayerSource: PropTypes.any,
  dataDomain: PropTypes.any,
  setDataDomain: PropTypes.any,
  sortByDate: PropTypes.any,
  setSortByDate: PropTypes.any,
  getSlider: PropTypes.any,
  getLegend: PropTypes.any,
  bitmapLayer: PropTypes.any,
  viewState: PropTypes.any,
  handleResetAOI: PropTypes.any,
  featureInfoData: PropTypes.any,
  currentLayer: PropTypes.any,
  dispatch: PropTypes.any
}

export default withTranslation(['common'])(OnDemandDataLayer);
