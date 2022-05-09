import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button, Input, Card, InputGroup, InputGroupText } from 'reactstrap';
import { BitmapLayer, FlyToInterpolator } from 'deck.gl';
import moment from 'moment';

import BaseMap from '../../components/BaseMap/BaseMap';
import { getAllDataLayers } from '../../store/appAction';

import DateRangePicker from '../../components/DateRangePicker/DateRange';
import TreeView from './TreeView';
// import { getDefaultDateRange } from '../../store/utility';

const LON_BASE_POINT = 16;
const LAT_BASE_POINT = 12;

const DataLayer = () => {
  const defaultAoi = useSelector(state => state.user.defaultAoi);
  const dataLayers = useSelector(state => state.dataLayer.dataLayers);
  const [currentLayer, setCurrentLayer] = useState(undefined);
  const [bitmapLayer, setBitmapLayer] = useState(undefined);
  const [boundaryBox, setBoundaryBox] = useState(undefined);
  const [viewState, setViewState] = useState(undefined);
  const [sortByDate, setSortByDate] = useState(undefined);
  const [layerSource, setLayerSource] = useState(undefined);
  const [dataDomain, setDataDomain] = useState(undefined);
  const [dateRange, setDateRange] = useState([undefined, undefined]);
  const dispatch = useDispatch();

  useEffect(() => {
    setBoundaryBox(
      getBoundaryBox(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel));
  }, [defaultAoi]);

  useEffect(() => {
    if (currentLayer && currentLayer.url) {
      const imageUrl = currentLayer.url.replace('{bbox}', boundaryBox);
      setBitmapLayer(getBitmapLayer(imageUrl));
    }
  }, [currentLayer]);

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
        // bbox: boundaryBox ? boundaryBox.toString() : undefined, //disabled since bbox value won't return data 
        default_start: false,
        default_end: false,
        default_bbox: false
      }
    ));
  }, [layerSource, dataDomain, sortByDate, dateRange, boundaryBox]);

  const getViewState = (midPoint, zoomLevel = 4) => {
    return {
      longitude: midPoint[0],
      latitude: midPoint[1],
      zoom: zoomLevel + 1.25,
      pitch: 0,
      bearing: 0,
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator()
    };
  }

  const getBitmapLayer = (url) => {
    return (new BitmapLayer({
      id: 'bitmap-layer',
      bounds: boundaryBox,
      image: url
    }))
  }

  const getBoundaryBox = (midPoint, zoomLevel) => {
    const lonRangeFactor = (1 / zoomLevel) * LON_BASE_POINT;
    const latRangeFactor = (1 / zoomLevel) * LAT_BASE_POINT;
    const left = midPoint[0] - lonRangeFactor; //minLongX
    const right = midPoint[0] + lonRangeFactor; //maxLongX
    const top = midPoint[1] + latRangeFactor; //maxLatY
    const bottom = midPoint[1] - latRangeFactor; //minLatY
    return [left, bottom, right, top];
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
              <p className='align-self-baseline alert-title'>Data Layers</p>
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
                      <option value={'-date'} >Sort By : Date desc</option>
                      <option value={'date'} >Sort By : Date asc</option>
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
                  Default AOI
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
                widgets={[/*search button or any widget*/]}
                screenControlPosition='top-right'
                navControlPosition='bottom-right'
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div >
  );
}

export default DataLayer;