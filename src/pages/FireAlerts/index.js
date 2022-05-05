import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button, Input, Card } from 'reactstrap';
import { FlyToInterpolator, IconLayer } from 'deck.gl';
import _ from 'lodash';
import Pagination from 'rc-pagination';
import moment from 'moment';
import toastr from 'toastr';

import BaseMap from '../../components/BaseMap/BaseMap';
import { getAllFireAlerts, setFavoriteAlert, validateAlert, editAlertInfo, setAlertApiParams, resetAlertsResponseState, setNewAlertState } from '../../store/appAction';
import firePin from '../../assets/images/atoms-general-icon-fire-drop.png'

import 'toastr/build/toastr.min.css'
import 'rc-pagination/assets/index.css';
import Alert from './Alert';
import Tooltip from './Tooltip';
import DateRangePicker from '../../components/DateRangePicker/DateRange';

const RANGE_BASE_POINT = 18;
const PAGE_SIZE = 4;
const ICON_MAPPING = {
  marker: { x: 0, y: 0, width: 100, height: 100, mask: true }
};
const DEFAULT_SORT_ORDER = 'desc';
const DEFAULT_SOURCE = 'all';

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
  const [sortByDate, setSortByDate] = useState(DEFAULT_SORT_ORDER);
  const [alertSource, setAlertSource] = useState(DEFAULT_SOURCE);
  const [midPoint, setMidPoint] = useState([]);
  const [boundaryBox, setBoundaryBox] = useState(undefined);
  const [zoomLevel, setZoomLevel] = useState(undefined);
  const [dateRange, setDateRange] = useState(getDefaultDateRange());
  const [alertId, setAlertId] = useState(undefined);
  const [hoverInfo, setHoverInfo] = useState({});
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedAlerts, setPaginatedAlerts] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setNewAlertState(false, true));
    return () => {
      dispatch(setAlertApiParams({}));
      dispatch(setNewAlertState(false, false));
    }
  }, []);

  useEffect(() => {
    setBoundaryBox(
      getBoundaryBox(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel));
  }, [defaultAoi]);

  useEffect(() => {
    getAlerts();
  }, [sortByDate, alertSource, dateRange, boundaryBox]);

  useEffect(() => {
    if (success?.detail) {
      toastr.success(success.detail, '');
    }
    dispatch(resetAlertsResponseState());
  }, [success]);

  useEffect(() => {
    var randomBoolean = Math.random() < 0.5;//to simulate new alerts
    if (alerts.length > 0 && filteredAlerts.length === 0) {
      setIconLayer(getIconLayer(alerts));
      if (!viewState) {
        setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel))
      }
      setFilteredAlerts(alerts);
    }
    else if (alerts.length > filteredAlerts.length || randomBoolean/*to simulate new alerts*/) {
      toastr.success('New alerts are received. Please refresh the list.', '', { preventDuplicates: true, });
    }
  }, [alerts]);

  useEffect(() => {
    setIconLayer(getIconLayer(filteredAlerts));
    if (!viewState) {
      setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel));
    }
    setCurrentPage(1);
    hideTooltip();
    setPaginatedAlerts(_.cloneDeep(filteredAlerts.slice(0, PAGE_SIZE)));
  }, [filteredAlerts]);

  const getAlertsByArea = () => {
    setBoundaryBox(getBoundaryBox(midPoint, zoomLevel));
  }

  const setFavorite = (id) => {
    let selectedAlert = _.find(filteredAlerts, { id });
    selectedAlert.isFavorite = !selectedAlert.isFavorite;
    dispatch(setFavoriteAlert(id, selectedAlert.isFavorite));
    const to = PAGE_SIZE * currentPage;
    const from = to - PAGE_SIZE;
    setPaginatedAlerts(_.cloneDeep(filteredAlerts.slice(from, to)));
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

  const getAlerts = () => {
    if (sortByDate && alertSource && dateRange && boundaryBox) {
      setAlertId(undefined);
      const alertParams = {
        sortOrder: sortByDate,
        source: alertSource,
        from: dateRange[0],
        to: dateRange[1],
        bbox: boundaryBox
      };
      dispatch(setAlertApiParams(alertParams));
      dispatch(getAllFireAlerts(alertParams));
    }
  }

  const setSelectedAlert = (id, isEdit) => {
    if (id) {
      if (id === alertId) {
        hideTooltip();
      }
      setAlertId(id);
      let clonedAlerts = _.cloneDeep(filteredAlerts);
      let selectedAlert = _.find(clonedAlerts, { id });
      selectedAlert.isSelected = true;
      setIconLayer(getIconLayer(clonedAlerts));
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

  const getBoundaryBox = (midPoint, zoomLevel) => {
    const rangeFactor = (1 / zoomLevel) * RANGE_BASE_POINT;
    const left = midPoint[0] - rangeFactor; //minLongX
    const right = midPoint[0] + rangeFactor; //maxLongX
    const top = midPoint[1] + rangeFactor; //maxLatY
    const bottom = midPoint[1] - rangeFactor; //minLatY
    return [left, bottom, right, top];
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
        <Row>
          <Col xl={5} className='d-flex justify-content-between'>
            <p className='align-self-baseline alert-title'>
              Alert List
              <button
                type="button"
                className="btn float-end mt-1 py-0 px-1"
                onClick={() => {
                  setAlertId(undefined);
                  setFilteredAlerts(alerts);
                }}
              >
                <i className="mdi mdi-sync"></i>
              </button>
            </p>
            <Button color='link'
              onClick={handleResetAOI} className='align-self-baseline pe-0'>
              Default AOI</Button>
          </Col>
          <Col xl={7} className='d-flex justify-content-end'>
            <DateRangePicker setDates={handleDateRangePicker} />
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
