import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Row } from 'reactstrap';

import { useMap } from 'components/BaseMap/MapContext';
import PaginationWrapper from 'components/Pagination';
import { PAGE_SIZE } from 'constants/common';
import {
  allReportsSelector,
  filteredReportsSelector,
} from 'store/reports.slice';

import Report from './Report';

const ReportList = ({ selectedReport, setSelectedReport }) => {
  const { updateViewState } = useMap();

  const allReports = useSelector(allReportsSelector);
  const filteredReports = useSelector(filteredReportsSelector);

  const [pageData, setPageData] = useState([]);

  const reportList = filteredReports ?? allReports;

  // Get the index, then divide that by 4 and ceil it, gets the page.
  let selectedIndex = 1;
  if (selectedReport) {
    selectedIndex = reportList.findIndex(
      report => report.report_id === selectedReport.report_id,
    );
  }
  const pageNo = Math.ceil((selectedIndex + 1) / 4);

  const selectReport = report => {
    if (report) {
      setSelectedReport(report);

      updateViewState({
        longitude: report.location[0],
        latitude: report.location[1],
      });
    }
  };
  const updatePage = data => {
    if (JSON.stringify(data) !== JSON.stringify(pageData)) {
      setPageData(data);
    }
  };

  return (
    <>
      <Row>
        {pageData.map(report => (
          <Report
            key={report.report_id}
            report={report}
            selectedReport={selectedReport}
            selectReport={selectReport}
          />
        ))}
      </Row>
      <Row className="text-center">
        <PaginationWrapper
          page={pageNo}
          pageSize={PAGE_SIZE}
          list={reportList}
          setPageData={updatePage}
        />
      </Row>
    </>
  );
};

ReportList.propTypes = {
  selectedReport: PropTypes.any,
  setSelectedReport: PropTypes.func,
};

export default ReportList;
