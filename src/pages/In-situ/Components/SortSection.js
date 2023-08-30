import React from 'react';

import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
//i18n
import { Row, Col, Input } from 'reactstrap';

import {
  filteredCameraAlertsSelector,
  cameraSourcesSelector,
  cameraTagsSelector,
} from 'store/insitu.slice';

const SortSection = ({
  t,
  sortOrder,
  inSituSource,
  cameraTag,
  setSortOrder,
  setInSituSource,
  setCameraTag,
}) => {
  const filteredAlerts = useSelector(filteredCameraAlertsSelector);
  const cameraSources = useSelector(cameraSourcesSelector);
  const cameraTags = useSelector(cameraTagsSelector);

  const filterByAlertSource = inSituSource => {
    setInSituSource(inSituSource);
  };

  const filterByCameraTag = cameraTag => {
    setCameraTag(cameraTag);
  };

  const filterByDate = sortOrder => {
    setSortOrder(sortOrder);
  };

  return (
    <>
      <Row>
        <Col></Col>
        <Col xl={3} className="d-flex justify-content-end">
          <span className="my-auto alert-report-text">
            {t('Results')} {filteredAlerts.length}
          </span>
        </Col>
      </Row>
      <hr />
      <Row className="my-2">
        <Col className="mx-0 my-1">
          <Input
            id="sortOrder"
            className="btn-sm sort-select-input"
            name="sortOrder"
            placeholder="Sort By : Date"
            type="select"
            onChange={e => filterByDate(e.target.value)}
            value={sortOrder}
          >
            <option value={'-date'}>
              {t('Sort By')} : {t('Date')} desc
            </option>
            <option value={'date'}>
              {t('Sort By')} : {t('Date')} asc
            </option>
          </Input>
        </Col>
        <Col xl={3} className="my-1">
          <Input
            id="inSituTag"
            className="btn-sm sort-select-input"
            name="inSituTag"
            type="select"
            onChange={e => filterByCameraTag(e.target.value)}
            value={cameraTag}
          >
            <option value="" key={''}>
              {' '}
              ------ {t('Tag')} : {t('Any')} -------
            </option>
            {cameraTags.map(camTag => (
              <option key={camTag} value={camTag}>
                {camTag}
              </option>
            ))}
          </Input>
        </Col>
        <Col xl={4} className="my-1">
          <Input
            id="inSituSource"
            className="btn-sm sort-select-input"
            name="inSituSource"
            placeholder="Source"
            type="select"
            onChange={e => filterByAlertSource(e.target.value)}
            value={inSituSource}
          >
            <option value="" key={''}>
              {' '}
              ---------- {t('Source')} : {t('All')} -----------
            </option>
            {cameraSources.map(camSrc => (
              <option key={camSrc} value={camSrc}>
                {camSrc}
              </option>
            ))}
          </Input>
        </Col>
        <Col xl={1}></Col>
      </Row>
    </>
  );
};

SortSection.propTypes = {
  sortOrder: PropTypes.any,
  inSituSource: PropTypes.any,
  cameraTag: PropTypes.any,
  checkedStatus: PropTypes.any,
  setSortOrder: PropTypes.func,
  setInSituSource: PropTypes.func,
  setCameraTag: PropTypes.func,
  setCheckedStatus: PropTypes.func,
  t: PropTypes.func,
};

export default withTranslation(['common'])(SortSection);
