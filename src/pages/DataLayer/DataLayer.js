import React, { useEffect, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button, Input, Card, InputGroup, InputGroupText } from 'reactstrap';
import { BitmapLayer, FlyToInterpolator } from 'deck.gl';
import moment from 'moment';

import BaseMap from '../../components/BaseMap/BaseMap';
import { getAllDataLayers } from '../../store/appAction';

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
  VictoryLabel,
  VictoryScatter,
  VictoryTooltip
} from 'victory';
import {GeoJsonLayer, IconLayer} from '@deck.gl/layers';

const SLIDER_SPEED = 800;
const DataLayer = ({ t, searchDataLayers }) => {
  const defaultAoi = useSelector(state => state.user.defaultAoi);
  const globalDataLayers = useSelector(state => state.dataLayer.dataLayers);
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

  const [tempSelectedPixel, setTempSelectedPixel] = useState([]);
  const [selectedPixel, setSelectedPixel] = useState([]);
  const [tempGeoJsonLayerData, setTempGeoJsonLayerData] = useState(null);
  const [geoJsonLayerData, setGeoJsonLayerData] = useState(null);
  const [tempLayerData, setTempLayerData] = useState(null);
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
        start: dateRange[0],
        end: dateRange[1],
        // bbox: boundingBox ? boundingBox.toString() : undefined, //disabled since bbox value won't return data 
        default_start: false,
        default_end: false,
        default_bbox: false,
        ...dateRangeParams,
      }
    ));
  }, [layerSource, dataDomain, sortByDate, dateRange, boundingBox]);

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

  const generateGeoJson = (data)=> {
    const tempGeo = new GeoJsonLayer({
      id: 'geojson-layer',
      data: [
        {
          'type': 'Feature',
          'properties': {},
          'geometry': {
            'type': 'Point',
            'coordinates': data.coordinate
          }
        }
      ],
      pointType: 'circle',
      pickable: true,
      getPointRadius: 10000,
      getFillColor: [128, 128, 128, 128],
      getLineColor:[0,0,0,255],
      // getLineWidth: 5000,
      lineWidthScale: 20,
      lineWidthMinPixels: 1,
      getLineWidth: 1,
      stroked:true,
      filled:true,
    });
    getIconLayer()
    const layer = new IconLayer({
      id: 'IconLayer',
      data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-stations.json',
  
      /* props from IconLayer class */
  
      // alphaCutoff: 0.05,
      // billboard: true,
      // getAngle: 0,
      getColor: d => [Math.sqrt(d.exits), 140, 0],
      getIcon: () => 'marker',
      // getPixelOffset: [0, 0],
      getPosition: d => d.coordinates,
      getSize: () => 5,
      iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
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
      // onIconError: null,
      // sizeMaxPixels: Number.MAX_SAFE_INTEGER,
      // sizeMinPixels: 0,
      sizeScale: 8,
      // sizeUnits: 'pixels',
  
      /* props inherited from Layer class */
  
      // autoHighlight: false,
      // coordinateOrigin: [0, 0, 0],
      // coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
      // highlightColor: [0, 0, 128, 128],
      // modelMatrix: null,
      // opacity: 1,
      pickable: true,
      // visible: true,
      // wrapLongitude: false,
    });
    setTempLayerData(layer);
    setTempSelectedPixel(data.coordinate);
    setTempGeoJsonLayerData(tempGeo);
  }

  const prev = [
    { x: '2020-01', y: 1.1235, label: 5 },
    { x: '2020-02', y: 4.32332, label: 5 },
    { x: '2020-03', y: 3.87543, label: 5 },
    { x: '2020-04', y: 1.1251, label: 5 },
    { x: '2020-05', y: 2.123241, label: 5 },
    { x: '2020-06', y: 3.5231, label: 5 }
  ];

  const xAxisLabelFormatter = (tick, index, ticks) => {
    console.log(ticks, dataLayers, currentLayer);
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
          <Card className='map-card mb-0' style={{ height: 670 }}>
            <ContextMenuTrigger id={'map'}>
              <BaseMap
                layers={[bitmapLayer, tempGeoJsonLayerData, tempLayerData]}
                initialViewState={viewState}
                widgets={[]}
                screenControlPosition='top-right'
                navControlPosition='bottom-right'
                onClick={generateGeoJson}
              />
            </ContextMenuTrigger>
            <ContextMenu id={'map'} className="menu">
              <MenuItem className="menuItem" onClick={()=> { setSelectedPixel(tempSelectedPixel); setGeoJsonLayerData(null);} }>
                Display Layer Info
              </MenuItem>
              <MenuItem className="menuItem" onClick={()=> { setSelectedPixel([]); setGeoJsonLayerData(tempGeoJsonLayerData); }}>
                Time Series Chart
              </MenuItem>
            </ContextMenu>
            {getSlider()}
            {getLegend()}
            {getCurrentTimestamp()}
          </Card>
        </Col>
      </Row>      
      {selectedPixel?.length > 0 && <div className='m-2 sign-up-aoi-map-bg'>Pixel: {selectedPixel.join(', ').replace(/\d+\.\d+/g, function(match) {
        return Number(match).toFixed(6);
      })}</div>}
      {geoJsonLayerData && <div  className='m-2 sign-up-aoi-map-bg d-flex'>
        <div className='w-50'>
          <VictoryChart style={{ bar: { size: 50, width: 100, strokeWidth: 100,}}}>
            <VictoryAxis
              tickValues={tickValues}
              tickFormat={xAxisLabelFormatter}
              tickLabelComponent={<VictoryLabel style={{ data: { stroke: '#F47938' } }} />}
            />
            <VictoryAxis dependentAxis size={50} style={{ data: { stroke: '#F47938' } }} />

            <VictoryLine data={prev} size={20} style={{ data: { stroke: '#F47938' } }} labelComponent={<VictoryTooltip cornerRadius={2}
              pointerLength={0}/>} />
            <VictoryScatter size={5} data={prev} labelComponent={<VictoryTooltip cornerRadius={2}
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
      </div>}
    </div >
  );
}

DataLayer.propTypes = {
  t: PropTypes.any,
  searchDataLayers: PropTypes.func
}

export default withTranslation(['common'])(DataLayer);
