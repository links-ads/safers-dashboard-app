import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FlyToInterpolator } from 'deck.gl';
import { Nav, Row, Col, NavItem, NavLink, TabPane, TabContent } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { BitmapLayer } from 'deck.gl';
import moment from 'moment';
import Slider from 'react-rangeslider';
import DataLayer from './DataLayer';
import OnDemandDataLayer from './OnDemandDataLayer';
import FireAndBurnedArea from './FireAndBurnedArea';
import { getAllDataLayers } from '../../store/appAction';
import { getBoundingBox } from '../../helpers/mapHelper';
import { SLIDER_SPEED, DATA_LAYERS_PANELS } from './constants'
import { filterNodesByProperty } from '../../store/utility';
import { fetchEndpoint } from '../../helpers/apiHelper';
import { onDemandMapLayers } from './mock-data';

//TODO: correct types
// style tabs like designs
// default-aoi button label broken
// fix form height, maybe put back inside form

const DataLayerDashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const timer = useRef(null);

  const defaultAoi = useSelector(state => state.user.defaultAoi);
  const dataLayers = useSelector(state => state.dataLayer.dataLayers);
  const dateRange = useSelector(state => state.common.dateRange);

  const [viewState, setViewState] = useState(undefined);
  const [boundingBox, setBoundingBox] = useState(undefined);
  const [currentLayer, setCurrentLayer] = useState(undefined);
  const [selectOptions, setSelectOptions] = useState({})
  const [dataDomain, setDataDomain] = useState(undefined);
  const [sortByDate, setSortByDate] = useState(undefined);
  const [layerSource, setLayerSource] = useState(undefined);
  const [sliderValue, setSliderValue] = useState(0);
  const [sliderRangeLimit, setSliderRangeLimit] = useState(0);
  const [sliderChangeComplete, setSliderChangeComplete] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bitmapLayer, setBitmapLayer] = useState(undefined);
  const [showLegend, setShowLegend] = useState(false);
  const [activeTab, setActiveTab] = useState(DATA_LAYERS_PANELS.mapLayers);

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
  }, [])

  useEffect(() => {
    setBoundingBox(
      getBoundingBox(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel, 300, 300));
  }, [defaultAoi]);

  useEffect(() => {
    if (!viewState && dataLayers.length > 0) {
      setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel));
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
        start: dateRange[0],
        end: dateRange[1],
        default_start: false,
        default_end: false,
        default_bbox: false,
        ...dateRangeParams,
      }
    ));
  }, [layerSource, dataDomain, sortByDate, dateRange, boundingBox]);

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

  const getUrls = () => Object.values(currentLayer?.urls);

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

  const getViewState = (midPoint, zoomLevel = 4) => ({
    longitude: midPoint[0],
    latitude: midPoint[1],
    zoom: zoomLevel,
    pitch: 0,
    bearing: 0,
    transitionDuration: 1000,
    transitionInterpolator: new FlyToInterpolator()
  })

  const handleResetAOI = useCallback(() => {
    setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel))
  }, []);

  const mapLayersProps = {
    t,
    layerSource,
    setLayerSource,
    sourceOptions,
    domainOptions,
    setCurrentLayer,
    dataDomain,
    setDataDomain,
    sortByDate,
    setSortByDate,
    getSlider,
    getLegend,
    bitmapLayer,
    viewState,
    handleResetAOI,
  }

  return(
    <div className='page-content'>
      {showLegend ? (
        <div className='legend'>
          <img src={currentLayer.legend_url}/>
        </div>
      ) : null}
      <div className='mx-2 sign-up-aoi-map-bg'>
        <Row>
          <Col xl={5} className='mb-3'>
            <Row>
              <Col xl={4}><h4>{t('Data Layers')}</h4></Col>
              <Col xl={8}>
                <Nav className='d-flex flex-nowrap' pills fill>
                  <NavItem>
                    <NavLink
                      className={{ 
                        'active': activeTab === DATA_LAYERS_PANELS.mapLayers 
                      }}
                      onClick={() => setActiveTab(DATA_LAYERS_PANELS.mapLayers)}
                    >
                      {t('Operational Map Layers')}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={{ 
                        'active': activeTab === DATA_LAYERS_PANELS.onDemandMapLayers 
                      }}
                      onClick={() => setActiveTab(DATA_LAYERS_PANELS.onDemandMapLayers)}
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
          <TabPane tabId={DATA_LAYERS_PANELS.mapLayers}>
            <DataLayer
              operationalMapLayers={filterNodesByProperty(dataLayers, {
                source: layerSource, 
                domain: dataDomain
              })}
              {...mapLayersProps}
            />
          </TabPane>
          <TabPane tabId={DATA_LAYERS_PANELS.onDemandMapLayers}>
            <OnDemandDataLayer
              onDemandMapLayers={filterNodesByProperty(onDemandMapLayers, {
                source: layerSource, 
                domain: dataDomain
              })}
              setActiveTab={setActiveTab}
              {...mapLayersProps}
            />
          </TabPane>
          <TabPane tabId={DATA_LAYERS_PANELS.fireAndBurnedAreas}>
            <FireAndBurnedArea 
              t={t} 
              setActiveTab={setActiveTab} 
            />
          </TabPane>
          <TabPane tabId={DATA_LAYERS_PANELS.postEventMonitoring}>
            <div>Post Event Monitoring</div>
          </TabPane>
          <TabPane tabId={DATA_LAYERS_PANELS.wildfireSimulation}>
            <div>Wildfire Simulation</div>
          </TabPane>
        </TabContent>
      </div>
    </div>
  );
};

export default DataLayerDashboard;
