import React from 'react';
import { Row, Col, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

//i18N
import { withTranslation } from 'react-i18next';

const SortSection = ({ t, status, activity, sortOrder, setStatus, setActivity, setSortOrder }) => {
  const { allPeople } = useSelector(state => state.people);

  return (
    <>

      <Row className=''>
        <Col></Col>
        <Col xl={3} className="d-flex justify-content-end">
          <span className='my-auto alert-report-text'>{t('Results')} {allPeople.length}</span>
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
            onChange={(e) => setSortOrder(e.target.value)}
            value={sortOrder}
          >
            <option value={'-date'} >{t('Sort By')} : {t('Date')} {t('desc')}</option>
            <option value={'date'} >{t('Sort By')} : {t('Date')} {t('asc')}</option>
          </Input>
        </Col>
        <Col xl={4} className='my-1'>
          <Input
            id="status"
            className="btn-sm sort-select-input"
            name="status"
            placeholder="Status"
            type="select"
            onChange={(e) => setStatus(e.target.value)}
            value={status}
            data-testid='status'
          >
            <option value={''} >--Status--</option>
            <option value="Active" >{t('Active').toUpperCase()}</option>
            <option value="Inactive" >{t('Inactive').toUpperCase()}</option>
          </Input>
        </Col>
        <Col xl={4} className='my-1'>
          <Input
            id="activity"
            className="btn-sm sort-select-input"
            name="activity"
            placeholder="Activity"
            type="select"
            onChange={(e) => setActivity(e.target.value)}
            value={activity}
            data-testid='activity'
          >
            <option value={''} >--Activity--</option>
            <option value="Online" >{t('Online').toUpperCase()}</option>
            <option value="Offline" >{t('Offline').toUpperCase()}</option>
          </Input>
        </Col>
      </Row>
    </>
  )
}

SortSection.propTypes = {
  status: PropTypes.any,
  activity: PropTypes.any,
  sortOrder: PropTypes.string,
  setStatus: PropTypes.func,
  setActivity: PropTypes.func,
  setSortOrder: PropTypes.func,
  t: PropTypes.func
}

export default withTranslation(['common'])(SortSection);
