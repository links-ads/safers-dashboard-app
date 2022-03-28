import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button, Input, Card } from 'reactstrap';
import { FlyToInterpolator, IconLayer } from 'deck.gl';
import _ from 'lodash';
import Pagination from 'rc-pagination';
import moment from 'moment';
import toastr from 'toastr';

import BaseMap from '../../components/BaseMap/BaseMap';
import { getAllFireAlerts, setFavoriteAlert, resetAlertsResponseState, validateAlert, editAlertInfo } from '../../store/appAction';
import firePin from '../../assets/images/atoms-general-icon-fire-drop.png'

import 'toastr/build/toastr.min.css'
import 'rc-pagination/assets/index.css';
import Alert from './Alert';
import Tooltip from './Tooltip';
import DateRangePicker from '../../components/DateRangePicker/DateRangePicker';

const PAGE_SIZE = 4;
const ICON_MAPPING = {
  marker: { x: 0, y: 0, width: 100, height: 100, mask: true }
};
const getDefaultDateRange = () => {
  const from = moment(new Date()).add(-3, 'days').format('DD-MM-YYYY');
  const to = moment(new Date()).format('DD-MM-YYYY');
  return [from, to];
}

const FireAlerts = () => {
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
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedAlerts, setPaginatedAlerts] = useState([]);
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
    if (!viewState) {
      setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel));
    }
    setCurrentPage(1);
    hideTooltip();
    setPaginatedAlerts(_.cloneDeep(filteredAlerts.slice(0, PAGE_SIZE)))
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

  const getAlertsByArea = () => {

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

  const setFavorite = (id) => {
    let selectedAlert = _.find(filteredAlerts, { id });
    selectedAlert.isFavorite = !selectedAlert.isFavorite;
    dispatch(setFavoriteAlert(id, selectedAlert.isFavorite));
    const to = PAGE_SIZE * currentPage;
    const from = to - PAGE_SIZE;
    setPaginatedAlerts(_.cloneDeep(filteredAlerts.slice(from, to)));

    // updatePage(currentPage);
  }

  const validateEvent = (id) => {
    let selectedAlert = _.find(filteredAlerts, { id });
    selectedAlert.status = 'VALIDATED';
    dispatch(validateAlert(id));
    const to = PAGE_SIZE * currentPage;
    const from = to - PAGE_SIZE;
    setPaginatedAlerts(_.cloneDeep(filteredAlerts.slice(from, to)));
  }

  const editInfo = (id, desc) => {
    let selectedAlert = _.find(filteredAlerts, { id });
    selectedAlert.description = desc;
    dispatch(editAlertInfo(id, desc));
    const to = PAGE_SIZE * currentPage;
    const from = to - PAGE_SIZE;
    setPaginatedAlerts(_.cloneDeep(filteredAlerts.slice(from, to)));
  }

  const updatePage = page => {
    setAlertId(undefined);
    setIconLayer(getIconLayer(filteredAlerts));
    setCurrentPage(page);
    const to = PAGE_SIZE * page;
    const from = to - PAGE_SIZE;
    hideTooltip();
    setPaginatedAlerts(_.cloneDeep(filteredAlerts.slice(from, to)));
  };

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

  const renderTooltip = (info) => {
    const { object, coordinate, isEdit } = info;
    if (object) {
      return <Tooltip
        key={object.id}
        object={object}
        coordinate={coordinate}
        isEdit={isEdit}
        setFavorite={setFavorite}
        validateEvent={validateEvent}
        editInfo={editInfo}
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
        setFavorite={setFavorite}
        alertId={alertId} />
    )
  }

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
        onClick={getAlertsByArea}
      >
        <i className="bx bx-revision"></i>{' '}
        Search This Area
      </Button >
    )
  }

  return (
    <div className='page-content'>
      <div className='mx-2 sign-up-aoi-map-bg'>
        <Row className='mx-4 d-flex flex-row'>
          <Col xl={4}>Alert List</Col>
          <Col xl={4} className='text-center'>
            <Button color='link'
              onClick={handleResetAOI}>Default AOI</Button>
          </Col>
          <Col xl={4}>
            <DateRangePicker setDates={handleDateRangePicker} defaultDateRange={dateRange} />
          </Col>
        </Row>
        <Row>
          <Col xl={5}>
            <hr />
            <Row>
              <Col className='mx-0'>
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
              <Col xl={3} className="d-flex justify-content-end">
                <span className='my-auto alert-report-text'>Results {filteredAlerts.length}</span></Col>
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
                    total={filteredAlerts.length}
                  />
                </Row>
              </Col>
            </Row>
          </Col>
          <Col xl={7} className='mx-auto'>
            <Card className='map-card mb-0' style={{ height: 670 }}>
              <BaseMap
                layers={[iconLayer]}
                initialViewState={viewState}
                hoverInfo={hoverInfo}
                renderTooltip={renderTooltip}
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

export default FireAlerts;
