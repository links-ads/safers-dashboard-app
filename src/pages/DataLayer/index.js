import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button, Input, Card, InputGroup, InputGroupText } from 'reactstrap';
import { FlyToInterpolator } from 'deck.gl';
import moment from 'moment';

import BaseMap from '../../components/BaseMap/BaseMap';
import { getAllDataLayers } from '../../store/appAction';

import DateRangePicker from '../../components/DateRangePicker/DateRange';
import TreeView from './TreeView';

const getDefaultDateRange = () => {
  const from = moment(new Date()).add(-3, 'days').format('DD-MM-YYYY');
  const to = moment(new Date()).format('DD-MM-YYYY');
  return [from, to];
}

const DataLayer = () => {
  const defaultAoi = useSelector(state => state.user.defaultAoi);
  const dataLayers = useSelector(state => state.dataLayer.dataLayers);
  const currentLayer = useSelector(state => state.dataLayer.currentLayer);
  const [viewState, setViewState] = useState(undefined);
  const [sortByDate, setSortByDate] = useState('desc');
  const [layerSource, setLayerSource] = useState('all');
  const [dateRange, setDateRange] = useState(getDefaultDateRange());
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllDataLayers(
      {
        sortOrder: sortByDate,
        source: layerSource,
        from: dateRange[0],
        to: dateRange[1]
      }
    ));
  }, []);

  useEffect(() => {
    //TODO: when single layer selected
  }, [currentLayer]);

  useEffect(() => {
    if (dataLayers.length > 0) {
      if (!viewState) {
        setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel))
      }
    }
  }, [dataLayers]);

  useEffect(() => {
    //TODO: filter and sort UI logics
    dispatch(getAllDataLayers(
      {
        sortOrder: sortByDate,
        source: layerSource,
        from: dateRange[0],
        to: dateRange[1]
      }
    ));
  }, [layerSource, sortByDate]);

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

  const handleDateRangePicker = (dates) => {
    let from = moment(dates[0]).format('DD-MM-YYYY');
    let to = moment(dates[1]).format('DD-MM-YYYY');
    setDateRange([from, to]);
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
                      <option value={'desc'} >Sort By : Date desc</option>
                      <option value={'asc'} >Sort By : Date asc</option>
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
                      <option value={'all'} >Source : All</option>
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
                      onChange={(e) => setLayerSource(e.target.value)}
                      value={layerSource}
                    >
                      <option value={'all'} >Data Domain : All</option>
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
                <DateRangePicker setDates={handleDateRangePicker} />
              </Col>
            </Row>
            <Row>
              <Col>
                <TreeView
                  data={dataLayers}
                />
              </Col>
            </Row>
          </Col>
          <Col xl={7} className='mx-auto'>
            <Card className='map-card mb-0' style={{ height: 670 }}>
              <BaseMap
                layers={[]}
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