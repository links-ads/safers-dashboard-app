import React from 'react';
import { Row, Col, Input, Label, FormGroup, InputGroup } from 'reactstrap';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
//i18n
import { withTranslation } from 'react-i18next'
import { setFilteredEventAlerts } from '../../../store/appAction';

const SortSection = ({ t, setAlertId, setAlertSource, filteredAlerts, setSortOrder, setStatus }) => {
  const { params } = useSelector(state => state.eventAlerts);
  const alerts = useSelector(state => state.eventAlerts.allAlerts);
  const ongoing = alerts.filter((alert) => alert.status == 'ONGOING').length;
  const closed = alerts.filter((alert) => alert.status == 'CLOSED').length;
  const { sortByDate, alertSource } = params;
  const dispatch = useDispatch();

  const filterByAlertSource = (alertSource) => {
    setAlertId(undefined);
    setAlertSource(alertSource);
  }
  const filterByStatus = (status, checked) => {
    if (!checked) {
      status = ''
    }
    setStatus(status);
  }
  const filterByDate = (sortByDate) => {
    setAlertId(undefined);
    setSortOrder(sortByDate);
  };

  const filterBySearchText = (query) => {
    setAlertId(undefined);
    if (query === '')
      dispatch(setFilteredEventAlerts(alerts));
    else
      dispatch(setFilteredEventAlerts(_.filter(alerts, (o) => (o.title.toLowerCase()).includes(query.toLowerCase()))));
  };

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
            onChange={(e) => filterByStatus(e.target.value, e.target.checked)}
          />
          <Label
            check
            for="onGoing"
          >
            {t('Ongoing', { ns: 'events' })} ({ongoing})
          </Label>
        </FormGroup>
        <FormGroup className="form-group d-inline-block ms-4" check>
          <Input
            id="closedEvents"
            data-testid="closedEvents"
            name="status"
            type="checkbox"
            value="CLOSED"
            onChange={(e) => filterByStatus(e.target.value, e.target.checked)}
          />
          <Label
            check
            for="closedEvents"
          >
            {t('Closed', { ns: 'events' })} ({closed})
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
            <option value={'-date'} >{t('Sort By')} : {t('Date')} {t('desc')}</option>
            <option value={'date'} >{t('Sort By')} : {t('Date')} {t('asc')}</option>
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
            <option value={''} >{t('Source')} : {t('All')}</option>
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
  sortOrder: PropTypes.any,
  setSortOrder: PropTypes.func,
  alertSource: PropTypes.string,
  setAlertSource: PropTypes.func,
  setAlertId: PropTypes.func,
  setStatus: PropTypes.func,
  filteredAlerts: PropTypes.array,
  t: PropTypes.func,
}

export default withTranslation(['common'])(SortSection);