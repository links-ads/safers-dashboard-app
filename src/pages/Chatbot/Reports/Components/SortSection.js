import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Input, Button } from 'reactstrap';
import toastr from 'toastr';

import useSetNewAlerts from 'customHooks/useSetNewAlerts';
import { fetchEndpoint } from 'helpers/apiHelper';
import {
  setFilteredReports,
  refreshReports,
  allReportsSelector,
  filteredReportsSelector,
  reportsSortOrderSelector,
  reportsCategorySelector,
  reportsMissionIdSelector,
  reportsPollingDataSelector,
} from 'store/reports.slice';

import { getFilteredRec } from '../../filter';

//i18N

const SortSection = ({ t, boundingBox, mapFilter }) => {
  const OrgReportList = useSelector(allReportsSelector);
  const filteredReports = useSelector(filteredReportsSelector);
  const sortOrder = useSelector(reportsSortOrderSelector);
  const category = useSelector(reportsCategorySelector);
  const missionId = useSelector(reportsMissionIdSelector);
  const pollingData = useSelector(reportsPollingDataSelector);

  const [selectOptions, setSelectOptions] = useState([]);
  const [numberOfUpdates, setNumberOfUpdates] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    if (OrgReportList.length) {
      applyFilter(sortOrder, category, missionId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [OrgReportList, boundingBox]);

  const applyFilter = (sortOrder, category, missionId) => {
    const filters = {
      categories: category,
      mission_id: missionId,
    };

    const sort = { fieldName: 'timestamp', order: sortOrder };
    const actFiltered = getFilteredRec(OrgReportList, filters, sort);
    dispatch(
      setFilteredReports({
        data: actFiltered,
        filterParams: {
          missionId,
          category,
          sortOrder,
          boundingBox,
          mapFilter,
        },
      }),
    );
  };

  //fetch data to populate 'Categories' select
  useEffect(() => {
    (async () => {
      const categories = await fetchEndpoint('/chatbot/reports/categories');
      setSelectOptions(categories);
    })();
  }, []);

  useSetNewAlerts(
    numberOfUpdates => {
      setNumberOfUpdates(numberOfUpdates);
      if (numberOfUpdates > 0)
        toastr.success(t('update-notification', { ns: 'chatBot' }));
    },
    pollingData,
    OrgReportList,
    [pollingData, OrgReportList],
    'report_id',
  );

  const refreshPollingData = data => {
    applyFilter('desc', '', '');
    dispatch(refreshReports(data));
  };

  return (
    <>
      <Row className="">
        <Col xl={4}>
          <Input
            type="select"
            className="btn-sm sort-select-input"
            value={missionId}
            onChange={({ target: { value } }) => {
              // this is necessary because the select stringifies the value
              let filterValue = value;
              if (value === 'true') filterValue = true;
              if (value === 'false') filterValue = false;
              applyFilter(sortOrder, category, filterValue);
            }}
          >
            <option value="">{t('All')}</option>
            <option value={true}>
              {t('filter-assigned-to', { ns: 'chatBot' })}
            </option>
            <option value={false}>
              {t('filter-unassigned-to', { ns: 'chatBot' })}
            </option>
          </Input>
        </Col>
        <Col xl={4} />
        <Col xl={4} className="d-flex justify-content-end">
          {numberOfUpdates > 0 && (
            <Button
              className="btn mt-1 py-0 px-1 me-2 bg-danger"
              onClick={() => refreshPollingData(pollingData)}
              aria-label="refresh-results"
            >
              <i className="mdi mdi-sync"></i>
              <span>
                {numberOfUpdates} {t('new-updates')}
              </span>
            </Button>
          )}
          <span className="my-auto alert-report-text">
            {t('Results')} {filteredReports ? filteredReports.length : 0}
          </span>
        </Col>
      </Row>
      <hr />
      <Row className="my-2">
        <Col xl={6} className="mx-0 my-1">
          <Input
            id="sortByDate"
            className="btn-sm sort-select-input"
            name="sortByDate"
            placeholder="Sort By : Date"
            type="select"
            onChange={e => applyFilter(e.target.value, category, missionId)}
            value={sortOrder}
          >
            <option value={'desc'}>
              {t('Sort By')} : {t('Date')} {t('desc')}
            </option>
            <option value={'asc'}>
              {t('Sort By')} : {t('Date')} {t('asc')}
            </option>
          </Input>
        </Col>
        <Col xl={6} className="my-1">
          <Input
            id="category"
            className="btn-sm sort-select-input text-capitalize"
            name="category"
            type="select"
            onChange={({ target: { value } }) =>
              applyFilter(sortOrder, value, missionId)
            }
            data-testid="reportAlertCategory"
            value={category}
          >
            <option value={''}>
              {t('category')}: {t('all')}
            </option>
            {selectOptions.map(option => (
              <option key={option.toLowerCase()} value={option}>
                {t('category')}: {option}
              </option>
            ))}
          </Input>
        </Col>
      </Row>
    </>
  );
};

SortSection.propTypes = {
  sortOrder: PropTypes.string,
  setSortOrder: PropTypes.func,
  setCategory: PropTypes.func,
  t: PropTypes.func,
  missionId: PropTypes.string,
  setMissionId: PropTypes.func,
  boundingBox: PropTypes.string,
  mapFilter: PropTypes.object,
};

export default withTranslation(['common'])(SortSection);
