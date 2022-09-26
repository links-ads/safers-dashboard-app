import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FlyToInterpolator, COORDINATE_SYSTEM } from 'deck.gl';
import { Nav, Row, Col, NavItem, NavLink, TabPane, TabContent } from 'reactstrap';
import { useTranslation } from 'react-i18next';

import moment from 'moment';
import Slider from 'react-rangeslider';
import { getAllMapRequests } from '../../store/datalayer/action'
import DataLayer from './DataLayer';
import OnDemandDataLayer from './OnDemandDataLayer';
import FireAndBurnedArea from './FireAndBurnedArea';
import PostEventMonitoringForm from './PostEventMonitoringForm'
import WildfireSimulation from './WildfireSimulation'
import { getAllDataLayers, setNewMapRequestState, setAlertApiParams, setDateRangeDisabled } from '../../store/appAction';
import { getBoundingBox } from '../../helpers/mapHelper';
import { SLIDER_SPEED, DATA_LAYERS_PANELS, EUROPEAN_BBOX } from './constants'
import { filterNodesByProperty } from '../../store/utility';
import { fetchEndpoint } from '../../helpers/apiHelper';
import { setFilteredAlerts } from '../../store/alerts/action';

const DataLayerDashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const timer = useRef(null);

  const defaultAoi = useSelector(state => state.user.defaultAoi);
  const {
    dataLayers,
    metaData,
    isMetaDataLoading,
    timeSeries: timeSeriesData,
    featureInfo: featureInfoData
  } = useSelector(state => state.dataLayer);
  const dateRange = useSelector(state => state.common.dateRange);
  const { allMapRequests } = useSelector(state => state?.dataLayer);

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
  const [timestamp, setTimestamp] = useState('')

  const { operationalSourceOptions, onDemandSourceOptions, operationalDomainOptions, onDemandDomainOptions } = selectOptions;

  //fetch data to populate 'Source' and 'Domain' selects
  useEffect(() => {
    (async () => {
      const [operationalSourceOptions, onDemandSourceOptions, operationalDomainOptions, onDemandDomainOptions] = await Promise.all([
        fetchEndpoint('/data/layers/sources'),
        fetchEndpoint('/data/maprequests/sources'),
        fetchEndpoint('/data/layers/domains'),
        fetchEndpoint('/data/maprequests/domains')
      ])
      setSelectOptions({ operationalSourceOptions, onDemandSourceOptions, operationalDomainOptions, onDemandDomainOptions });
    })()
  }, [])

  useEffect(() => {
    dispatch(setNewMapRequestState(false, true));
    dispatch(setDateRangeDisabled(true));
    return () => {
      dispatch(setAlertApiParams(undefined));
      dispatch(setNewMapRequestState(false, false));
      dispatch(setDateRangeDisabled(false));
    }
  }, []);

  useEffect(()=> {
    setSliderValue(0);
    setIsPlaying(false);
    setTimestamp('');
    setBitmapLayer(undefined);
    setSliderRangeLimit(0);
    setCurrentLayer(undefined);
  }, [activeTab])

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
    // Remove comments if it's required to send date-time range and bbox value for filter
    // const dateRangeParams = dateRange 
    //   ? { start: dateRange[0], end: dateRange[1] } 
    //   : {};

    const options = {
      order: sortByDate,
      source: layerSource ? layerSource : undefined,
      domain: dataDomain ? dataDomain : undefined,

      // Remove comments if it's required to send date-time range and bbox value for filter
      // start: dateRange[0],
      // end: dateRange[1],
      // default_start: false,
      // default_end: false,
      // default_bbox: false,
      // ...dateRangeParams,
    }

    dispatch(getAllDataLayers(options));
    dispatch(getAllMapRequests(options, true))
  }, [layerSource, dataDomain, sortByDate, dateRange, boundingBox]);

  useEffect(() => {
    setSliderValue(0);
    setIsPlaying(false);
    if (currentLayer && currentLayer.urls) {
      const urls = getUrls();
      const timestamps = getTimestamps();
      setTimestamp(timestamps[sliderValue])
      const imageUrl = urls[0].replace('{bbox}', EUROPEAN_BBOX);
      setBitmapLayer(getBitmapLayer(imageUrl));
      setSliderRangeLimit(urls.length - 1);
    }
  }, [currentLayer]);

  useEffect(() => {
    if (currentLayer?.urls) {
      if (sliderChangeComplete) {
        const urls = getUrls();
        if (urls[sliderValue]) {
          const imageUrl = urls[sliderValue].replace('{bbox}', EUROPEAN_BBOX);
          setBitmapLayer(getBitmapLayer(imageUrl));
        }
      }
      const timestamps = getTimestamps();
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
    if (showLegend) {
      setShowLegend(false);
    }
  }, [activeTab, currentLayer, metaData]);

  // This takes an array of objects and recursively filters out sibling 
  // objects that do not match the search term. It retains the original data 
  // shape and all children of matching objects.
  const searchDataTree = (data, str) => {
    const searchTerm = str.toLowerCase();
    return data.reduce((acc, datum) => {
      if (datum.text.toLowerCase().includes(searchTerm)) {
        return [...acc, datum];
      }

      let children = [];
      if (datum.children) {
        const filteredChildren = searchDataTree(datum.children, searchTerm);
        children = filteredChildren;
      }

      const hasChildren = !!children.length;

      return hasChildren
        ? [...acc, { ...datum, children }]
        : acc;
    }, []);
  }

  const backToOnDemandPanel = () => {
    setActiveTab(DATA_LAYERS_PANELS.onDemandMapLayers);
  }

  const getUrls = () => Object.values(currentLayer?.urls);

  const getTimestamps = () => {
    return Object.keys(currentLayer?.urls)
  }

  const getBitmapLayer = (url) => {
    return {
      id: 'bitmap-layer',
      bounds: EUROPEAN_BBOX,
      image: url,
      _imageCoordinateSystem: COORDINATE_SYSTEM.LNGLAT,
      opacity: 0.5
    }
  }

  const formatTooltip = value => moment(Object.assign({}, Object.keys(currentLayer?.urls))[value]).format('LLL');

  const getSlider = (index) => {
    if (currentLayer?.urls && Object.keys(currentLayer?.urls).length > 1) {
      return (
        <div style={{
          position: 'absolute',
          zIndex: 1,
          bottom: '0px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="mapboxgl-ctrl mapboxgl-ctrl-group mx-2">
            <button onClick={() => setIsPlaying(!isPlaying)} className="mapboxgl-ctrl-icon d-flex justify-content-center align-items-center" type="button">
              <i className={`h4 mb-0 mdi ${isPlaying ? 'mdi-stop' : 'mdi-play'}`} style={{ fontSize: '20px' }}/>
            </button>
          </div>
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

    return null
  }

  const getLegend = () => {
    if (currentLayer?.legend_url) {
      return (
        <div style={{
          position: 'absolute',
          zIndex: 1,
          top: '0.625rem',
          left: '0.625rem',
          display: 'flex',
          alignItems: 'center',
          padding: '0.25rem 0.41rem',
          width: '1.813',
          height: '1.813',
          backgroundColor: '#fff',
          borderRadius: '0.25rem'
        }}>
          <button
            type="button"
            className="btn float-start p-0"
            style={{ color: '#000' }}
            onClick={() => setShowLegend(!showLegend)}
          >
            <i className="h4 mdi mdi-map-legend" />
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

  const sharedMapLayersProps = {
    t,
    layerSource,
    setLayerSource,
    currentLayer,
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
    timeSeriesData,
    featureInfoData,
    searchDataTree,
    timestamp,
    showLegend,
    legendUrl: currentLayer?.legend_url,
    sliderChangeComplete
  };

  return (
    <div className='page-content'>
      <div className='mx-2 sign-up-aoi-map-bg'>
        <Row>
          <Col xl={5} className='mb-3'>
            <Row className='d-flex align-items-baseline'>
              <Col xl={4} className='d-flex align-items-baseline'>
                <p className='alert-title'>
                  {t('Data Layers')}
                </p>
                <button
                  type="button"
                  className="btn float-end mt-1 py-0 px-1"
                  aria-label='refresh-events'
                  onClick={() => {
                    dispatch(setFilteredAlerts(allMapRequests));
                  }}
                >
                  <i className="mdi mdi-sync"></i>
                </button>
              </Col>
              <Col xl={8}>
                {activeTab < 2 ? (
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
                ) : null}
              </Col>
            </Row>
          </Col>
          <Col xl={7} />
        </Row>
        <TabContent activeTab={activeTab}>
          <TabPane tabId={DATA_LAYERS_PANELS.mapLayers}>
            {activeTab === DATA_LAYERS_PANELS.mapLayers && <DataLayer
              operationalMapLayers={filterNodesByProperty(dataLayers, {
                source: layerSource,
                domain: dataDomain
              })}
              operationalSourceOptions={operationalSourceOptions}
              operationalDomainOptions={operationalDomainOptions}
              dispatch={dispatch}
              metaData={metaData}
              isMetaDataLoading={isMetaDataLoading}
              {...sharedMapLayersProps}
            />}
          </TabPane>
          <TabPane tabId={DATA_LAYERS_PANELS.onDemandMapLayers}>
            {activeTab === DATA_LAYERS_PANELS.onDemandMapLayers && <OnDemandDataLayer
              mapRequests={filterNodesByProperty(allMapRequests, {
                source: layerSource,
                domain: dataDomain
              })}
              onDemandSourceOptions={onDemandSourceOptions}
              onDemandDomainOptions={onDemandDomainOptions}
              dispatch={dispatch}
              setActiveTab={setActiveTab}
              {...sharedMapLayersProps}
            />}
          </TabPane>
          <TabPane tabId={DATA_LAYERS_PANELS.fireAndBurnedAreas}>
            {/* ternary here to unmount and clear form */}
            {activeTab === DATA_LAYERS_PANELS.fireAndBurnedAreas ? (
              <FireAndBurnedArea
                t={t}
                handleResetAOI={handleResetAOI}
                backToOnDemandPanel={backToOnDemandPanel}
              />
            ) : null}
          </TabPane>
          <TabPane tabId={DATA_LAYERS_PANELS.postEventMonitoring}>
            {/* ternary here to unmount and clear form */}
            {activeTab === DATA_LAYERS_PANELS.postEventMonitoring ? (
              <PostEventMonitoringForm
                t={t}
                handleResetAOI={handleResetAOI}
                backToOnDemandPanel={backToOnDemandPanel}
              />
            ) : null}
          </TabPane>
          <TabPane tabId={DATA_LAYERS_PANELS.wildfireSimulation}>
            {/* ternary here to unmount and clear form */}
            {activeTab === DATA_LAYERS_PANELS.wildfireSimulation ? (
              <WildfireSimulation
                t={t}
                handleResetAOI={handleResetAOI}
                backToOnDemandPanel={backToOnDemandPanel}
              />
            ) : null}
          </TabPane>
        </TabContent>
      </div>
    </div>
  );
};

export default DataLayerDashboard;
