import React, { useEffect, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button, Input, Card, InputGroup, InputGroupText } from 'reactstrap';
import { BitmapLayer, FlyToInterpolator } from 'deck.gl';
import moment from 'moment';

import BaseMap from '../../components/BaseMap/BaseMap';
import { getAllDataLayers } from '../../store/appAction';

import DateRangePicker from '../../components/DateRangePicker/DateRange';
import TreeView from './TreeView';
// import { getDefaultDateRange } from '../../store/utility';

//i18n
import { withTranslation } from 'react-i18next'
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css'
import { getBoundingBox } from '../../helpers/mapHelper';


const DataLayer = ({ t }) => {
  const defaultAoi = useSelector(state => state.user.defaultAoi);
  const dataLayers = useSelector(state => state.dataLayer.dataLayers);
  const [currentLayer, setCurrentLayer] = useState(undefined);
  const [bitmapLayer, setBitmapLayer] = useState(undefined);
  const [boundingBox, setBoundingBox] = useState(undefined);
  const [viewState, setViewState] = useState(undefined);
  const [sortByDate, setSortByDate] = useState(undefined);
  const [layerSource, setLayerSource] = useState(undefined);
  const [dataDomain, setDataDomain] = useState(undefined);
  const [dateRange, setDateRange] = useState([undefined, undefined]);
  const [sliderValue, setSliderValue] = useState(0);
  const [sliderRangeLimit, setSliderRangeLimit] = useState(0);
  const [sliderChangeComplete, setSliderChangeComplete] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const dispatch = useDispatch();
  const timer = useRef(null);

  useEffect(() => {
    setBoundingBox(
      getBoundingBox(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel));
  }, [defaultAoi]);

  useEffect(() => {
    setSliderValue(0);
    setIsPlaying(false);
    if (currentLayer && currentLayer.urls) {
      const imageUrl = currentLayer.urls[0].replace('{bbox}', boundingBox);
      setBitmapLayer(getBitmapLayer(imageUrl));
      setSliderRangeLimit(currentLayer.urls.length);
    }
  }, [currentLayer]);

  useEffect(() => {
    if (sliderChangeComplete && currentLayer && currentLayer.urls && currentLayer.urls[sliderValue]) {
      const imageUrl = currentLayer.urls[sliderValue].replace('{bbox}', boundingBox);
      setBitmapLayer(getBitmapLayer(imageUrl));
    }
  }, [sliderValue, sliderChangeComplete]);

  useEffect(() => {
    let nextValue = sliderValue;
    if (isPlaying) {
      timer.current = setInterval(() => {
        nextValue += 1;
        setSliderValue(nextValue);
      }, 2000);
    }
    else {
      clearInterval(timer.current);
      //setSliderValue(0);
    }
  }, [isPlaying]);

  // useEffect(() => {
  //   let animation = 0;
  //   if (isPlaying) {
  //     animation = requestAnimationFrame(() => {
  //       let nextValue = sliderValue + 1;
  //       if (nextValue > sliderRangeLimit) {
  //         nextValue = 0;
  //       }
  //       setTimeout(() => {
  //         if (!isPlaying)
  //           nextValue = 0;

  //         setSliderValue(nextValue);
  //       }, 1000);
  //     });
  //   }
  //   return () => {
  //     if (animation) {
  //       cancelAnimationFrame(animation);
  //       //setSliderValue(0);
  //     }
  //   }
  // });

  useEffect(() => {
    if (dataLayers.length > 0) {
      if (!viewState) {
        setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel))
      }
    }
  }, [dataLayers]);

  useEffect(() => {
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
        default_bbox: false
      }
    ));
  }, [layerSource, dataDomain, sortByDate, dateRange, boundingBox]);

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

  const getSlider = (index) => {
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
          className="btn float-start me-2"
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label='play-data-layers'
        >
          <i className={`mdi ${isPlaying ? 'mdi-play' : 'mdi-stop'}`} />
        </button>
        <Slider
          key={index}
          value={sliderValue}
          orientation="horizontal"
          min={0}
          max={sliderRangeLimit}
          onClick={() => {
            setSliderChangeComplete(true)
          }}
          onChangeStart={() => {
            setIsPlaying(false);
            setSliderChangeComplete(false);
          }}
          onChange={value => setSliderValue(value)}
          onChangeComplete={() => {
            setSliderChangeComplete(true)
          }}
        />
      </div>
    )
  }
  const handleDateRangePicker = (dates) => {
    if (dates) {
      let from = moment(dates[0]).format('YYYY-MM-DD');
      let to = moment(dates[1]).format('YYYY-MM-DD');
      setDateRange([from, to]);
    } else {
      //setDateRange(getDefaultDateRange()); disabled since start/end values won't return data 
      setDateRange([undefined, undefined]);
    }
  }

  const handleResetAOI = useCallback(() => {
    setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel))
  }, []);

  return (
    <div className='page-content'>
      <div className='mx-2 sign-up-aoi-map-bg'>
        <Row>
          <Col xl={5}>
            <Row>
              <p className='align-self-baseline alert-title'>{t('Data Layers', { ns: 'dataLayers' })}</p>
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
              <Col xl={7}>
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
              <Col xl={5}>
                <DateRangePicker setDates={handleDateRangePicker} clearDates={handleDateRangePicker} />
              </Col>
            </Row>
            <Row>
              <Col>
                <TreeView
                  data={dataLayers}
                  setCurrentLayer={setCurrentLayer}
                />
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
            </Card>
          </Col>
        </Row>
      </div>
    </div >
  );
}

DataLayer.propTypes = {
  t: PropTypes.any,
}

export default withTranslation(['common'])(DataLayer);