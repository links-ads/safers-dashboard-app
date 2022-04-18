import _ from 'lodash';
import React, { useState } from 'react';
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux';
import { Row } from 'reactstrap';
import { getIconLayer } from '../../../helpers/mapHelper';
import PaginationWrapper from '../../../components/Pagination';
import { setFavorite } from '../../../store/reports/action';
import Report from './Report';

const MAP_TYPE = 'reports';

const ReportList = ({setIconLayer}) => {
  const { allReports: OrgReportList, filteredReports } = useSelector(state => state.reports);
  const [pageData, setPageData] = useState([]);
  const [alertId, setAlertId] = useState([]);

  const dispatch = useDispatch();
  

  const allReports = filteredReports || OrgReportList;

  const setFavoriteFlag = (id) => {
    let selectedAlert = _.find(pageData, { id });
    selectedAlert.isFavorite = !selectedAlert.isFavorite;
    dispatch(setFavorite(id, selectedAlert.isFavorite));
  }

  const setSelectedReport = (id) => {
    if (id) {
      setAlertId(id);
      let alertsToEdit = _.cloneDeep(pageData);
      let selectedAlert = _.find(alertsToEdit, { id });
      selectedAlert.isSelected = true;
      setIconLayer(getIconLayer(alertsToEdit, MAP_TYPE));
    } else {
      setAlertId(null);
      setIconLayer(getIconLayer(pageData, MAP_TYPE));
    }
  }
  const updatePage = data => {
    setAlertId(null);
    setIconLayer(getIconLayer(data, MAP_TYPE));
    setPageData(data);
  };
  
  return(
    <>
      <Row>
        {
          pageData.map((alert, index) => <Report
            key={index}
            card={alert}
            setSelectedAlert={setSelectedReport}
            setFavorite={setFavoriteFlag}
            alertId={alertId} />)
        }
      </Row>
      <Row className='text-center'>
        <PaginationWrapper pageSize={4} list={allReports} setPageData={updatePage} />
      </Row>
    </>)
}

ReportList.propTypes = {
  setIconLayer: PropTypes.func,
}

export default ReportList;
