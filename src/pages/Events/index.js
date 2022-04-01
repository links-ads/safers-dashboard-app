import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button, Input, FormGroup, Label, InputGroup } from 'reactstrap';
import _ from 'lodash';
import moment from 'moment';
import toastr from 'toastr';

import { getAllFireAlerts, resetAlertsResponseState } from '../../store/appAction';

import 'toastr/build/toastr.min.css'
import 'rc-pagination/assets/index.css';
import SortSection from '../../components/SortSection';
import DateComponent from '../../components/DateRangePicker/DateRange';
import MapSection from './Components/Map';
import EventList from './Components/EventList';
import { setAlertId, setCurrentPage, setDateRange, setFilterdAlerts, setHoverInfo, setIconLayer, setMidpoint, setPaginatedAlerts, setZoomLevel } from '../../store/events/action';
import { getIconLayer, getViewState } from '../../helpers/mapHelper';
import { PAGE_SIZE } from '../../store/events/types';

const EventAlerts = () => {
  const defaultAoi = useSelector(state => state.user.defaultAoi);
  const alerts = useSelector(state => state.eve.allAlerts);
  const success = useSelector(state => state.alerts.success);
  const { filteredAlerts, sortByDate, alertSource, dateRange } = useSelector(state => state.eventAlerts);

  const [viewState, setViewState] = useState(undefined);

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
      dispatch(setIconLayer(getIconLayer(alerts)));
      if (!viewState) {
        setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel))
      }
      dispatch(setFilterdAlerts(alerts));
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

  useEffect(() => {
    dispatch(setAlertId(undefined));
    if (alertSource === 'all')
      dispatch(setFilterdAlerts(alerts));
    else
      dispatch(setFilterdAlerts(_.filter(alerts, { source: alertSource })));
  }, [alertSource]);

  useEffect(() => {
    dispatch(setAlertId(undefined));
    dispatch(setFilterdAlerts(_.orderBy(filteredAlerts, ['timestamp'], [sortByDate])));
  }, [sortByDate]);


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
        <Row className='d-flex flex-row'>
          <Col xl={4}>Events</Col>
          <Col xl={4} className='text-center'>
            <Button color='link'
              onClick={handleResetAOI}>Default AOI</Button>
          </Col>
          <Col xl={4} className='d-flex justify-content-end'>
            <DateComponent setDates={handleDateRangePicker} defaultDateRange={dateRange} />
          </Col>
        </Row>
        <Row>
          <Col xl={5}>
            <div>
              <FormGroup className="form-group d-inline-block" check>
                <Input
                  id="onGoing"
                  data-testid="onGoing"
                  name="onGoing"
                  type="checkbox"
                  
                />
                <Label
                  check
                  for="onGoing"
                >
                  Ongoing (5)
                </Label>
              </FormGroup>
              <FormGroup className="form-group d-inline-block ms-4" check>
                <Input
                  id="closedEvents"
                  data-testid="closedEvents"
                  name="closedEvents"
                  type="checkbox"
                  
                />
                <Label
                  check
                  for="closedEvents"
                >
                  Closed (10)
                </Label>
              </FormGroup>
            </div>
            
            <Row>
              <Col></Col>
              <Col xl={3} className="d-flex justify-content-end">
                <span className='my-auto alert-report-text'>Results {filteredAlerts.length}</span>
              </Col>
            </Row>
            <hr />
            
            <SortSection />

            <Row className='mt-3'>
              <Col xs={12}>
                <FormGroup >
                  <InputGroup>
                    <div className='bg-white d-flex border-none search-left'>
                      <i className='fa fa-search px-2 m-auto calender-icon'></i>
                    </div>
                    <Input
                      id="closedEvents"
                      data-testid="closedEvents"
                      name="closedEvents"
                      className='search-input'
                      placeholder='Search for an event'
                    />
                  </InputGroup>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xl={12} className='px-3'>
                <EventList/>
              </Col>
            </Row>
          </Col>
          <Col xl={7} className='mx-auto'>
            <MapSection viewState={viewState} setViewState={setViewState}/>
          </Col>
        </Row>

      </div>
    </div >

  );
}

export default EventAlerts;
