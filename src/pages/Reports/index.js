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
import { getAllReports, resetReportResponseState, setDateRange} from '../../store/reports/action';
import { getIconLayer, getViewState } from '../../helpers/mapHelper';

const MAP_TYPE = 'reports';

const Reports = () => {
  const defaultAoi = useSelector(state => state.user.defaultAoi);
  const {allReports: OrgReportList, success, filteredReports} = useSelector(state => state.reports);
  const { sortByDate, alertSource, dateRange } = useSelector(state => state.inSituAlerts);

  const [viewState, setViewState] = useState(undefined);
  const [iconLayer, setIconLayer] = useState(undefined);

  const dispatch = useDispatch();

  const allReports = filteredReports || OrgReportList;

  useEffect(() => {
    dispatch(getAllReports(
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
    dispatch(resetReportResponseState());

  }, [success]);

  useEffect(() => {
    if (allReports.length > 0) {
      setIconLayer(getIconLayer(allReports, MAP_TYPE));
      if (!viewState) {
        setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel))
      }
    }
  }, [allReports]);

  


  const handleDateRangePicker = (dates) => {
    let from = moment(dates[0]).format('DD-MM-YYYY');
    let to = moment(dates[1]).format('DD-MM-YYYY');
    dispatch(setDateRange([from, to]));
  }

  const handleResetAOI = useCallback(() => {
    setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel))
  }, []);

  return (
    <div className='page-content'>
      <div className='mx-2 sign-up-aoi-map-bg'>
        <Row>
          <Col xl={5} className='d-flex justify-content-between'>
            <p className='align-self-baseline alert-title'>Reports List</p>
            <Button color='link'
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
                <ReportList setIconLayer={setIconLayer} />
              </Col>
            </Row>
          </Col>
          <Col xl={7} className='mx-auto'>
            <MapSection viewState={viewState} setViewState={setViewState} iconLayer={iconLayer}/>
          </Col>
        </Row>

      </div>
    </div >

  );
}

export default Reports;
