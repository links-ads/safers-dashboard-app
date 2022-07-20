import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Input, Card, InputGroup, InputGroupText } from 'reactstrap';

import BaseMap from '../../components/BaseMap/BaseMap';

import TreeView from './TreeView';

import { withTranslation } from 'react-i18next'
import 'react-rangeslider/lib/index.css'
import SimpleBar from 'simplebar-react';

const DataLayer = ({ 
  t,
  setLayerSource,
  layerSource,
  dataLayers,
  dataDomain,
  setDataDomain,
  sortByDate,
  setSortByDate,
  handleResetAOI,
  setCurrentLayer,
  getSlider,
  getLegend,
  bitmapLayer,
  viewState
}) => (
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
                <option value={''} >Source : All</option>
                <option value={'web'} >Source : Web</option>
                <option value={'camera'} >Source : Camera</option>
                <option value={'satellite'} >Source : Satellite</option>
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
                <option value={''} >Data Domain : All</option>
                <option value={'fire'} >Data Domain : Fire</option>
                <option value={'weather'} >Data Domain : Weather</option>
                <option value={'water'} >Data Domain : Water</option>
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
              placeholder="Search by relation to an event"
              autoComplete="on"
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
              data={dataLayers}
              setCurrentLayer={setCurrentLayer}
            />
          </SimpleBar>
        </Col>
      </Row>
    </Col>
    <Col xl={7} className='mx-auto'>
      <Card className='map-card mb-0' style={{ height: 670 }}>
        <BaseMap
          layers={[bitmapLayer]}
          initialViewState={viewState}
          widgets={[]}
          screenControlPosition='top-right'
          navControlPosition='bottom-right'
        />
        {getSlider()}
        {getLegend()}
      </Card>
    </Col>
  </Row>
)

export default withTranslation(['common'])(DataLayer);DataLayer.propTypes = {
  t: PropTypes.any,
  setLayerSource: PropTypes.any,
  layerSource: PropTypes.any,
  dataLayers: PropTypes.any,
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
}