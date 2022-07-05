import React from 'react';
import { Row, Col, Input, Label, FormGroup } from 'reactstrap';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import _ from 'lodash';
//i18n
import { withTranslation } from 'react-i18next'

const FILTER_IMAGE = 'IMAGE';
const FILTER_VIDEO = 'VIDEO';

const SortSection = ({ t,
  sortOrder,
  inSituSource,
  checkedStatus,
  setSortOrder,
  setInSituSource,
  setCheckedStatus
}) => {
  const { filteredAlerts, allAlerts: alerts, cameraSources } = useSelector(state => state.inSituAlerts);

  const photo = _.filter(alerts, ({ type }) => type == FILTER_IMAGE);
  const video = _.filter(alerts, ({ type }) => type == FILTER_VIDEO);

  const filterByAlertSource = (inSituSource) => {
    setInSituSource(inSituSource);
  }
  const filterByDate = (sortOrder) => {
    setSortOrder(sortOrder)
  };

  const handleChecked = (value) => {
    if (checkedStatus.includes(value)) {
      setCheckedStatus(_.without(checkedStatus, value))
    } else {
      setCheckedStatus([...checkedStatus, value])
    }
  };

  return (
    <>
      <div>
        <FormGroup className="form-group d-inline-block" check>
          <Input
            id="photo"
            data-testid="photo"
            name="status"
            type="checkbox"
            value={FILTER_IMAGE}
            onChange={(e) => handleChecked(e.target.value)}
          />
          <Label
            check
            for="photo"
          >
            {t('Photos', { ns: 'inSitu' })} ({photo.length})
          </Label>
        </FormGroup>
        <FormGroup className="form-group d-inline-block ms-4" check>
          <Input
            id="video"
            data-testid="video"
            name="status"
            type="checkbox"
            value={FILTER_VIDEO}
            onChange={(e) => handleChecked(e.target.value)}
          />
          <Label
            check
            for="video"
          >
            {t('Videos', { ns: 'inSitu' })} ({video.length})
          </Label>
        </FormGroup>
      </div>

      <Row>
        <Col></Col>
        <Col xl={3} className="d-flex justify-content-end">
          <span className='my-auto alert-report-text'>{t('Results')} {filteredAlerts.length}</span>
        </Col>
      </Row>
      <hr />
      <Row className='my-2'>
        <Col className='mx-0 my-1'>
          <Input
            id="sortOrder"
            className="btn-sm sort-select-input"
            name="sortOrder"
            placeholder="Sort By : Date"
            type="select"
            onChange={(e) => filterByDate(e.target.value)}
            value={sortOrder}
          >
            <option value={'-date'} >{t('Sort By')} : {t('Date')} desc</option>
            <option value={'date'} >{t('Sort By')} : {t('Date')} asc</option>
          </Input>
        </Col>
        <Col xl={4} className='my-1'>
          <Input
            id="inSituSource"
            className="btn-sm sort-select-input"
            name="inSituSource"
            placeholder="Source"
            type="select"
            onChange={(e) => filterByAlertSource(e.target.value)}
            value={inSituSource}
          >
            <option value='' key={''}> ---------- {t('Source')} : {t('All')} -----------</option>
            {
              cameraSources.map((camSrc, index) => <option key={index} value={camSrc}>{camSrc}</option>)
            }
          </Input>
        </Col>
        <Col xl={3}>

        </Col>
      </Row>
    </>
  )
}

SortSection.propTypes = {
  sortOrder: PropTypes.any,
  inSituSource: PropTypes.any,
  checkedStatus: PropTypes.any,
  setSortOrder: PropTypes.func,
  setInSituSource: PropTypes.func,
  setCheckedStatus: PropTypes.func,
  t: PropTypes.func,
}

export default withTranslation(['common'])(SortSection);
