import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button, Input, Card } from 'reactstrap';
import { FlyToInterpolator, IconLayer } from 'deck.gl';
import _ from 'lodash';
import Pagination from 'rc-pagination';
import moment from 'moment';
import toastr from 'toastr';
//i18n
import { withTranslation } from 'react-i18next'

import BaseMap from '../../components/BaseMap/BaseMap';
import { getAllFireAlerts, setFavoriteAlert, validateAlert, editAlertInfo, setAlertApiParams, resetAlertsResponseState, setNewAlertState, getSource, setFilteredAlerts } from '../../store/appAction';
import Alert from './Alert';
import Tooltip from './Tooltip';
import DateRangePicker from '../../components/DateRangePicker/DateRange';
// import { getDefaultDateRange } from '../../store/utility';

import firePin from '../../assets/images/atoms-general-icon-fire-drop.png'
import 'toastr/build/toastr.min.css'
import 'rc-pagination/assets/index.css';

const RANGE_BASE_POINT = 18;
const PAGE_SIZE = 4;
const ICON_MAPPING = {
  marker: { x: 0, y: 0, width: 100, height: 100, mask: true }
};

const FireAlerts = ({ t }) => {
  const defaultAoi = useSelector(state => state.user.defaultAoi);
  const alerts = useSelector(state => state.alerts.allAlerts);
  const filteredAlerts = useSelector(state => state.alerts.filteredAlerts);
  const sources = useSelector(state => state.alerts.sources);
  const success = useSelector(state => state.alerts.success);
  const error = useSelector(state => state.alerts.error);
  const [iconLayer, setIconLayer] = useState(undefined);
  const [viewState, setViewState] = useState(undefined);
  const [sortByDate, setSortByDate] = useState(undefined);
  const [alertSource, setAlertSource] = useState(undefined);
  const [midPoint, setMidPoint] = useState([]);
  const [boundaryBox, setBoundaryBox] = useState(undefined);
  const [zoomLevel, setZoomLevel] = useState(undefined);
  const [dateRange, setDateRange] = useState([undefined, undefined]);
  const [alertId, setAlertId] = useState(undefined);
  const [isEdit, setIsEdit] = useState(false);
  const [hoverInfo, setHoverInfo] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedAlerts, setPaginatedAlerts] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSource());
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
    if (success) {
      toastr.success(success, '');
    } else if (error)
      toastr.error(error, '');

    dispatch(resetAlertsResponseState());
  }, [success, error]);

  useEffect(() => {
    if (alerts.length > filteredAlerts.length) {
      toastr.success('New alerts are received. Please refresh the list.', '', { preventDuplicates: true, });
    }
  }, [alerts]);

  useEffect(() => {
    setAlertId(undefined);
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
    selectedAlert.favorite = !selectedAlert.favorite;
    hoverInfo.object && setHoverInfo({ object: selectedAlert, coordinate: selectedAlert.center });
    dispatch(setFavoriteAlert(id, selectedAlert.favorite));
    const to = PAGE_SIZE * currentPage;
    const from = to - PAGE_SIZE;
    setPaginatedAlerts(_.cloneDeep(filteredAlerts.slice(from, to)));
  }

  const validateEvent = (id) => {
    let selectedAlert = _.find(filteredAlerts, { id });
    selectedAlert.type = 'VALIDATED';
    dispatch(validateAlert(id));
    hideTooltip();
    const to = PAGE_SIZE * currentPage;
    const from = to - PAGE_SIZE;
    setPaginatedAlerts(_.cloneDeep(filteredAlerts.slice(from, to)));
  }

  const editInfo = (id, desc) => {
    let selectedAlert = _.find(filteredAlerts, { id });
    selectedAlert.information = desc;
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
    setAlertId(undefined);
    const alertParams = {
      order: sortByDate ? sortByDate : undefined,
      source: alertSource ? alertSource : undefined,
      start: dateRange[0],
      end: dateRange[1],
      // bbox: boundaryBox ? boundaryBox.toString() : undefined, //disabled since bbox value won't return data 
      default_date: false,
      default_bbox: false
    };
    dispatch(setAlertApiParams(alertParams));
    dispatch(getAllFireAlerts(alertParams, true));

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
      setIsEdit(isEdit);
      setHoverInfo({ object: selectedAlert, coordinate: selectedAlert.center });
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
      zoom: zoomLevel,
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
      getPosition: d => d.center,
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

  const hideTooltip = (e) => {
    if (e && e.viewState) {
      setMidPoint([e.viewState.longitude, e.viewState.latitude]);
      setZoomLevel(e.viewState.zoom);
    }
    setIsEdit(false);
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
    const { object, coordinate } = info;
    if (object) {
      return <Tooltip
        key={object.id}
        object={object}
        coordinate={coordinate}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
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
        {t('Search This Area')}
      </Button >
    )
  }

  return (
    <div className='page-content'>
      <div className='mx-2 sign-up-aoi-map-bg'>
        <Row>
          <Col xl={5} className='d-flex justify-content-between'>
            <p className='align-self-baseline alert-title'>{t('Alert List', { ns: 'fireAlerts' })}
              <button
                type="button"
                className="btn float-end mt-1 py-0 px-1"
                onClick={() => {
                  dispatch(setFilteredAlerts(alerts));
                }}
              >
                <i className="mdi mdi-sync"></i>
              </button>
            </p>
            <Button color='link'
              onClick={handleResetAOI} className='align-self-baseline pe-0'>
              {t('default-aoi')}</Button>
          </Col>
          <Col xl={7} className='d-flex justify-content-end'>
            <DateRangePicker setDates={handleDateRangePicker} clearDates={handleDateRangePicker} />
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
                  <option value={'-date'} >{t('Sort By')} : {t('Date')} {t('desc')}</option>
                  <option value={'date'}  >{t('Sort By')} : {t('Date')} {t('asc')}</option>
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
                  data-testid='fireAlertSource'
                >
                  <option value={''} >Source : All</option>
                  {sources.map((source, index) => { return <option key={index} value={source} >Source : {source}</option> }
                  )}
                </Input>
              </Col>
              <Col xl={3} className="d-flex justify-content-end" role='results-section'>
                <span className='my-auto alert-report-text'>{t('Results')} {filteredAlerts.length}</span></Col>
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

FireAlerts.propTypes = {
  t: PropTypes.any,
}

export default withTranslation(['common'])(FireAlerts);
