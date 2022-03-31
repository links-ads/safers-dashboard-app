import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button, Input, Card } from 'reactstrap';
import { FlyToInterpolator, IconLayer } from 'deck.gl';
import _ from 'lodash';
import moment from 'moment';
import toastr from 'toastr';
import Tree from 'rsuite/Tree';

import BaseMap from '../../components/BaseMap/BaseMap';
import { getAllFireAlerts, resetAlertsResponseState } from '../../store/appAction';
import firePin from '../../assets/images/atoms-general-icon-fire-drop.png'

import 'toastr/build/toastr.min.css';
import 'rsuite/dist/rsuite.min.css';
import DateRangePicker from '../../components/DateRangePicker/DateRange';

const ICON_MAPPING = {
  marker: { x: 0, y: 0, width: 100, height: 100, mask: true }
};
const getDefaultDateRange = () => {
  const from = moment(new Date()).add(-3, 'days').format('DD-MM-YYYY');
  const to = moment(new Date()).format('DD-MM-YYYY');
  return [from, to];
}

const DataLayer = () => {
  const defaultAoi = useSelector(state => state.user.defaultAoi);
  const alerts = useSelector(state => state.alerts.allAlerts);
  const success = useSelector(state => state.alerts.success);
  const [iconLayer, setIconLayer] = useState(undefined);
  const [viewState, setViewState] = useState(undefined);
  const [sortByDate, setSortByDate] = useState('desc');
  const [alertSource, setAlertSource] = useState('all');
  const [midPoint, setMidPoint] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(undefined);
  const [dateRange, setDateRange] = useState(getDefaultDateRange());
  const [alertId, setAlertId] = useState(undefined);
  const [hoverInfo, setHoverInfo] = useState({});
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllFireAlerts(
      {
        sortOrder: sortByDate,
        source: alertSource,
        from: dateRange[0],
        to: dateRange[1]
      }
    ));
  }, []);

  useEffect(() => {
    if (success?.detail) {
      toastr.success(success.detail, '');
    }
    dispatch(resetAlertsResponseState());

  }, [success]);

  useEffect(() => {
    if (alerts.length > 0) {
      setIconLayer(getIconLayer(alerts));
      if (!viewState) {
        setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel))
      }
      setFilteredAlerts(alerts);
    }
  }, [alerts]);

  useEffect(() => {
    setIconLayer(getIconLayer(filteredAlerts));
    if (!viewState) {
      setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel));
    }
    hideTooltip();
  }, [filteredAlerts]);

  useEffect(() => {
    setAlertId(undefined);
    if (alertSource === 'all')
      setFilteredAlerts(alerts);
    else
      setFilteredAlerts(_.filter(alerts, { source: alertSource }));
  }, [alertSource]);

  useEffect(() => {
    setAlertId(undefined);
    setFilteredAlerts(_.orderBy(filteredAlerts, ['timestamp'], [sortByDate]));
  }, [sortByDate]);

  const getInfoByArea = () => {

    const rangeFactor = (1 / zoomLevel) * 18;
    const left = midPoint[0] - rangeFactor; //minLong
    const right = midPoint[0] + rangeFactor; //maxLong
    const top = midPoint[1] + rangeFactor; //maxLat
    const bottom = midPoint[1] - rangeFactor; //minLat

    const boundaryBox = [
      [left, top],
      [right, top],
      [right, bottom],
      [left, bottom]
    ];

    // console.log(zoomLevel, rangeFactor, midPoint, boundaryBox);

    dispatch(getAllFireAlerts(
      {
        sortOrder: sortByDate,
        source: alertSource,
        from: dateRange[0],
        to: dateRange[1],
        boundaryBox
      }
    ));
  }

  const setSelectedAlert = (id, isEdit) => {
    if (id) {
      if (id === alertId) {
        hideTooltip();
      }
      setAlertId(id);
      let alertsToEdit = _.cloneDeep(filteredAlerts);
      let selectedAlert = _.find(alertsToEdit, { id });
      selectedAlert.isSelected = true;
      setIconLayer(getIconLayer(alertsToEdit));
      setHoverInfo({ object: selectedAlert, coordinate: selectedAlert.geometry.coordinates, isEdit });
      // setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel));
    } else {
      setAlertId(undefined);
      setIconLayer(getIconLayer(filteredAlerts));
    }
  }

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

  const getIconLayer = (alerts) => {
    return (new IconLayer({
      data: alerts,
      pickable: true,
      getPosition: d => d.geometry.coordinates,
      iconAtlas: firePin,
      iconMapping: ICON_MAPPING,
      // onHover: !hoverInfo.objects && setHoverInfo,
      id: 'icon',
      getIcon: () => 'marker',
      getColor: d => { return (d.isSelected ? [226, 123, 29] : [230, 51, 79]) },
      sizeMinPixels: 80,
      sizeMaxPixels: 100,
      sizeScale: 0.5,
    }))
  }

  const handleDateRangePicker = (dates) => {
    let from = moment(dates[0]).format('DD-MM-YYYY');
    let to = moment(dates[1]).format('DD-MM-YYYY');
    setDateRange([from, to]);
  }

  const handleResetAOI = useCallback(() => {
    setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel))
  }, []);

  const hideTooltip = (e) => {
    if (e && e.viewState) {
      setMidPoint([e.viewState.longitude, e.viewState.latitude]);
      setZoomLevel(e.viewState.zoom);
    }
    setHoverInfo({});
  };

  const showTooltip = info => {
    console.log(info);
    if (info.picked && info.object) {
      setSelectedAlert(info.object.id);
      setHoverInfo(info);
    } else {
      setHoverInfo({});
    }
  };

  const getSearchButton = (index) => {
    return (
      <Button
        key={index}
        className="btn-rounded alert-search-area"
        style={{
          position: 'absolute',
          top: 10,
          textAlign: 'center',
          marginLeft: '41%'
        }}
        onClick={getInfoByArea}
      >
        <i className="bx bx-revision"></i>{' '}
        Search This Area
      </Button >
    )
  }

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
                      id="alertSource"
                      className="btn-sm sort-select-input"
                      name="alertSource"
                      placeholder="Source"
                      type="select"
                      onChange={(e) => setAlertSource(e.target.value)}
                      value={alertSource}
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
                      onChange={(e) => setAlertSource(e.target.value)}
                      value={alertSource}
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
                  onClick={handleResetAOI} className='align-self-baseline pe-0'>
                  Default AOI
                </Button>
              </Col>
            </Row>
            <hr />
            <Row>
              <DateRangePicker setDates={handleDateRangePicker} />
            </Row>
            <Row>
              <Tree
                data={[
                  {
                    'label': 'Fire',
                    'value': 1,
                    'children':
                      [
                        {
                          'label': 'Links',
                          'value': 11,
                          'children':
                            [
                              {
                                'label': 'Soil Burn Severity',
                                'value': 111,
                              },
                              {
                                'label': 'Wid Forecast',
                                'value': 111,
                              },
                            ]
                        }
                      ]
                  }
                ]}
                defaultExpandAll showIndentLine />
            </Row>
          </Col>
          <Col xl={7} className='mx-auto'>
            <Card className='map-card mb-0' style={{ height: 670 }}>
              <BaseMap
                layers={[iconLayer]}
                initialViewState={viewState}
                hoverInfo={hoverInfo}
                onClick={showTooltip}
                onViewStateChange={hideTooltip}
                widgets={[getSearchButton]}
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
