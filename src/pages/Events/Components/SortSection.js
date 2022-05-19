import React, { useEffect, useState } from 'react';
import { Row, Col, Input, Label, FormGroup, InputGroup } from 'reactstrap';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import _ from 'lodash';
//i18n
import { withTranslation } from 'react-i18next'

const SortSection = ({t, setAlertId, setAlertSource, setFilterdAlerts, setSortByDate}) => {
  const { params, filteredAlerts } = useSelector(state => state.eventAlerts);
  const { sortByDate, alertSource } = params;

  const alerts = useSelector(state => state.eventAlerts.allAlerts);
  const ongoing = _.sumBy(alerts, ({ status }) => status == 'ONGOING');
  const closed = _.sumBy(alerts, ({ status }) => status == 'CLOSED');
  const [checkedStatus, setCheckedStatus] = useState([])

  const filterByAlertSource = (alertSource) => {
    setAlertId(undefined);
    setAlertSource(alertSource);
    if (alertSource === 'all')
      setFilterdAlerts(alerts);
    else
      setFilterdAlerts(_.filter(alerts, (o) => o.source.includes(alertSource)));
  }
  const filterByDate = (sortByDate) => {
    setAlertId(undefined);
    setSortByDate(sortByDate)
    setFilterdAlerts(_.orderBy(filteredAlerts, ['timestamp'], [sortByDate]));
  };

  const filterBySearchText = (query) => {
    setAlertId(undefined);
    if (query === '')
      setFilterdAlerts(alerts);
    else
      setFilterdAlerts(_.filter(alerts, (o) => (o.title.toLowerCase()).includes(query.toLowerCase())));
  };

  const handleChecked = (value) => {
    if (checkedStatus.includes(value)) {
      setCheckedStatus(_.remove(checkedStatus, (status) => status != value))
    } else {
      setCheckedStatus([...checkedStatus, value])
    }
  };

  useEffect(() => {
    setAlertId(undefined);
    if (checkedStatus.length == 0) {
      setFilterdAlerts(alerts)
    } else {
      setFilterdAlerts(_.filter(alerts, (o) => checkedStatus.includes(o.status)));
    }
  }, [checkedStatus]);

  return (
    <>
      <div data-testid='status-section'>
        <FormGroup className="form-group d-inline-block" check>
          <Input
            id="onGoing"
            data-testid="onGoing"
            name="status"
            type="checkbox"
            value="ONGOING"
            onChange={(e) => handleChecked(e.target.value)}
          />
          <Label
            check
            for="onGoing"
          >
            {t('Ongoing', {ns: 'events'})} ({ongoing})
          </Label>
        </FormGroup>
        <FormGroup className="form-group d-inline-block ms-4" check>
          <Input
            id="closedEvents"
            data-testid="closedEvents"
            name="status"
            type="checkbox"
            value="CLOSED"
            onChange={(e) => handleChecked(e.target.value)}
          />
          <Label
            check
            for="closedEvents"
          >
            {t('Closed', {ns: 'events'})} ({closed})
          </Label>
        </FormGroup>
      </div>
            
      <Row data-testid='results-section'>
        <Col></Col>
        <Col xl={3} className="d-flex justify-content-end">
          <span className='my-auto alert-report-text'>{t('Results')} {filteredAlerts.length}</span>
        </Col>
      </Row>
      <hr />
      <Row className='my-2'>
        <Col className='mx-0 my-1'>
          <Input
            id="sortByDate"
            className="btn-sm sort-select-input"
            name="sortByDate"
            placeholder="Sort By : Date"
            type="select"
            onChange={(e) => filterByDate(e.target.value)}
            value={sortByDate}
          >
            <option value={'desc'} >{t('Sort By')} : {t('Date')} {t('desc')}</option>
            <option value={'asc'} >{t('Sort By')} : {t('Date')} {t('asc')}</option>
          </Input>
        </Col>
        <Col xl={4} className='my-1'>
          <Input
            id="alertSource"
            className="btn-sm sort-select-input"
            name="alertSource"
            placeholder="Source"
            type="select"
            onChange={(e) => filterByAlertSource(e.target.value)}
            value={alertSource}
            data-testid='eventAlertSource'
          >
            <option value={'all'} >{t('Source')} : {t('All')}</option>
            <option value={'web'} >{t('Source')} : Web</option>
            <option value={'camera'} >{t('Source')} : Camera</option>
            <option value={'satellite'} >{t('Source')} : Satellite</option>
          </Input>
        </Col>
        <Col xl={3}>

        </Col>
      </Row>
      <Row className='mt-3'>
        <Col xs={12}>
          <FormGroup >
            <InputGroup>
              <div className='bg-white d-flex border-none search-left'>
                <i className='fa fa-search px-2 m-auto calender-icon'></i>
              </div>
              <Input
                id="searchEvents"
                data-testid="searchEvents"
                name="searchEvents"
                className='search-input'
                placeholder='Search for an event'
                onChange={(e) => filterBySearchText(e.target.value)}
              />
            </InputGroup>
          </FormGroup>
        </Col>
      </Row>
    </>
  )
}

SortSection.propTypes = {
  sortByDate: PropTypes.any,
  setSortByDate: PropTypes.func,
  alertSource: PropTypes.string,
  setAlertSource: PropTypes.func,
  setAlertId: PropTypes.func,
  setFilterdAlerts: PropTypes.func,
  t: PropTypes.func,
}

export default withTranslation(['common'])(SortSection);