import React, { useEffect, useState, useCallback } from 'react';
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
import { getAllEventAlerts, resetEventAlertsResponseState, setCurrentPage, setDateRange, setFilterdAlerts, setHoverInfo, setIconLayer, setMidpoint, setPaginatedAlerts, setZoomLevel, resetEventApiParams, setNewEventState, } from '../../store/appAction';
import { getIconLayer, getViewState } from '../../helpers/mapHelper';
import { PAGE_SIZE } from '../../store/events/types';

const EventAlerts = () => {
  const defaultAoi = useSelector(state => state.user.defaultAoi);
  const alerts = useSelector(state => state.eventAlerts.allAlerts);
  const success = useSelector(state => state.eventAlerts.success);
  const { params, filteredAlerts } = useSelector(state => state.eventAlerts);
  const { dateRange, sortByDate, alertSource } = params;
  const [viewState, setViewState] = useState(undefined);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllEventAlerts(
      {
        sortOrder: sortByDate,
        source: alertSource,
        from: dateRange[0],
        to: dateRange[1]
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
    var randomBoolean = Math.random() < 0.5;//to simulate new alerts
    if (alerts.length > 0 && filteredAlerts.length === 0) {
      dispatch(setIconLayer(getIconLayer(alerts)));
      if (!viewState) {
        setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel))
      }
      dispatch(setFilterdAlerts(alerts));
    }
    else if (alerts.length > filteredAlerts.length || randomBoolean/*to simulate new alerts*/) {
      toastr.success('New events are received. Please refresh the list.', '', { preventDuplicates: true, });
    }
  }, [alerts]);

  useEffect(() => {
    dispatch(setIconLayer(getIconLayer(filteredAlerts)));
    if (!viewState) {
      setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel));
    }
    dispatch(setCurrentPage(1));
    hideTooltip();
    dispatch(setPaginatedAlerts(_.cloneDeep(filteredAlerts.slice(0, PAGE_SIZE))))
  }, [filteredAlerts]);




  const handleDateRangePicker = (dates) => {
    let from = moment(dates[0]).format('DD-MM-YYYY');
    let to = moment(dates[1]).format('DD-MM-YYYY');
    dispatch(setDateRange([from, to]));
  }

  const handleResetAOI = useCallback(() => {
    setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel))
  }, []);

  const hideTooltip = (e) => {
    if (e && e.viewState) {
      dispatch(setMidpoint([e.viewState.longitude, e.viewState.latitude]));
      dispatch(setZoomLevel(e.viewState.zoom));
    }
    dispatch(setHoverInfo({}));
  };


  return (
    <div className='page-content'>
      <div className='mx-2 sign-up-aoi-map-bg'>
        <Row>
          <Col xl={5} className='d-flex justify-content-between'>
            <p className='align-self-baseline alert-title'>
              Events
              <button
                type="button"
                className="btn float-end mt-1 py-0 px-1"
                onClick={() => {
                  dispatch(setFilterdAlerts(alerts));
                }}
              >
                <i className="mdi mdi-sync"></i>
              </button>
            </p>            <Button color='link'
              onClick={handleResetAOI} className='align-self-baseline pe-0'>
              Default AOI</Button>
          </Col>
          <Col xl={7} className='d-flex justify-content-end'>
            <DateComponent setDates={handleDateRangePicker} />
          </Col>
        </Row>
        <Row>
          <Col xl={5}>
            <SortSection />
            <Row>
              <Col xl={12} className='px-3'>
                <EventList />
              </Col>
            </Row>
          </Col>
          <Col xl={7} className='mx-auto'>
            <MapSection viewState={viewState} setViewState={setViewState} />
          </Col>
        </Row>

      </div>
    </div >

  );
}

export default EventAlerts;
