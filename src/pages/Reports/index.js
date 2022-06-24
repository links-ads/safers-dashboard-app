import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button } from 'reactstrap';
import moment from 'moment';
import toastr from 'toastr';

import 'toastr/build/toastr.min.css'
import 'rc-pagination/assets/index.css';
import SortSection from './Components/SortSection';
import DateComponent from '../../components/DateRangePicker/DateRange';
import MapSection from './Components/Map';
import ReportList from './Components/ReportList';
import { getAllReports, resetReportResponseState } from '../../store/reports/action';
import { getBoundingBox, getIconLayer, getViewState } from '../../helpers/mapHelper';

import { useTranslation } from 'react-i18next';
import { MAP_TYPES } from '../../constants/common';

const Reports = () => {
  const defaultAoi = useSelector(state => state.user.defaultAoi);
  const { allReports: OrgReportList, success, filteredReports } = useSelector(state => state.reports);

  const { t } = useTranslation();

  const [reportId, setReportId] = useState(undefined);
  const [viewState, setViewState] = useState(undefined);
  const [iconLayer, setIconLayer] = useState(undefined);
  const [sortOrder, setSortOrder] = useState(undefined);
  const [reportSource, setReportSource] = useState(undefined);
  const [midPoint, setMidPoint] = useState([]);
  const [boundingBox, setBoundingBox] = useState(undefined);
  const [currentZoomLevel, setCurrentZoomLevel] = useState(undefined);
  const [dateRange, setDateRange] = useState([undefined, undefined]);

  const dispatch = useDispatch();

  const allReports = filteredReports || OrgReportList;

  useEffect(() => {
    setReportId(undefined);
    const reportParams = {
      order: sortOrder ? sortOrder : '-date',
      source: reportSource,
      start: dateRange[0],
      end: dateRange[1],
      bbox: boundingBox?.toString(),
      default_date: /*(!dateRange[0] && !dateRange[1])*/false,
      default_bbox: /*!boundingBox*/false
    };
    dispatch(getAllReports(reportParams));
  }, [dateRange, reportSource, sortOrder, boundingBox])

  useEffect(() => {
    if (success?.detail) {
      toastr.success(success.detail, '');
    }
    dispatch(resetReportResponseState());

  }, [success]);

  useEffect(() => {
    if (allReports.length > 0) {
      setIconLayer(getIconLayer(allReports, MAP_TYPES.REPORTS));
      if (!viewState) {
        setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel))
      }
    }
  }, [allReports]);

  const getReportsByArea = () => {
    setBoundingBox(getBoundingBox(midPoint, currentZoomLevel));
  }

  const handleViewStateChange = (e) => {
    if (e && e.viewState) {
      setMidPoint([e.viewState.longitude, e.viewState.latitude]);
      setCurrentZoomLevel(e.viewState.zoom);
    }
  };

  const handleDateRangePicker = (dates) => {
    let from = moment(dates[0]).format('YYYY-MM-DD');
    let to = moment(dates[1]).format('YYYY-MM-DD');
    setDateRange([from, to]);
  }
  const clearDates = () => {
    setDateRange([]);
  }

  const handleResetAOI = useCallback(() => {
    setBoundingBox(undefined);
    setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel))
  }, []);

  return (
    <div className='page-content'>
      <div className='mx-2 sign-up-aoi-map-bg'>
        <Row>
          <Col xl={5} className='d-flex justify-content-between'>
            <p className='align-self-baseline alert-title'>{t('Reports List', { ns: 'reports' })}</p>
            <Button color='link'
              onClick={handleResetAOI} className='align-self-baseline pe-0'>
              {t('default-aoi', { ns: 'common' })}</Button>
          </Col>
          <Col xl={7} className='d-flex justify-content-end'>
            <DateComponent setDates={handleDateRangePicker} clearDates={clearDates} />
          </Col>
        </Row>
        <Row>
          <Col xl={5}>
            <SortSection
              reportSource={reportSource}
              sortOrder={sortOrder}
              setReportSource={setReportSource}
              setSortOrder={setSortOrder}
            />
            <Row>
              <Col xl={12} className='px-3'>
                <ReportList
                  reportId={reportId}
                  currentZoomLevel={currentZoomLevel}
                  setViewState={setViewState}
                  setReportId={setReportId}
                  setIconLayer={setIconLayer} />
              </Col>
            </Row>
          </Col>
          <Col xl={7} className='mx-auto'>
            <MapSection
              viewState={viewState}
              iconLayer={iconLayer}
              setViewState={setViewState}
              getReportsByArea={getReportsByArea}
              handleViewStateChange={handleViewStateChange}
            />
          </Col>
        </Row>

      </div>
    </div >

  );
}

export default Reports;
