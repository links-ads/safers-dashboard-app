import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Input, Card, InputGroup, InputGroupText } from 'reactstrap';

import BaseMap from '../../components/BaseMap/BaseMap';
import { resetMetaData, getDataLayerTimeSeriesData } from '../../store/appAction';

import TreeView from './TreeView';
import { formatDate } from '../../store/utility';
import highlight from 'json-format-highlight';
import { BitmapLayer } from 'deck.gl';

import { withTranslation } from 'react-i18next'
import 'react-rangeslider/lib/index.css'
import { getIconLayer } from '../../helpers/mapHelper';
import SimpleBar from 'simplebar-react';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import {
  VictoryChart,
  VictoryAxis,
  VictoryLine,
  VictoryScatter,
  VictoryTooltip,
  VictoryContainer
} from 'victory';

const DataLayer = ({ 
  t,
  setLayerSource,
  metaData,
  isMetaDataLoading,
  sourceOptions,
  domainOptions,
  layerSource,
  operationalMapLayers,
  dataDomain,
  setDataDomain,
  sortByDate,
  setSortByDate,
  handleResetAOI,
  currentLayer,
  setCurrentLayer,
  getSlider,
  getLegend,
  bitmapLayer,
  viewState,
  timestamp,
  dispatch,
  timeSeriesData,
  featureInfoData
}) => {
  const [searchedDataLayers, setSearchedDataLayers] = useState(null);

  const [tempSelectedPixel, setTempSelectedPixel] = useState([]);  
  const [selectedPixel, setSelectedPixel] = useState([]);
  const [tempLayerData, setTempLayerData] = useState(null);
  const [layerData, setLayerData] = useState(null);
  const [tickValues, setTickValues] = useState([]);
  const [chartValues, setChartValues] = useState([]);


  // places global data layers into local state, 
  // so that search filtering can then be applied
  useEffect(() => {
    setSearchedDataLayers(operationalMapLayers)
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

  useEffect(()=> {
    if(timeSeriesData) {
      const array = timeSeriesData.split('\n');
      array.splice(0,3);
      if(!array[array.length -1]) {
        array.pop();
      }
      if(array.length != 0) {
        setTickValues(array.map(x=> {
          return x.split(',')[0];
        }));

        setChartValues(array.map(data=> {
          const tempY = data.split(',')[1].replace(/\d+\.\d+/g, function(match) {
            return Number(match).toFixed(2);
          })
          return {
            x: data.split(',')[0],
            y: tempY? tempY : '0',
            label: tempY? `${tempY}, ${formatDate(data.split(',')[0])}` : '0'
          }
        }));
      } else {
        setTickValues([]);
        setChartValues([]);
      }
      
    }
  }, [timeSeriesData])

  const print = (data) => {
    
    const jsonTheme = {
      keyColor: '#ffffff',
      numberColor: '#007bff',
      stringColor: '#B3B2B2',
      trueColor: '#199891'
    };

    return <pre className="px-3">
      <code
        dangerouslySetInnerHTML={{
          __html: highlight(data, jsonTheme)
        }}
      />
    </pre>
  };

  const switchRHPanel = () => {
    if(isMetaDataLoading || metaData){
      return (
        <Card color="dark default-panel">
          <h4 className='ps-3 pt-3 mb-2'>Meta Info: <i className='meta-close' onClick={()=>{dispatch(resetMetaData());}}>x</i></h4>
          {!metaData ? <p className='p-3'>{t('Loadng')}...</p> : <SimpleBar style={{ height: 670 }}>{print(metaData)}</SimpleBar>}
        </Card>
      );
    }
    return(
      <Card className='map-card mb-0' style={{ height: 670 }}>
        <ContextMenuTrigger id={'DataLayerMapMenu'}>
          <BaseMap
            layers={[new BitmapLayer(bitmapLayer), tempLayerData]}
            initialViewState={viewState}
            widgets={[]}
            screenControlPosition='top-right'
            navControlPosition='bottom-right'
            onClick={generateGeoJson}
          />
        </ContextMenuTrigger>
        <ContextMenu id={'DataLayerMapMenu'} className="geo-menu">
          {currentLayer?.id && <><MenuItem className="geo-menuItem" onClick={toggleDisplayLayerInfo}>
                Get Feature Info
          </MenuItem>
          <MenuItem className="geo-menuItem" onClick={toggleTimeSeriesChart}>
                Time Series Chart
          </MenuItem></>}
        </ContextMenu>
        {getSlider()}
        {getLegend()}
        {getCurrentTimestamp()}
      </Card>
    );
  };

  const generateGeoJson = (data,event)=> {   
    if(event.rightButton) {
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
  }

  const apiFetch = (requestType) => {
    var tempUrl = ''
    if(requestType == 'GetTimeSeries') {
      tempUrl = currentLayer.timeseries_url.replace('{bbox}', `${tempSelectedPixel[0]},${tempSelectedPixel[1]},${tempSelectedPixel[0]+0.0001},${tempSelectedPixel[1]+0.0001}`);
    } else if(requestType == 'GetFeatureInfo') {
      tempUrl = currentLayer.pixel_url.replace('{bbox}', `${tempSelectedPixel[0]},${tempSelectedPixel[1]},${tempSelectedPixel[0]+0.0001},${tempSelectedPixel[1]+0.0001}`);
    }

    dispatch(getDataLayerTimeSeriesData(tempUrl, requestType));
  }

  const toggleDisplayLayerInfo = () => {
    setSelectedPixel(tempSelectedPixel);
    setLayerData(null);
    apiFetch('GetFeatureInfo');
  }

  const toggleTimeSeriesChart = () => {
    setSelectedPixel([]);
    setLayerData(tempLayerData);
    apiFetch('GetTimeSeries');
  }

  const clearInfo = () => {
    setSelectedPixel([]);    
    setLayerData(null);
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

  const getPixelValue = () => {
    var valueString = '';
    if(featureInfoData?.features?.length > 0 && featureInfoData?.features[0]?.properties) {
      for (const key in featureInfoData.features[0].properties) {
        if (Object.hasOwnProperty.call(featureInfoData.features[0].properties, key)) {
          valueString = valueString+`Value of pixel: ${featureInfoData.features[0].properties[key]}\n`;
        }
      }
    }
    return valueString;
  }

  
  return (<>
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
        { switchRHPanel() }          
      </Col>
    </Row>
    {selectedPixel?.length > 0 && <div className='mt-2 sign-up-aoi-map-bg position-relative'>
      {getPixelValue()}
      {renderClearBtn()}
    </div>}

    {layerData && <div  className='mt-2 sign-up-aoi-map-bg d-flex position-relative'>
      <div style={{width: '60%', marginTop: '-65px'}}>
        <VictoryChart containerComponent={<VictoryContainer responsive={true}/>}>
          <VictoryAxis
            tickCount={4}
            tickValues={tickValues}
            tickFormat={(tick) => formatDate(tick).split(' ').join('\n')}
            style={{
              axis: {
                stroke: 'white', 
              },
              ticks: {stroke: 'grey', size: 10},
              tickLabels: {
                fill: 'white', //CHANGE COLOR OF X-AXIS LABELS
                fontSize: 7,
                padding: 5
              }, 
              grid: {
                stroke: 'white', //CHANGE COLOR OF X-AXIS GRID LINES
                strokeDasharray: '7',
              }
            }}
            // tickLabelComponent={<VictoryLabel style={{ data: { stroke: '#F47938' } }} />}
          />
          <VictoryAxis dependentAxis  
            tickCount={5}
            style={{ 
              axis: {
                stroke: 'white', 
              },
              tickLabels: {
                fill: 'white', //CHANGE COLOR OF Y-AXIS LABELS
                fontSize: 7,
                padding: 5
              },
            }}  
          />

          <VictoryLine data={chartValues} style={{ data: { stroke: '#F47938' } }} labelComponent={<VictoryTooltip cornerRadius={2}/>} />
          <VictoryScatter data={chartValues} style={{labels:{fontSize: 8}}} labelComponent={<VictoryTooltip cornerRadius={2} pointerLength={3}/>} />
        </VictoryChart>
      </div>
      <div style={{lineHeight: '30px', fontSize: '14px'}}>
        <div>
          <strong>Time Interval: </strong> {tickValues.sort(function(a,b){
            return new Date(b.date) - new Date(a.date);
          }).filter((x,i)=> i == 0 || i == (tickValues.length - 1)).map((x)=> formatDate(x)).join(' - ')}
        </div>
        <div>
          <strong>Mean Value: </strong> {chartValues?.length > 0 ? (chartValues.map(data=> +data.y).reduce((a, b) => a + b) / chartValues.length).toFixed(2) : 0}
        </div>
        <div>
          <strong>Highest Value: </strong> {chartValues?.length > 0 ? Math.max(...chartValues.map(data=> +data.y)) : 0}
        </div>
        <div>
          <strong>Highest Value Date: </strong> {formatDate(chartValues?.filter(data=> data.y == Math.max(...chartValues.map(data=> +data.y)))[0]?.x)}
        </div>
        <div>
          <strong>Lowest Value: </strong> {chartValues?.length > 0 ? Math.min(...chartValues.map(data=> +data.y)) : 0}
        </div>
        <div>
          <strong>Lowest Value Date: </strong> {formatDate(chartValues?.filter(data=> data.y == Math.min(...chartValues.map(data=> +data.y)))[0]?.x)}
        </div>
      </div>        
      {renderClearBtn()}
    </div>}
  </>)
}

DataLayer.propTypes = {
  t: PropTypes.any,
  setLayerSource: PropTypes.any,
  metaData: PropTypes.object,
  isMetaDataLoading: PropTypes.bool,
  sourceOptions: PropTypes.array,
  domainOptions: PropTypes.array,
  layerSource: PropTypes.any,
  operationalMapLayers: PropTypes.any,
  dataDomain: PropTypes.any,
  setDataDomain: PropTypes.any,
  sortByDate: PropTypes.any,
  setSortByDate: PropTypes.any,
  handleResetAOI: PropTypes.any,
  currentLayer: PropTypes.any,
  setCurrentLayer: PropTypes.any,
  getSlider: PropTypes.any,
  getLegend: PropTypes.any,
  bitmapLayer: PropTypes.any,
  viewState: PropTypes.any,
  timestamp: PropTypes.string,
  timeSeriesData: PropTypes.any,
  featureInfoData: PropTypes.any,
  dispatch: PropTypes.func
}

export default withTranslation(['common'])(DataLayer);
