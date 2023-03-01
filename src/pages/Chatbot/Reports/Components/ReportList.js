import React, { useState } from 'react';

import _ from 'lodash';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Row } from 'reactstrap';

import { useMap } from 'components/BaseMap/MapContext';
import PaginationWrapper from 'components/Pagination';
import { getViewState } from 'helpers/mapHelper';
import {
  setReportFavorite,
  allReportsSelector,
  filteredReportsSelector,
} from 'store/reports.slice';

import Report from './Report';

const ReportList = ({ reportId, setReportId }) => {
  const { viewState, setViewState } = useMap();

  const allReports = useSelector(allReportsSelector);
  const filteredReports = useSelector(filteredReportsSelector);
  const [pageData, setPageData] = useState([]);

  const dispatch = useDispatch();

  const reports = filteredReports ?? [];

  // Get the index, then divide that by 4 and ceil it, gets the page.
  let selectedIndex = 1;
  if (reportId) {
    selectedIndex = reports.findIndex(report => report.report_id === reportId);
  }
  const pageNo = Math.ceil((selectedIndex + 1) / 4);

  const setFavoriteFlag = id => {
    let selectedReport = _.find(pageData, { id });
    selectedReport.isFavorite = !selectedReport.isFavorite;
    dispatch(
      setReportFavorite({ alertId: id, isFavorite: selectedReport.isFavorite }),
    );
  };

  const setSelectedReport = report_id => {
    if (report_id) {
      setReportId(report_id);
      let reportList = _.cloneDeep(allReports);
      let selectedReport = _.find(reportList, { report_id });
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
  setReportId: PropTypes.func,
  missionId: PropTypes.string,
  category: PropTypes.string,
  sortOrder: PropTypes.string,
};

export default ReportList;
