import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button } from 'reactstrap';
import _ from 'lodash';
import moment from 'moment';
import toastr from 'toastr';

import 'toastr/build/toastr.min.css'
import 'rc-pagination/assets/index.css';
import SortSection from './Components/SortSection';
import DateComponent from '../../components/DateRangePicker/DateRange';
import MapSection from './Components/Map';
import EventList from './Components/EventList';
import { getAllEventAlerts, resetEventAlertsResponseState, resetEventApiParams, setNewEventState, } from '../../store/appAction';
import { getIconLayer, getViewState } from '../../helpers/mapHelper';
import { PAGE_SIZE } from '../../store/events/types';

//i18n
import { withTranslation } from 'react-i18next'

const EventAlerts = ({ t }) => {
  const defaultAoi = useSelector(state => state.user.defaultAoi);
  const alerts = useSelector(state => state.eventAlerts.allAlerts);
  const success = useSelector(state => state.eventAlerts.success);
  // eslint-disable-next-line no-unused-vars
  const { params } = useSelector(state => state.eventAlerts);
 
  const [viewState, setViewState] = useState(undefined);
  const [iconLayer, setIconLayer] = useState(undefined);
  const [sortByDate, setSortByDate] = useState(undefined);
  const [alertSource, setAlertSource] = useState(undefined);
  const [midPoint, setMidPoint] = useState([]);
  // const [boundaryBox, setBoundaryBox] = useState(undefined);
  const [zoomLevel, setZoomLevel] = useState(undefined);
  // eslint-disable-next-line no-unused-vars
  const [dateRange, setDateRange] = useState([undefined, undefined]);
  const [alertId, setAlertId] = useState(undefined);
  const [hoverInfo, setHoverInfo] = useState({});
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedAlerts, setPaginatedAlerts] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllEventAlerts(
      {
        sortOrder: sortByDate,
        source: alertSource,
        default_date: false,
        default_bbox : false
      }
    ));
    dispatch(setNewEventState(false, true));
    return () => {
      dispatch(resetEventApiParams());
      dispatch(setNewEventState(false, false));
    }
  }, []);

  useEffect(() => {
    if (success?.detail) {
      toastr.success(success.detail, '');
    }
    dispatch(resetEventAlertsResponseState());

  }, [success]);

  useEffect(() => {
    if (alerts.length > 0 && filteredAlerts.length === 0) {
      setIconLayer(getIconLayer(alerts));
      if (!viewState) {
        setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel))
      }
      setFilteredAlerts(alerts);
    }
    else if (alerts.length > filteredAlerts.length) {
      toastr.success('New events are received. Please refresh the list.', '', { preventDuplicates: true, });
    }
  }, [alerts]);

  useEffect(() => {
    setIconLayer(getIconLayer(filteredAlerts));
    if (!viewState) {
      setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel));
    }
    setCurrentPage(1);
    hideTooltip();
    setPaginatedAlerts(_.cloneDeep(filteredAlerts.slice(0, PAGE_SIZE)))
  }, [filteredAlerts]);

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


  return (
    <div className='page-content'>
      <div className='mx-2 sign-up-aoi-map-bg'>
        <Row>
          <Col xl={5} className='d-flex justify-content-between'>
            <p className='align-self-baseline alert-title'>{t('Events', { ns: 'common' })}
              <button
                type="button"
                className="btn float-end mt-1 py-0 px-1"
                aria-label='refresh-events'
                onClick={() => {
                  setFilteredAlerts(alerts);
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
            <DateComponent setDates={handleDateRangePicker} />
          </Col>
        </Row>
        <Row>
          <Col xl={5}>
            <SortSection
              setAlertId={setAlertId}
              sortByDate={sortByDate}
              setSortByDate={setSortByDate}
              setAlertSource={setAlertSource}
              setFilterdAlerts={setFilteredAlerts}
            />
            <Row>
              <Col xl={12} className='px-3'>
                <EventList 
                  alertId={alertId}
                  setAlertId={setAlertId} 
                  filteredAlerts={filteredAlerts}
                  paginatedAlerts={paginatedAlerts}
                  currentPage={currentPage}
                  midPoint={midPoint}
                  zoomLevel={zoomLevel}
                  setMidpoint={setMidPoint}
                  setZoomLevel={setZoomLevel}
                  setHoverInfo={setHoverInfo}
                  setCurrentPage={setCurrentPage}
                  setIconLayer={setIconLayer}
                  setPaginatedAlerts={setPaginatedAlerts}
                />
              </Col>
            </Row>
          </Col>
          <Col xl={7} className='mx-auto'>
            <MapSection 
              viewState={viewState}
              setViewState={setViewState}
              hoverInfo={hoverInfo}
              iconLayer={iconLayer}
              setHoverInfo={setHoverInfo}
              paginatedAlerts={paginatedAlerts}
              currentPage={currentPage}
              midPoint={midPoint}
              zoomLevel={zoomLevel}
              setMidpoint={setMidPoint}
              setZoomLevel={setZoomLevel}
              setCurrentPage={setCurrentPage}
              setAlertId={setAlertId}
            />
          </Col>
        </Row>

      </div>
    </div >

  );
}

EventAlerts.propTypes = {
  t: PropTypes.any,
}

export default withTranslation(['common'])(EventAlerts);
