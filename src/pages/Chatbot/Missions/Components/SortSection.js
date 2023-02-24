import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Input, Button } from 'reactstrap';
import toastr from 'toastr';

import useSetNewAlerts from 'customHooks/useSetNewAlerts';
import {
  setFilteredMissions,
  refreshMissions,
  allMissionsSelector,
  filteredMissionsSelector,
  missionsPollingDataSelector,
} from 'store/missions.slice';
//i18N

import { getFilteredRec } from '../../filter';

const SortSection = ({
  t,
  missionStatus,
  sortOrder,
  setMissionStatus,
  setSortOrder,
  setTogglePolygonMap,
}) => {
  const allMissions = useSelector(allMissionsSelector);
  const filteredMissions = useSelector(filteredMissionsSelector);
  const pollingData = useSelector(missionsPollingDataSelector);
  const [numberOfUpdates, setNumberOfUpdates] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    if (allMissions.length > 0) {
      const filters = { status: missionStatus };
      const sort = { fieldName: 'start', order: sortOrder };
      const actFiltered = getFilteredRec(allMissions, filters, sort);
      dispatch(setFilteredMissions(actFiltered));
    }
  }, [sortOrder, missionStatus, allMissions, dispatch]);

  useSetNewAlerts(
    numberOfUpdates => {
      setNumberOfUpdates(numberOfUpdates);
      if (numberOfUpdates > 0)
        toastr.success(t('update-notification', { ns: 'chatBot' }));
    },
    pollingData,
    allMissions,
    [pollingData, allMissions],
  );

  const refreshPollingData = data => {
    setSortOrder('desc');
    setMissionStatus('');
    dispatch(refreshMissions(data));
  };

  return (
    <>
      <Row>
        <Col>
          <Button onClick={setTogglePolygonMap}>
            {t('create-new-mission', { ns: 'chatBot' })}
          </Button>
        </Col>
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
            {t('Results')}{' '}
            {filteredMissions ? filteredMissions.length : allMissions.length}
          </span>
        </Col>
      </Row>
      <hr />
      <Row className="my-2">
        <Col className="mx-0 my-1">
          <Input
            id="sortByDate"
            className="btn-sm sort-select-input"
            name="sortByDate"
            placeholder="Sort By : Date"
            type="select"
            onChange={e => setSortOrder(e.target.value)}
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
            id="missionStatus"
            className="btn-sm sort-select-input"
            name="missionStatus"
            placeholder="Source"
            type="select"
            onChange={e => setMissionStatus(e.target.value)}
            value={missionStatus}
            data-testid="missionStatus"
          >
            <option value={''}>--{t('status')}--</option>
            <option value="Created">{t('created').toUpperCase()}</option>
            <option value="Taken In Charge">
              {t('take-in-charge').toUpperCase()}
            </option>
            <option value="Completed">{t('completed').toUpperCase()}</option>
          </Input>
        </Col>
      </Row>
    </>
  );
};

SortSection.propTypes = {
  missionStatus: PropTypes.any,
  sortOrder: PropTypes.string,
  setMissionStatus: PropTypes.func,
  setSortOrder: PropTypes.func,
  t: PropTypes.func,
  setTogglePolygonMap: PropTypes.func,
};

export default withTranslation(['common'])(SortSection);
