import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button, Input } from 'reactstrap';
import { FlyToInterpolator, IconLayer } from 'deck.gl';
import _ from 'lodash';
import Pagination from 'rc-pagination';
import moment from 'moment';
import BaseMap from '../../components/BaseMap/BaseMap';
import { getAllFireAlerts } from '../../store/appAction';
import firePin from '../../assets/images/atoms-general-icon-fire-drop.png'

import 'rc-pagination/assets/index.css';
import Alert from './Alert';
import Tooltip from './Tooltip';
import DateRangePicker from '../../components/DateRangePicker/DateRangePicker';

const ICON_MAPPING = {
  marker: { x: 0, y: 0, width: 100, height: 100, mask: true }
};
const PAGE_SIZE = 4;

const getDefaultDateRange = () => {
  const from = moment(new Date()).add(-3, 'days').format('DD-MM-YYYY');
  const to = moment(new Date()).format('DD-MM-YYYY');
  return [from, to];
}

const FireAlerts = () => {
  const defaultAoi = useSelector(state => state.user.defaultAoi);
  const alerts = useSelector(state => state.alerts.allAlerts);
  const [iconLayer, setIconLayer] = useState(undefined);
  const [viewState, setViewState] = useState(undefined);
  const [sortByDate, setSortByDate] = useState('desc');
  const [alertSource, setAlertSource] = useState('all');
  const [dateRange, setDateRange] = useState(getDefaultDateRange());
  const [alertId, setAlertId] = useState(undefined);
  const [hoverInfo, setHoverInfo] = useState({});
  const [filteredAlerts, setFilteredAlerts] = useState(alerts);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedAlerts, setPaginatedAlerts] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllFireAlerts());
  }, []);

  useEffect(() => {
    if (alerts.length > 0) {
      setIconLayer(getIconLayer(alerts));
      setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel))
      setPaginatedAlerts(_.cloneDeep(alerts.slice(0, PAGE_SIZE)))
    }
  }, [alerts]);

  // useEffect(() => {
  //   setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel));
  //   dispatch(getAllFireAlerts(
  //     {
  //       sortOrder: sortByDate,
  //       source: alertSource,
  //       from: dateRange[0],
  //       to: dateRange[1]
  //     }
  //   ));
  //   setIconLayer(getIconLayer(alerts));
  // }, [sortByDate, alertSource]);

  useEffect(() => {
    setIconLayer(getIconLayer(filteredAlerts));
    setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel))
    setCurrentPage(1);
    hideTooltip();
    setPaginatedAlerts(_.cloneDeep(filteredAlerts.slice(0, PAGE_SIZE)))
  }, [filteredAlerts]);

  useEffect(() => {
    if (alertSource === 'all')
      setFilteredAlerts(alerts);
    else
      setFilteredAlerts(_.filter(alerts, { source: alertSource }));
  }, [alertSource]);

  useEffect(() => {
    setFilteredAlerts(_.orderBy(filteredAlerts, ['timestamp'], [sortByDate]));
  }, [sortByDate]);

  const updatePage = page => {
    setCurrentPage(page);
    const to = PAGE_SIZE * page;
    const from = to - PAGE_SIZE;
    setPaginatedAlerts(_.cloneDeep(filteredAlerts.slice(from, to)));
  };

  const setSelectedAlert = (id) => {
    if (id) {
      setAlertId(id);
      let alertsToEdit = _.cloneDeep(alerts);
      let selectedAlert = _.find(alertsToEdit, { id });
      selectedAlert.isSelected = true;
      setIconLayer(getIconLayer(alertsToEdit));
      setHoverInfo({ object: selectedAlert, coordinate: selectedAlert.geometry.coordinates });
      // setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel));
    } else {
      setAlertId(undefined);
      setIconLayer(getIconLayer(alerts));
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
    console.log(dates)
    let from = moment(dates[0]).format('DD-MM-YYYY');
    let to = moment(dates[1]).format('DD-MM-YYYY');
    setDateRange([from, to]);
  }

  const handleResetAOI = useCallback(() => {
    setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel))
  }, []);

  const hideTooltip = (e) => {
    console.log('hideTooltip', e)
    setHoverInfo({});
  };
  const showTooltip = info => {
    console.log('showTooltip', info)
    if (info.picked && info.object) {
      setSelectedAlert(info.object.id);
      setHoverInfo(info);
    } else {
      setHoverInfo({});
    }
  };

  const renderTooltip = (info) => {
    const { object, coordinate } = info;
    if (object) {
      return <Tooltip
        key={object.id}
        object={object}
        coordinate={coordinate}
      />
    }
    if (!object) {
      return null;
    }
  }

  const getCard = (card, index) => {
    return (
      <Alert
        key={index}
        card={card}
        setSelectedAlert={setSelectedAlert}
        alertId={alertId} />
    )
  }

  return (
    <div className='page-content'>
      <Row className='g-0'>
        <Row>
          <Col xl={11} md={10} xs={12} className='mx-auto sign-up-aoi-map-bg mb-2.5'>
            <Row className='m-4 d-flex flex-row'>
              <Col xl={4}>Alert List</Col>
              <Col xl={4} className='text-center'>
                <Button className='btn'
                  onClick={handleResetAOI}>Default AOI</Button>
              </Col>
              <Col xl={4}>
                <DateRangePicker setDates={handleDateRangePicker} defaultDateRange={dateRange} />
              </Col>
            </Row>
            <Row>
              <Col xl={5}>
                <Row>
                  <Col xl={4}>
                    <Input
                      id="sortByDate"
                      className="btn-sm"
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
                      className="btn-sm"
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
                  <Col xl={4}>Results {filteredAlerts.length}</Col>
                </Row>
                <Row>
                  <Col xl={12} className='p-3'>
                    <Row>
                      {
                        paginatedAlerts.map((alert, index) => getCard(alert, index))
                      }
                    </Row>
                    <Row className='text-center'>
                      <Pagination
                        pageSize={PAGE_SIZE}
                        onChange={updatePage}
                        current={currentPage}
                        total={alerts.length}
                      />
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col xl={7} className='mx-auto'>
                <Row style={{ height: 700 }} className="mb-5">
                  <BaseMap
                    layers={[iconLayer]}
                    initialViewState={viewState}
                    hoverInfo={hoverInfo}
                    renderTooltip={renderTooltip}
                    onClick={showTooltip}
                    onViewStateChange={hideTooltip}
                    screenControlPosition='top-right'
                    navControlPosition='bottom-right'
                  />
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Row >
    </div >

  );
}

export default FireAlerts;
