import React, { useState } from 'react';

import _ from 'lodash';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Row } from 'reactstrap';

import { ZOOM_LEVEL } from 'pages/Chatbot/constants';

import Report from './Report';
import PaginationWrapper from '../../../../components/Pagination';
import { MAP_TYPES } from '../../../../constants/common';
import { getViewState, getIconLayer } from '../../../../helpers/mapHelper';
import { setFavorite } from '../../../../store/reports/action';

const ReportList = ({ reportId, setViewState, setReportId, setIconLayer }) => {
  // console.log('REPORTS IDENTIFIER: ', reportId);
  const { filteredReports } = useSelector(state => state.reports);
  const [pageData, setPageData] = useState([]);
  // console.log('PAGE DATA: ', pageData);
  const dispatch = useDispatch();

  const allReports = filteredReports ?? [];
  const noOfPages = Math.ceil(allReports.length / 4);
  // Create array based on number of pages
  const groupedData = new Array(noOfPages)
    // Make sure each element isn't empty
    .fill('')
    // For each page, grab the right `slice` of the input array
    .map((_, i) => allReports.slice(i * 4, (i + 1) * 4));
  // console.log('GROUPED ARRAY: ', groupedData);

  // Find the page that contains the selected report
  let pageNo = null;
  groupedData.forEach((group, index) => {
    const result = group.find(rep => rep.report_id === reportId);

    if (result) {
      pageNo = index + 1;
    }
  });
  // console.log('PAGE: ', pageNo);

  const setFavoriteFlag = id => {
    let selectedReport = _.find(pageData, { id });
    selectedReport.isFavorite = !selectedReport.isFavorite;
    dispatch(setFavorite(id, selectedReport.isFavorite));
  };

  const setSelectedReport = report_id => {
    if (report_id) {
      setReportId(report_id);
      let reportList = _.cloneDeep(allReports);
      let selectedReport = _.find(reportList, { report_id });
      selectedReport.isSelected = true;
      setIconLayer(
        getIconLayer(
          reportList,
          MAP_TYPES.REPORTS,
          'report',
          dispatch,
          setViewState,
          selectedReport,
        ),
      );
      setViewState(getViewState(selectedReport.location, ZOOM_LEVEL));
    } else {
      setReportId(undefined);
      setIconLayer(
        getIconLayer(
          allReports,
          MAP_TYPES.REPORTS,
          'report',
          dispatch,
          setViewState,
        ),
      );
    }
  };
  const updatePage = data => {
    if (JSON.stringify(data) !== JSON.stringify(pageData)) {
      setReportId(undefined);
      setIconLayer(
        getIconLayer(data, MAP_TYPES.REPORTS, 'report', dispatch, setViewState),
      );
      setPageData(data);
    }
  };

  return (
    <>
      <Row>
        {pageData.map(report => (
          <Report
            key={report.report_id}
            card={report}
            reportId={reportId}
            setSelectedReport={setSelectedReport}
            setFavorite={setFavoriteFlag}
          />
        ))}
      </Row>
      <Row className="text-center">
        <PaginationWrapper
          page={pageNo}
          pageSize={4}
          list={allReports}
          setPageData={updatePage}
        />
      </Row>
    </>
  );
};

ReportList.propTypes = {
  reportId: PropTypes.any,
  currentZoomLevel: PropTypes.any,
  setViewState: PropTypes.func,
  setReportId: PropTypes.func,
  setIconLayer: PropTypes.func,
  missionId: PropTypes.string,
  category: PropTypes.string,
  sortOrder: PropTypes.string,
};

export default ReportList;
