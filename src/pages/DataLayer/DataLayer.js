import React, { useEffect, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button, Input, Card, InputGroup, InputGroupText } from 'reactstrap';
import { BitmapLayer, FlyToInterpolator } from 'deck.gl';
import moment from 'moment';
import highlight from 'json-format-highlight'

import BaseMap from '../../components/BaseMap/BaseMap';
import { getAllDataLayers, resetMetaData, getDataLayerTimeSeriesData } from '../../store/appAction';

import TreeView from './TreeView';
import { filterNodesByProperty, formatDate } from '../../store/utility';
import { fetchEndpoint } from '../../helpers/apiHelper';

//i18n
import { withTranslation } from 'react-i18next'
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css'
import { getBoundingBox, getIconLayer } from '../../helpers/mapHelper';
import SimpleBar from 'simplebar-react';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import {
  VictoryChart,
  VictoryAxis,
  VictoryLine,
  // VictoryLabel,
  VictoryScatter,
  VictoryTooltip
} from 'victory';

const SLIDER_SPEED = 800;
const DataLayer = ({ t, searchDataLayers }) => {
  const defaultAoi = useSelector(state => state.user.defaultAoi);
  const {dataLayers: globalDataLayers, metaData, isMetaDataLoading, timeSeries: timeSeriesData, featureInfo: featureInfoData } = useSelector(state => state.dataLayer);
  const dateRange = useSelector(state => state.common.dateRange);

  const [dataLayers, setDataLayers] = useState([]);
  const [currentLayer, setCurrentLayer] = useState(undefined);
  const [bitmapLayer, setBitmapLayer] = useState(undefined);
  const [boundingBox, setBoundingBox] = useState(undefined);
  const [viewState, setViewState] = useState(undefined);
  const [sortByDate, setSortByDate] = useState(undefined);
  const [layerSource, setLayerSource] = useState(undefined);
  const [dataDomain, setDataDomain] = useState(undefined);
  const [sliderValue, setSliderValue] = useState(0);
  const [selectOptions, setSelectOptions] = useState({})
  const [sliderRangeLimit, setSliderRangeLimit] = useState(0);
  const [sliderChangeComplete, setSliderChangeComplete] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [timestamp, setTimestamp] = useState('')
  const [newWidth, setNewWidth] = useState(600);
  const [newHeight, setNewHeight] = useState(600);

  const [tempSelectedPixel, setTempSelectedPixel] = useState([]);  
  const [midPoint, setMidPoint] = useState([]);
  const [currentZoomLevel, setCurrentZoomLevel] = useState(undefined);
  const [selectedPixel, setSelectedPixel] = useState([]);
  const [tempLayerData, setTempLayerData] = useState(null);
  const [layerData, setLayerData] = useState(null);
  const [tickValues, setTickValues] = useState([]);
  const [chartValues, setChartValues] = useState([]);
  const dispatch = useDispatch();
  const timer = useRef(null);

  const { sourceOptions, domainOptions } = selectOptions;

  //fetch data to populate 'Source' and 'Domain' selects
  useEffect(() => {
    (async () => {
      const [sourceOptions, domainOptions] = await Promise.all([
        fetchEndpoint('/data/layers/sources'),
        fetchEndpoint('/data/layers/domains')
      ])
      setSelectOptions({ sourceOptions, domainOptions })
    })()
  }, []);

  // places global data layers into local state, 
  // so that search filtering can then be applied
  useEffect(() => {
    if (!dataLayers?.length) {
      setDataLayers(globalDataLayers);
    }
  }, [globalDataLayers]);

  useEffect(() => {
    setBoundingBox(
      getBoundingBox(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel, 300, 300));
  }, [defaultAoi]);

  useEffect(() => {
    setSliderValue(0);
    setIsPlaying(false);
    if (currentLayer && currentLayer.urls) {
      const urls = getUrls();
      const imageUrl = urls[0].replace('{bbox}', boundingBox);
      setBitmapLayer(getBitmapLayer(imageUrl));
      setSliderRangeLimit(urls.length - 1);
    }
  }, [currentLayer]);

  useEffect(() => {
    if (sliderChangeComplete && currentLayer && currentLayer.urls) {
      const urls = getUrls();
      const timestamps = getTimestamps();
      if (urls[sliderValue]) {
        const imageUrl = urls[sliderValue].replace('{bbox}', boundingBox);
        setBitmapLayer(getBitmapLayer(imageUrl));
      }
      if (timestamps[sliderValue]) {
        setTimestamp(timestamps[sliderValue]);
      }
    }
  }, [sliderValue, sliderChangeComplete]);


  useEffect(() => {
    let nextValue = sliderValue;
    if (isPlaying) {
      timer.current = setInterval(() => {
        if (nextValue < getUrls().length) {
          nextValue += 1;
          setSliderValue(nextValue);
        } else {
          clearInterval(timer.current);
          setIsPlaying(false);
        }
      }, SLIDER_SPEED);
    }
    else {
      clearInterval(timer.current);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (dataLayers.length > 0) {
      if (!viewState) {
        setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel))
      }
    }
  }, [dataLayers]);

  useEffect(() => {
    const dateRangeParams = dateRange
      ? { start: dateRange[0], end: dateRange[1] }
      : {};
    dispatch(getAllDataLayers(
      {
        order: sortByDate,
        source: layerSource ? layerSource : undefined,
        domain: dataDomain ? dataDomain : undefined,
        default_bbox: false,
        ...dateRangeParams,
      }
    ));
  }, [layerSource, dataDomain, sortByDate, dateRange]);  

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
            label: tempY? tempY : '0'
          }
        }));
      } else {
        setTickValues([]);
        setChartValues([]);
      }
      
    }
  }, [timeSeriesData])

  const getUrls = () => {
    return Object.values(currentLayer?.urls)
  };

  const getTimestamps = () => {
    return Object.keys(currentLayer?.urls)
  }

  const getViewState = (midPoint, zoomLevel = 4) => {
    return {
      longitude: midPoint[0],
      latitude: midPoint[1],
      zoom: zoomLevel,
      pitch: 0,
      bearing: 0,
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator()
    };
  }

  const getBitmapLayer = (url) => {
    return (new BitmapLayer({
      id: 'bitmap-layer',
      bounds: boundingBox,
      image: url
    }))
  }

  const formatTooltip = value => moment(Object.assign({}, Object.keys(currentLayer?.urls))[value]).format('LLL');

  const getSlider = (index) => {
    if (currentLayer?.urls) {
      return (
        <div style={{
          position: 'absolute',
          zIndex: 1,
          bottom: '70px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <button
            type="button"
            className="btn btn-layers-slider-play float-start me-2 p-0"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label='play-data-layers'
          >
            <i className={`h4 mdi ${isPlaying ? 'mdi-play' : 'mdi-stop'}`} />
          </button>
          <Slider
            key={index}
            value={sliderValue}
            orientation="horizontal"
            format={formatTooltip}
            min={0}
            max={sliderRangeLimit}
            tooltip={true}
            onClick={() => {
              setSliderChangeComplete(true)
            }}
            onChangeStart={() => {
              setIsPlaying(false);
              setSliderChangeComplete(false);
            }}
            onChange={value => setSliderValue(value)}
            onChangeComplete={() => {
              setIsPlaying(false);
              setSliderChangeComplete(true)
            }}
          />
        </div>
      );
    }
  }

  const getCurrentTimestamp = () => {
    if (timestamp) {
      return (
        <div className='timestamp-container'>
          <p className='timestamp-display'>
            {formatDate(timestamp)}
          </p>
        </div>
      )
    }
  }

  const getLegend = () => {
    if (currentLayer?.legend_url) {
      return (
        <div style={{
          position: 'absolute',
          zIndex: 1,
          bottom: '30px',
          width: '100%',
          display: 'flex',
          alignItems: 'center'
        }}>
          <button
            type="button"
            className="btn btn-layers-slider-play float-start me-2 p-0"
            onClick={() => setShowLegend(!showLegend)}
          >
            <i className="h4 mdi mdi-map-legend">legend</i>
          </button>
        </div>
      );
    }
  }

  const handleResetAOI = useCallback(() => {
    setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel))
  }, []);


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
            layers={[bitmapLayer, tempLayerData]}
            initialViewState={viewState}
            widgets={[]}
            screenControlPosition='top-right'
            navControlPosition='bottom-right'
            onClick={generateGeoJson}
            onViewStateChange={handleViewStateChange}
            setWidth={setNewWidth}
            setHeight={setNewHeight}      
            setNewWidth={setNewWidth}
            setNewHeight={setNewHeight}
          />
        </ContextMenuTrigger>
        <ContextMenu id={'DataLayerMapMenu'} className="menu">
          {currentLayer?.id && <><MenuItem className="menuItem" onClick={toggleDisplayLayerInfo}>
                Get Feature Info
          </MenuItem>
          <MenuItem className="menuItem" onClick={toggleTimeSeriesChart}>
                Time Series Chart
          </MenuItem></>}
        </ContextMenu>
        {getSlider()}
        {getLegend()}
        {getCurrentTimestamp()}
      </Card>
    );
  }
  
  const handleViewStateChange = (e) => {
    if (e && e.viewState) {
      setMidPoint([e.viewState.longitude, e.viewState.latitude]);
      setCurrentZoomLevel(e.viewState.zoom);
    }
  };

  const generateGeoJson = (data)=> {    
    setBoundingBox(getBoundingBox(midPoint, currentZoomLevel, newWidth, newHeight));
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

  const xAxisLabelFormatter = (tick) => {
    return moment(tick).format('MMM YYYY');
  };

  const apiFetch = async (requestType) => {
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
          valueString = valueString+`${key}: ${featureInfoData.features[0].properties[key]}\n`;
        }
      }
    }
    return valueString;
  }

  return (
    // <div className='page-content'>
    <div>
      {showLegend ? (
        <div className='legend'>
          <img src={currentLayer.legend_url} />
        </div>
      ) : null
      }
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
                    <option value=''>Source : All</option>
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
                    <option value=''>Domain : All</option>
                    {domainOptions?.map((option) => (
                      <option key={option} value={option}>
                        Data Domain: {option}
                      </option>
                    )) ?? []}
                  </Input>
                </Col>
              </Row>
            </Col>
            <Col xl={2} className="d-flex justify-content-end">
              <Button color='link'
                onClick={handleResetAOI} className='align-self-baseline p-0'>
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
                  onChange={({target: {value}}) => searchDataLayers(
                    value, globalDataLayers, setDataLayers
                  )}
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
                  data={filterNodesByProperty(dataLayers, {
                    source: layerSource,
                    domain: dataDomain
                  })}
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
        <div className='w-50'>
          <VictoryChart>
            <VictoryAxis
              tickValues={tickValues}
              tickFormat={xAxisLabelFormatter}
              style={{
                axis: {
                  stroke: 'white', 
                },
                tickLabels: {
                  fill: 'white' //CHANGE COLOR OF X-AXIS LABELS
                }, 
                grid: {
                  stroke: 'white', //CHANGE COLOR OF X-AXIS GRID LINES
                  strokeDasharray: '7',
                }
              }}
              // tickLabelComponent={<VictoryLabel style={{ data: { stroke: '#F47938' } }} />}
            />
            <VictoryAxis dependentAxis 
              style={{ 
                axis: {
                  stroke: 'white', 
                },
                tickLabels: {
                  fill: 'white' //CHANGE COLOR OF Y-AXIS LABELS
                },
              }}  
            />

            <VictoryLine data={chartValues} style={{ data: { stroke: '#F47938' } }} labelComponent={<VictoryTooltip cornerRadius={2}
              pointerLength={0}/>} />
            <VictoryScatter size={3} data={chartValues} labelComponent={<VictoryTooltip cornerRadius={2}
              pointerLength={0}/>} />
          </VictoryChart>
        </div>
        <div className='w-50' style={{lineHeight: '30px'}}>
          <div>
            <strong>Time Interval: </strong> {tickValues.sort(function(a,b){
              return new Date(b.date) - new Date(a.date);
            }).map(x=> formatDate(x)).join(', ')}
          </div>
          <div>
            <strong>Mean Value: </strong> {chartValues?.length > 0 ? chartValues.map(data=> +data.y).reduce((a, b) => a + b) / chartValues.length : 0}
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
    </div >
  );
}

DataLayer.propTypes = {
  t: PropTypes.any,
  searchDataLayers: PropTypes.func
}

export default withTranslation(['common'])(DataLayer);
