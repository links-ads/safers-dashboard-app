import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Input, Card, InputGroup, InputGroupText } from 'reactstrap';
import { BitmapLayer } from 'deck.gl';

import BaseMap from '../../components/BaseMap/BaseMap';

import TreeView from './TreeView';
import { formatDate } from '../../store/utility';

import { withTranslation } from 'react-i18next'
import 'react-rangeslider/lib/index.css'
import SimpleBar from 'simplebar-react';

const DataLayer = ({ 
  t,
  setLayerSource,
  sourceOptions,
  domainOptions,
  layerSource,
  operationalMapLayers,
  dataDomain,
  setDataDomain,
  sortByDate,
  setSortByDate,
  handleResetAOI,
  setCurrentLayer,
  getSlider,
  getLegend,
  bitmapLayer,
  viewState,
  timestamp
}) => {
  const [searchedDataLayers, setSearchedDataLayers] = useState(null);

  // places fetched data layers into local state, 
  // so that search filtering can then be applied
  useEffect(() => {
    if (!searchedDataLayers?.length) {
      setSearchedDataLayers(operationalMapLayers);
    }
  }, [operationalMapLayers]);

  const handleSearch = ({ target: { value } }) => {
    if (!value) setSearchedDataLayers(operationalMapLayers);
  
    const searchResult = operationalMapLayers.filter(
      layer => layer.text.toLowerCase().includes(value.toLowerCase())
    );
  
    setSearchedDataLayers(searchResult);
  };

  const getCurrentTimestamp = () => (
    timestamp ? (
      <div className='timestamp-container'>
        <p className='timestamp-display'>
          {formatDate(timestamp)}
        </p>
      </div>
    ) : null
  );

  return (
    <Row>
      <Col xl={5}>
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
                  <option value={''} >Domain: All</option>
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
              <TreeView
                data={searchedDataLayers}
                setCurrentLayer={setCurrentLayer}
              />
            </SimpleBar>
          </Col>
        </Row>
      </Col>
      <Col xl={7} className='mx-auto'>
        <Card className='map-card mb-0' style={{ height: 670 }}>
          <BaseMap
            layers={[new BitmapLayer(bitmapLayer)]}
            initialViewState={viewState}
            widgets={[]}
            screenControlPosition='top-right'
            navControlPosition='bottom-right'
          />
          {getSlider()}
          {getLegend()}
          {getCurrentTimestamp()}
        </Card>
      </Col>
    </Row>
  )
}

DataLayer.propTypes = {
  t: PropTypes.any,
  setLayerSource: PropTypes.any,
  sourceOptions: PropTypes.array,
  domainOptions: PropTypes.array,
  layerSource: PropTypes.any,
  operationalMapLayers: PropTypes.any,
  dataDomain: PropTypes.any,
  setDataDomain: PropTypes.any,
  sortByDate: PropTypes.any,
  setSortByDate: PropTypes.any,
  handleResetAOI: PropTypes.any,
  setCurrentLayer: PropTypes.any,
  getSlider: PropTypes.any,
  getLegend: PropTypes.any,
  bitmapLayer: PropTypes.any,
  viewState: PropTypes.any,
  timestamp: PropTypes.string
}

export default withTranslation(['common'])(DataLayer);
