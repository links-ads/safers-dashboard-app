import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button } from 'reactstrap';
import _ from 'lodash';
import toastr from 'toastr';

import 'toastr/build/toastr.min.css'
import 'rc-pagination/assets/index.css';
import SortSection from './Components/SortSection';
import MapSection from './Components/Map';
import AlertList from './Components/AlertList';
import { getAllInSituAlerts, resetInSituAlertsResponseState, setCurrentPage, setFilterdAlerts, setHoverInfo, setIconLayer, setMidpoint, setPaginatedAlerts, setZoomLevel, getCameraList, getCameraSources } from '../../store/insitu/action';
import { getIconLayer, getViewState } from '../../helpers/mapHelper';
import { PAGE_SIZE } from '../../store/events/types';

//i18n
import { useTranslation } from 'react-i18next'

const InSituAlerts = () => {
  const defaultAoi = useSelector(state => state.user.defaultAoi);
  const { filteredAlerts, sortByDate, alertSource, allAlerts:alerts, success, error, cameraList } = useSelector(state => state.inSituAlerts);
  const dateRange = useSelector(state => state.common.dateRange)

  const [boundingBox, setBoundingBox] = useState(undefined);
  const [checkedStatus, setCheckedStatus] = useState([])
  const {t} = useTranslation();

  const [viewState, setViewState] = useState(undefined);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCameraSources());
  }, [])

  useEffect(() => {
    dispatch(getCameraList({
      camera_id: alertSource
    }));
  }, [alertSource, boundingBox]);

  useEffect(() => {
    const dateRangeParams = dateRange
      ? { start_date: dateRange[0], end_date: dateRange[1] }
      : {}

    dispatch(getAllInSituAlerts({
      type: checkedStatus.length === 1 ? checkedStatus[0] : undefined, 
      order: sortByDate,
      camera_id: alertSource,
      bbox: boundingBox ? boundingBox.toString() : undefined,
      default_date: false,
      default_bbox: false,
      ...dateRangeParams
    }));
  }, [sortByDate, alertSource, dateRange, boundingBox, checkedStatus]);

  useEffect(() => {
    if (success) {
      toastr.success(success, '');
    } else if (error) {
      toastr.error(error, '');
    }
    dispatch(resetInSituAlertsResponseState());

  }, [success, error]);
  
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
          <Col xl={12} className='d-flex justify-content-between'>
            <p className='align-self-baseline alert-title'>{t('In Situ Cameras', {ns: 'inSitu'})}</p>
            <Button color='link'
              onClick={handleResetAOI} className='align-self-baseline pe-0'>
              {t('default-aoi', {ns: 'common'})}</Button>
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
