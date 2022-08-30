import React, { useEffect, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button, Input, Card, InputGroup, InputGroupText, Modal } from 'reactstrap';
import { BitmapLayer, FlyToInterpolator } from 'deck.gl';
import moment from 'moment';

import BaseMap from '../../components/BaseMap/BaseMap';
import { getAllDataLayers, getDataLayerTimeSeriesData } from '../../store/appAction';

import OnDemandTreeView from './OnDemandTreeView';
// import { getDefaultDateRange } from '../../store/utility';

//i18n
import { withTranslation } from 'react-i18next'
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css'
import { getBoundingBox, getIconLayer } from '../../helpers/mapHelper';
import SimpleBar from 'simplebar-react';
import MOCKDATA from './mockdata';
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
const OnDemandDataLayer = ({ 
  t, 
  setActiveTab, 
  dataLayerPanels, 
  searchDataLayers 
}) => {
  const defaultAoi = useSelector(state => state.user.defaultAoi);
  const dateRange = useSelector(state => state.common.dateRange);
  const {timeSeries: timeSeriesData, featureInfo: featureInfoData } = useSelector(state => state.dataLayer);
  const [dataLayers, setDataLayers] = useState(MOCKDATA);
  const [currentLayer, setCurrentLayer] = useState(undefined);
  const [bitmapLayer, setBitmapLayer] = useState(undefined);
  const [boundingBox, setBoundingBox] = useState(undefined);
  const [viewState, setViewState] = useState(undefined);
  const [sortByDate, setSortByDate] = useState(undefined);
  const [layerSource, setLayerSource] = useState(undefined);
  const [dataDomain, setDataDomain] = useState(undefined);
  const [sliderValue, setSliderValue] = useState(0);
  const [sliderRangeLimit, setSliderRangeLimit] = useState(0);
  const [sliderChangeComplete, setSliderChangeComplete] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [newWidth, setNewWidth] = useState(600);
  const [newHeight, setNewHeight] = useState(600);

  const [tempSelectedPixel, setTempSelectedPixel] = useState([]);  
  const [midPoint, setMidPoint] = useState([]);
  const [currentZoomLevel, setCurrentZoomLevel] = useState(undefined);
  const [selectedPixel, setSelectedPixel] = useState([]);
  const [tempLayerData, setTempLayerData] = useState(null);
  const [layerData, setLayerData] = useState(null);

  const dispatch = useDispatch();
  const timer = useRef(null);

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
      if (urls[sliderValue]) {
        const imageUrl = urls[sliderValue].replace('{bbox}', boundingBox);
        setBitmapLayer(getBitmapLayer(imageUrl));
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
        ...dateRangeParams
      }
    ));
  }, [layerSource, dataDomain, sortByDate, dateRange]);

  useEffect(()=> {
    if(timeSeriesData) {
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(timeSeriesData,'text/xml');
      console.log(xmlToJson(xmlDoc));
    }
  }, [timeSeriesData])

  const getUrls = () => Object.values(currentLayer?.urls);

  const toggleModal = () => setModalIsOpen(prev => !prev);

  const handleDialogButtonClick = ({ target: { value } }) => {
    setActiveTab(+value);
    toggleModal();
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

  const prev = [
    { x: '2020-01', y: 1.1235, label: 5 },
    { x: '2020-02', y: 4.32332, label: 5 },
    { x: '2020-03', y: 3.87543, label: 5 },
    { x: '2020-04', y: 1.1251, label: 5 },
    { x: '2020-05', y: 2.123241, label: 5 },
    { x: '2020-06', y: 3.5231, label: 5 }
  ];

  const xAxisLabelFormatter = (tick) => {
    const [year, month] = tick.split('-');
    return moment()
      .year(year)
      .month(month - 1)
      .format('MMM YYYY');
  };

  const tickValues = [
    '2020-01',
    '2020-02',
    '2020-03',
    '2020-04',
    '2020-05',
    '2020-06'
  ];

  const apiFetch = async (requestType) => {
    var tempUrl = ''
    if(requestType == 'GetTimeSeries') {
      tempUrl = currentLayer.timeseries_url.replace('{bbox}', `${tempSelectedPixel[0]},${tempSelectedPixel[1]},${tempSelectedPixel[0]+0.0001},${tempSelectedPixel[1]+0.0001}`);
    } else if(requestType == 'GetFeatureInfo') {
      tempUrl = currentLayer.pixel_url.replace('{bbox}', `${tempSelectedPixel[0]},${tempSelectedPixel[1]},${tempSelectedPixel[0]+0.0001},${tempSelectedPixel[1]+0.0001}`);
    }

    dispatch(getDataLayerTimeSeriesData(tempUrl, requestType));
  }

  function xmlToJson(xml) {	
    // Create the return object
    var obj = {};
  
    if (xml.nodeType == 1) { // element
      // do attributes
      if (xml.attributes.length > 0) {
        obj['@attributes'] = {};
        for (var j = 0; j < xml.attributes.length; j++) {
          var attribute = xml.attributes.item(j);
          obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType == 3) { // text
      obj = xml.nodeValue;
    }
  
    // do children
    if (xml.hasChildNodes()) {
      for(var i = 0; i < xml.childNodes.length; i++) {
        var item = xml.childNodes.item(i);
        var nodeName = item.nodeName;
        if (typeof(obj[nodeName]) == 'undefined') {
          obj[nodeName] = xmlToJson(item);
        } else {
          if (typeof(obj[nodeName].push) == 'undefined') {
            var old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xmlToJson(item));
        }
      }
    }
    return obj;
  }

  const toggleDisplayLayerInfo = () => {
    setSelectedPixel(tempSelectedPixel);
    setLayerData(null);
    apiFetch('GetFeatureInfo');
  }

  // eslint-disable-next-line no-unused-vars
  const toggleTimeSeriesChart = () => {
    setSelectedPixel([]);
    setLayerData(tempLayerData);
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
    <div>
      <div>
        {showLegend ? (
          <div className='legend'>
            <img src={currentLayer.legend_url}/>
          </div>
        ) : null
        }
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
                value={dataLayerPanels.FIRE_AND_BURNED_AREA} 
                onClick={handleDialogButtonClick}
                className='data-layers-dialog-btn'
              >
                {t('Fire and Burned Area')}
              </button>
              <button 
                value={dataLayerPanels.POST_EVENT_MONITORING} 
                onClick={handleDialogButtonClick}
                className='data-layers-dialog-btn'
              >
                {t('Post Event Monitoring')}
              </button>
              <button
                value={dataLayerPanels.WILDfIRE_SIMULATION} 
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
                    className="request-map btn-orange" 
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
                    onChange={({ target: { value }}) => searchDataLayers(
                      value, MOCKDATA, setDataLayers
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
                  <OnDemandTreeView
                    data={dataLayers}
                    setCurrentLayer={setCurrentLayer}
                  />
                </SimpleBar>
              </Col>
            </Row>
          </Col>
          <Col xl={7} className='mx-auto'>
            <Card className='map-card mb-0' style={{ height: 670 }}>
              <ContextMenuTrigger id={'OnDemanDataLayerMapMenu'}>
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
              <ContextMenu id={'OnDemanDataLayerMapMenu'} className="menu">
                {currentLayer?.id && <MenuItem className="menuItem" onClick={toggleDisplayLayerInfo}>
                  Display Layer Info
                </MenuItem>}            
                {/* <MenuItem className="menuItem" onClick={toggleTimeSeriesChart}>
                  Time Series Chart
                </MenuItem> */}
              </ContextMenu>
              {getSlider()}
              {getLegend()}
            </Card>
          </Col>
        </Row>
      </div>

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

            <VictoryLine data={prev} style={{ data: { stroke: '#F47938' } }} labelComponent={<VictoryTooltip cornerRadius={2}
              pointerLength={0}/>} />
            <VictoryScatter size={3} data={prev} labelComponent={<VictoryTooltip cornerRadius={2}
              pointerLength={0}/>} />
          </VictoryChart>
        </div>
        <div className='w-50' style={{lineHeight: '30px'}}>
          <div>
            <strong>Time Interval: </strong> 2000-05-01-2022-05-1
          </div>
          <div>
            <strong>Mean Value: </strong> 32
          </div>
          <div>
            <strong>Highest Value: </strong> 48
          </div>
          <div>
            <strong>Highest Value Date: </strong> 2015-05-01
          </div>
          <div>
            <strong>Lowest Value: </strong> 17
          </div>
          <div>
            <strong>Lowest Value Date: </strong> 2017-05-01
          </div>
        </div>        
        {renderClearBtn()}
      </div>}
    </div >
  );
}

OnDemandDataLayer.propTypes = {
  t: PropTypes.any,
  setActiveTab: PropTypes.func,
  dataLayerPanels: PropTypes.object,
  searchDataLayers: PropTypes.func
}

export default withTranslation(['common'])(OnDemandDataLayer);
