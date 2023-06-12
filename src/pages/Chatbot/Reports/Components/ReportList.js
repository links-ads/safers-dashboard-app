import React, { useState } from 'react';

import _ from 'lodash';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Row } from 'reactstrap';

import { useMap } from 'components/BaseMap/MapContext';
import PaginationWrapper from 'components/Pagination';
import { getViewState } from 'helpers/mapHelper';
import {
  allReportsSelector,
  filteredReportsSelector,
} from 'store/reports.slice';

import Report from './Report';

const ReportList = ({ reportId, setReportId }) => {
  const { viewState, setViewState } = useMap();

  const allReports = useSelector(allReportsSelector);
  const filteredReports = useSelector(filteredReportsSelector);
  const [pageData, setPageData] = useState([]);

  const reportList = filteredReports ?? allReports;

  // Get the index, then divide that by 4 and ceil it, gets the page.
  let selectedIndex = 1;
  if (reportId) {
    selectedIndex = reportList.findIndex(
      report => report.report_id === reportId,
    );
  }
  const pageNo = Math.ceil((selectedIndex + 1) / 4);

  const setSelectedReport = id => {
    if (id) {
      setReportId(id);
      let copyReportList = _.cloneDeep(reportList);
      let selectedReport = copyReportList.find(report => report.id === id);
      selectedReport.isSelected = true;
      setViewState(getViewState(selectedReport.location, viewState.zoom));
    } else {
      setReportId(undefined);
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
            card={report}
            reportId={reportId}
            setSelectedReport={setSelectedReport}
          />
        ))}
      </Row>
      <Row className="text-center">
        <PaginationWrapper
          page={pageNo}
          pageSize={4}
          list={reportList}
          setPageData={updatePage}
        />
      </Row>
    </>
  );
};

ReportList.propTypes = {
  reportId: PropTypes.any,
  setReportId: PropTypes.func,
  missionId: PropTypes.string,
  category: PropTypes.string,
  sortOrder: PropTypes.string,
};

export default ReportList;
