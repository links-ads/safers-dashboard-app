import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux';
import { Row } from 'reactstrap';
import { getViewState } from '../../../../helpers/mapHelper';
import PaginationWrapper from '../../../../components/Pagination';
import { setFavorite, setFilterdReports } from '../../../../store/reports/action';
import { getFilteredRec } from '../../filter';
import Report from './Report';

const MAP_TYPE = 'reports';
import { MAP_TYPES } from '../../../../constants/common';
import { GeoJsonPinLayer } from '../../../../components/BaseMap/GeoJsonPinLayer';
import { getIconColorFromContext } from '../../../../helpers/mapHelper';

const ReportList = ({ 
  reportId, 
  currentZoomLevel, 
  setViewState, 
  setReportId, 
  setIconLayer,
  missionId,
  category,
  sortOrder
}) => {
  const { allReports: OrgReportList, filteredReports } = useSelector(state => state.reports);
  const [pageData, setPageData] = useState([]);

  const dispatch = useDispatch();

  const allReports = filteredReports ?? [];

  useEffect(() => {
    const filters = { 
      categories: category,
      mission_id:  missionId
    };
  
    const sort = { fieldName: 'timestamp', order: sortOrder };
    const actFiltered = getFilteredRec(OrgReportList, filters, sort);
    dispatch(setFilterdReports(actFiltered));
  }, [category, missionId, sortOrder, OrgReportList])

  const getIconLayer = (alerts) => {
    const data = alerts?.map((alert) => {
      const {
        geometry,
        ...properties
      } = alert;
      return {
        type: 'Feature',
        properties: properties,
        geometry: geometry,
      };
    });

    return new GeoJsonPinLayer({
      data,
      dispatch,
      setViewState,
      getPosition: (feature) => feature.geometry.coordinates,
      getPinColor: feature => getIconColorFromContext(MAP_TYPES.REPORT,feature),
      icon: 'report',
      iconColor: '#ffffff',
      clusterIconSize: 35,
      getPinSize: () => 35,
      pixelOffset: [-18,-18],
      pinSize: 25,
      onGroupClick: true,
      onPointClick: true,
    });
  };

  const setFavoriteFlag = (id) => {
    let selectedReport = _.find(pageData, { id });
    selectedReport.isFavorite = !selectedReport.isFavorite;
    dispatch(setFavorite(id, selectedReport.isFavorite));
  }

  const setSelectedReport = (report_id) => {
    if (report_id) {
      setReportId(report_id);
      let reportList = _.cloneDeep(allReports);
      let selectedReport = _.find(reportList, { report_id });
      selectedReport.isSelected = true;
      setIconLayer(getIconLayer(reportList, MAP_TYPE));
      setViewState(getViewState(selectedReport.location, currentZoomLevel))
    } else {
      setReportId(undefined);
      setIconLayer(getIconLayer(allReports, MAP_TYPE));
    }
  }
  const updatePage = data => {
    setReportId(undefined);
    setIconLayer(getIconLayer(data, MAP_TYPE));
    setPageData(data);
  };

  return (
    <>
      <Row>
        {
          pageData.map((report) => (
            <Report
              key={report.report_id}
              card={report}
              reportId={reportId}
              setSelectedReport={setSelectedReport}
              setFavorite={setFavoriteFlag}
            />
          ))
        }
      </Row>
      <Row className='text-center'>
        <PaginationWrapper pageSize={4} list={allReports} setPageData={updatePage} />
      </Row>
    </>)
}

ReportList.propTypes = {
  reportId: PropTypes.any,
  currentZoomLevel: PropTypes.any,
  setViewState: PropTypes.func,
  setReportId: PropTypes.func,
  setIconLayer: PropTypes.func,
  missionId: PropTypes.string,
  category: PropTypes.string,
  sortOrder: PropTypes.string
}

export default ReportList;
