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
import AlertList from './Components/AlertList';
import { getAllInSituAlerts, resetInSituAlertsResponseState, setCurrentPage, setDateRange, setFilterdAlerts, setHoverInfo, setIconLayer, setMidpoint, setPaginatedAlerts, setZoomLevel, getCameraList } from '../../store/insitu/action';
import { getIconLayer, getViewState } from '../../helpers/mapHelper';
import { PAGE_SIZE } from '../../store/events/types';

//i18n
import { useTranslation } from 'react-i18next'

const InSituAlerts = () => {
  const defaultAoi = useSelector(state => state.user.defaultAoi);
  const { filteredAlerts, sortByDate, alertSource, dateRange, allAlerts:alerts, success, cameraList } = useSelector(state => state.inSituAlerts);
  const [boundingBox, setBoundingBox] = useState(undefined);
  const [checkedStatus, setCheckedStatus] = useState([])
  const {t} = useTranslation();

  const [viewState, setViewState] = useState(undefined);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCameraList());
  }, []);

  useEffect(() => {
    dispatch(getAllInSituAlerts(
      {
        type: checkedStatus.length === 1 ? checkedStatus[0] : undefined, 
        order: sortByDate,
        camera_id: alertSource,
        from: dateRange[0],
        to: dateRange[1],
        bbox: boundingBox ? boundingBox.toString() : undefined,
        default_date: false,
        default_bbox: false
      }
    ));
  }, [sortByDate, alertSource, dateRange, boundingBox, checkedStatus]);

  useEffect(() => {
    if (success?.detail) {
      toastr.success(success.detail, '');
    }
    dispatch(resetInSituAlertsResponseState());

  }, [success]);
  
  useEffect(() => {
    dispatch(setIconLayer(getIconLayer(cameraList.features)));
  }, [cameraList]);
  
  useEffect(() => {
    if (!viewState) {
      setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel))
    }
    dispatch(setFilterdAlerts(alerts));
  }, [alerts]);

  useEffect(() => {
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
            <p className='align-self-baseline alert-title'>{t('In Situ Cameras', {ns: 'inSitu'})}</p>
            <Button color='link'
              onClick={handleResetAOI} className='align-self-baseline pe-0'>
              {t('default-aoi', {ns: 'common'})}</Button>
          </Col>
          <Col xl={7} className='d-flex justify-content-end'>
            <DateComponent setDates={handleDateRangePicker} />
          </Col>
        </Row>
        <Row>
          <Col xl={5}>
            <SortSection checkedStatus={checkedStatus} setCheckedStatus ={setCheckedStatus} />
            <Row>
              <Col xl={12} className='px-3'>
                <AlertList/>
              </Col>
            </Row>
          </Col>
          <Col xl={7} className='mx-auto'>
            <MapSection viewState={viewState} setViewState={setViewState} setBoundingBox={setBoundingBox}/>
          </Col>
        </Row>

      </div>
    </div >

  );
}

export default InSituAlerts;
