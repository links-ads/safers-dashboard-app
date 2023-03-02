import React, { useState, useCallback, useEffect, useRef } from 'react';

import { area as getFeatureArea, bbox, bboxPolygon } from '@turf/turf';
import { FlyToInterpolator } from 'deck.gl';
import moment from 'moment';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Slider from 'react-rangeslider';
import { useDispatch, useSelector } from 'react-redux';
import {
  Nav,
  Row,
  Col,
  NavItem,
  NavLink,
  TabPane,
  TabContent,
} from 'reactstrap';
import wkt from 'wkt';

import { useMap } from 'components/BaseMap/MapContext';
import { MAP } from 'constants/common';
import { fetchEndpoint } from 'helpers/apiHelper';
import { getBoundingBox, isWKTValid } from 'helpers/mapHelper';
import { setFilteredAlerts, setAlertApiParams } from 'store/alerts.slice';
import {
  setDateRangeDisabled,
  configSelector,
  dateRangeSelector,
} from 'store/common.slice';
import {
  fetchDataLayers,
  fetchMapRequests,
  postMapRequest,
  setNewMapRequestState,
  dataLayersSelector,
  metaDataSelector,
  isMetaDataLoadingSelector,
  timeSeriesInfoSelector,
  featureInfoSelector,
  dataLayerMapRequestsSelector,
} from 'store/datalayer.slice';
import { defaultAoiSelector } from 'store/user.slice';
import {
  filterNodesByProperty,
  getGeoFeatures,
  getWKTfromFeature,
} from 'utility';

import {
  SLIDER_SPEED,
  DATA_LAYERS_PANELS,
  EUROPEAN_BBOX,
  WILDFIRE_LAYER_TYPES,
  DEFAULT_WILDFIRE_GEOMETRY_BUFFER,
} from './constants';
import DataLayer from './DataLayer';
import FireAndBurnedArea from './FireAndBurnedArea';
import OnDemandDataLayer from './OnDemandDataLayer';
import PostEventMonitoringForm from './PostEventMonitoringForm';
import WildfireSimulation from './wildfire-simulation-form/WildfireSimulation';

const DataLayerDashboard = ({ t }) => {
  const { viewState, setViewState } = useMap();
  const dispatch = useDispatch();
  const timer = useRef(null);

  const config = useSelector(configSelector);
  const defaultAoi = useSelector(defaultAoiSelector);
  const dataLayerBoundingBox = config?.restrict_data_to_aoi
    ? defaultAoi.features[0].bbox
    : EUROPEAN_BBOX;

  const dataLayers = useSelector(dataLayersSelector);
  const metaData = useSelector(metaDataSelector);
  const isMetaDataLoading = useSelector(isMetaDataLoadingSelector);
  const timeSeriesData = useSelector(timeSeriesInfoSelector);
  const featureInfoData = useSelector(featureInfoSelector);

  const dateRange = useSelector(dateRangeSelector);
  const allMapRequests = useSelector(dataLayerMapRequestsSelector);

  const [boundingBox, setBoundingBox] = useState(undefined);
  const [currentLayer, setCurrentLayer] = useState(undefined);
  const [selectOptions, setSelectOptions] = useState({});
  const [dataDomain, setDataDomain] = useState(undefined);
  const [sortByDate, setSortByDate] = useState(undefined);
  const [sliderValue, setSliderValue] = useState(0);
  const [sliderRangeLimit, setSliderRangeLimit] = useState(0);
  const [sliderChangeComplete, setSliderChangeComplete] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bitmapLayer, setBitmapLayer] = useState(undefined);
  const [showLegend, setShowLegend] = useState(false);
  const [activeTab, setActiveTab] = useState(DATA_LAYERS_PANELS.mapLayers);
  const [timestamp, setTimestamp] = useState('');

  const { operationalDomainOptions, onDemandDomainOptions } = selectOptions;

  const resetMap = () => {
    setCurrentLayer(undefined);
    setBitmapLayer(undefined);
  };

  //fetch data to populate and 'Domain' selects
  useEffect(() => {
    (async () => {
      const [operationalDomainOptions, onDemandDomainOptions] =
        await Promise.all([
          fetchEndpoint('/data/layers/domains'),
          fetchEndpoint('/data/maprequests/domains'),
        ]);
      setSelectOptions({ operationalDomainOptions, onDemandDomainOptions });
    })();
  }, []);

  useEffect(() => {
    dispatch(setNewMapRequestState(false, true));
    dispatch(setDateRangeDisabled(true));
    return () => {
      dispatch(setAlertApiParams(undefined));
      dispatch(setNewMapRequestState(false, false));
      dispatch(setDateRangeDisabled(false));
    };
  }, [dispatch]);

  useEffect(() => {
    setSliderValue(0);
    setIsPlaying(false);
    setTimestamp('');
    setBitmapLayer(undefined);
    setSliderRangeLimit(0);
    setCurrentLayer(undefined);
  }, [activeTab]);

  useEffect(() => {
    setBoundingBox(
      getBoundingBox(
        defaultAoi.features[0].properties.midPoint,
        defaultAoi.features[0].properties.zoomLevel,
        300,
        300,
      ),
    );
  }, [defaultAoi]);

  useEffect(() => {
    if (!viewState && dataLayers.length > 0) {
      setViewState(
        getViewState(
          defaultAoi.features[0].properties.midPoint,
          defaultAoi.features[0].properties.zoomLevel,
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataLayers]);

  useEffect(() => {
    const options = {
      order: sortByDate,
      domain: dataDomain ? dataDomain : undefined,
    };

    dispatch(fetchDataLayers(options));
    dispatch(fetchMapRequests(options));
  }, [dataDomain, sortByDate, dateRange, boundingBox, dispatch]);

  useEffect(() => {
    setSliderValue(0);
    setIsPlaying(false);
    if (currentLayer && currentLayer.urls) {
      const urls = getUrls();
      const timestamps = getTimestamps();
      setTimestamp(timestamps[sliderValue]);
      const imageUrl = urls[0].replace('{bbox}', dataLayerBoundingBox);
      setBitmapLayer(getBitmapLayer(imageUrl));
      setSliderRangeLimit(urls.length - 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLayer]);

  useEffect(() => {
    if (currentLayer?.urls) {
      if (sliderChangeComplete) {
        const urls = getUrls();
        if (urls[sliderValue]) {
          const imageUrl = urls[sliderValue].replace(
            '{bbox}',
            dataLayerBoundingBox,
          );
          setBitmapLayer(getBitmapLayer(imageUrl));
        }
      }
      const timestamps = getTimestamps();
      if (timestamps[sliderValue]) {
        setTimestamp(timestamps[sliderValue]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    } else {
      clearInterval(timer.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  useEffect(() => {
    if (showLegend) {
      setShowLegend(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, currentLayer, metaData]);

  const backToOnDemandPanel = () => {
    setActiveTab(DATA_LAYERS_PANELS.onDemandMapLayers);
  };

  const getUrls = () => Object.values(currentLayer?.urls);

  const getTimestamps = () => {
    return Object.keys(currentLayer?.urls);
  };

  const getBitmapLayer = url => {
    /*
     extract bounds from url; if this is an operational layer, it will have been replaced by dataLayerBoundingBox
     if this is an on-demand layer, it will have been hard-coded by the backend
    */
    const urlSearchParams = new URLSearchParams(url);
    const urlParams = Object.fromEntries(urlSearchParams.entries());
    const bounds = urlParams?.bbox
      ? urlParams.bbox.split(',').map(Number)
      : dataLayerBoundingBox;

    return {
      id: 'bitmap-layer',
      bounds: bounds,
      image: url,
      //_imageCoordinateSystem: COORDINATE_SYSTEM.LNGLAT,
      opacity: 0.5,
    };
  };

  const formatTooltip = value =>
    moment(Object.assign({}, Object.keys(currentLayer?.urls))[value]).format(
      'LLL',
    );

  const getSlider = index => {
    if (currentLayer?.urls && Object.keys(currentLayer?.urls).length > 1) {
      return (
        <div
          style={{
            position: 'absolute',
            zIndex: 1,
            bottom: '0px',
            width: '70%',
            margin: '0 15%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="mapboxgl-ctrl mapboxgl-ctrl-group mx-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="mapboxgl-ctrl-icon d-flex justify-content-center align-items-center"
              type="button"
            >
              <i
                className={`h4 mb-0 mdi ${isPlaying ? 'mdi-stop' : 'mdi-play'}`}
                style={{ fontSize: '20px' }}
              />
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
              setSliderChangeComplete(true);
            }}
            onChangeStart={() => {
              setIsPlaying(false);
              setSliderChangeComplete(false);
            }}
            onChange={value => setSliderValue(value)}
            onChangeComplete={() => {
              setIsPlaying(false);
              setSliderChangeComplete(true);
            }}
          />
        </div>
      );
    }

    return null;
  };

  const getLegend = () => {
    if (currentLayer?.legend_url) {
      return (
        <div
          style={{
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
            borderRadius: '0.25rem',
          }}
        >
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
  };

  const getViewState = (midPoint, zoomLevel = 4) => ({
    longitude: midPoint[0],
    latitude: midPoint[1],
    zoom: zoomLevel,
    pitch: 0,
    bearing: 0,
    transitionDuration: 1000,
    transitionInterpolator: new FlyToInterpolator(),
  });

  const handleResetAOI = useCallback(() => {
    setViewState(
      getViewState(
        defaultAoi.features[0].properties.midPoint,
        defaultAoi.features[0].properties.zoomLevel,
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sharedMapLayersProps = {
    t,
    currentLayer,
    setCurrentLayer,
    dataDomain,
    setDataDomain,
    sortByDate,
    setSortByDate,
    getSlider,
    getLegend,
    bitmapLayer,
    handleResetAOI,
    timeSeriesData,
    featureInfoData,
    timestamp,
    showLegend,
    legendUrl: currentLayer?.legend_url,
    sliderChangeComplete,
    resetMap,
  };

  const isRasterSizeWithinLimits = (features, spatial_resolution) => {
    // check to make sure that raster is never more than MAX_RASTER_SIZE by MAX_RASTER_SIZE
    const MAX_RASTER_SIZE = 15000;
    if (features) {
      // we get different shapes if we draw on map or change resolution
      const polygon = features?.geometry ? features.geometry : features;
      // use Bounding box as that's what affects raster size, not the polygon area
      const bboxArea = getFeatureArea(bboxPolygon(bbox(polygon)));
      const maxValidArea = Math.pow(spatial_resolution * MAX_RASTER_SIZE, 2.0);
      // Keeping these commented out as they're really useful for troubleshooting
      //console.log(`max valid area at ${spatial_resolution} is ${maxValidArea/1000000.0}km^2, selection is ${bboxArea/1000000}km^2`)
      //console.log(`is valid is ${bboxArea < maxValidArea}`)
      return bboxArea < maxValidArea;
    }
    return false;
  };

  const mapInputOnChange = (
    value,
    setFieldValue,
    checkRasterSize = false,
    resolution = null,
  ) => {
    // NB not called if map is used, only if paste/typed into field
    setFieldValue('mapSelection', getGeoFeatures(value));
    if (!value) {
      setFieldValue('isMapAreaValid', true);
    } else {
      const isGeometryValid = isWKTValid(value);
      setFieldValue('isMapAreaValidWKT', isGeometryValid);
      const features = wkt.parse(value);
      if (features) {
        const isAreaValid = checkRasterSize
          ? isRasterSizeWithinLimits(features, resolution)
          : Math.ceil(getFeatureArea(features)) <= MAP.MAX_GEOMETRY_AREA.value;
        setFieldValue('isMapAreaValid', isAreaValid);
        setFieldValue('isMapAreaValidWKT', true);
      }
    }
  };

  const onWildfireFormSubmit = formData => {
    // rename properties to match what server expects
    const boundary_conditions = Object.values(formData.boundaryConditions).map(
      obj => ({
        time: Number(obj.timeOffset),
        w_dir: Number(obj.windDirection),
        w_speed: Number(obj.windSpeed),
        moisture: Number(obj.fuelMoistureContent),
        fireBreak: obj.fireBreak
          ? // filter out any 'fireBreak' keys which are just empy arrays
            Object.entries(obj.fireBreak).reduce(
              (acc, [key, value]) =>
                value.length
                  ? {
                      ...acc,
                      [key]: getWKTfromFeature(value),
                    }
                  : acc,
              {},
            )
          : {},
      }),
      [],
    );

    const transformedGeometry = getWKTfromFeature(formData.mapSelection);
    const startDateTime = new Date(formData.ignitionDateTime).toISOString();
    const endDateTime = new Date(
      moment(startDateTime)
        .add(formData.hoursOfProjection, 'hours')
        .toISOString()
        .slice(0, 19),
    );

    const payload = {
      data_types: WILDFIRE_LAYER_TYPES.map(item => item.id),
      geometry: transformedGeometry,
      geometry_buffer_size: DEFAULT_WILDFIRE_GEOMETRY_BUFFER,
      title: formData.simulationTitle,
      parameters: {
        description: formData.simulationDescription,
        start: startDateTime,
        end: endDateTime,
        time_limit: Number(formData.hoursOfProjection),
        probabilityRange: Number(formData.probabilityRange),
        do_spotting: formData.simulationFireSpotting,
        boundary_conditions,
      },
    };

    dispatch(postMapRequest(payload));
    dispatch(fetchMapRequests());
    backToOnDemandPanel();
  };

  return (
    <div className="page-content">
      <div className="mx-2 sign-up-aoi-map-bg">
        <Row>
          <Col xl={5} className="mb-3">
            <Row className="d-flex align-items-baseline">
              <Col xl={4} className="d-flex align-items-baseline">
                <p className="alert-title">{t('Data Layers')}</p>
                <button
                  type="button"
                  className="btn float-end mt-1 py-0 px-1"
                  aria-label="refresh-events"
                  onClick={() => {
                    dispatch(setFilteredAlerts(allMapRequests));
                  }}
                >
                  <i className="mdi mdi-sync"></i>
                </button>
              </Col>
              <Col xl={8}>
                {activeTab < 2 ? (
                  <Nav className="d-flex flex-nowrap" pills fill>
                    <NavItem>
                      <NavLink
                        className={
                          activeTab === DATA_LAYERS_PANELS.mapLayers
                            ? 'active'
                            : ''
                        }
                        onClick={() =>
                          setActiveTab(DATA_LAYERS_PANELS.mapLayers)
                        }
                      >
                        {t('operational-map-layer', { ns: 'dataLayers' })}
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={
                          activeTab === DATA_LAYERS_PANELS.onDemandMapLayers
                            ? 'active'
                            : ''
                        }
                        onClick={() =>
                          setActiveTab(DATA_LAYERS_PANELS.onDemandMapLayers)
                        }
                      >
                        {t('on-demand-map-layer', { ns: 'dataLayers' })}
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
            {activeTab === DATA_LAYERS_PANELS.mapLayers && (
              <DataLayer
                operationalMapLayers={filterNodesByProperty(dataLayers, {
                  domain: dataDomain,
                })}
                operationalDomainOptions={operationalDomainOptions}
                dispatch={dispatch}
                metaData={metaData}
                isMetaDataLoading={isMetaDataLoading}
                {...sharedMapLayersProps}
              />
            )}
          </TabPane>
          <TabPane tabId={DATA_LAYERS_PANELS.onDemandMapLayers}>
            {activeTab === DATA_LAYERS_PANELS.onDemandMapLayers && (
              <OnDemandDataLayer
                mapRequests={filterNodesByProperty(allMapRequests, {
                  domain: dataDomain,
                })}
                onDemandDomainOptions={onDemandDomainOptions}
                dispatch={dispatch}
                setActiveTab={setActiveTab}
                {...sharedMapLayersProps}
              />
            )}
          </TabPane>
          <TabPane tabId={DATA_LAYERS_PANELS.fireAndBurnedAreas}>
            {/* ternary here to unmount and clear form */}
            {activeTab === DATA_LAYERS_PANELS.fireAndBurnedAreas ? (
              <FireAndBurnedArea
                t={t}
                handleResetAOI={handleResetAOI}
                backToOnDemandPanel={backToOnDemandPanel}
                mapInputOnChange={mapInputOnChange}
                isRasterSizeWithinLimits={isRasterSizeWithinLimits}
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
                mapInputOnChange={mapInputOnChange}
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
                mapInputOnChange={mapInputOnChange}
                onSubmit={onWildfireFormSubmit}
              />
            ) : null}
          </TabPane>
        </TabContent>
      </div>
    </div>
  );
};

DataLayerDashboard.propTypes = {
  t: PropTypes.func,
};

export default withTranslation(['common', 'dataLayers'])(DataLayerDashboard);
