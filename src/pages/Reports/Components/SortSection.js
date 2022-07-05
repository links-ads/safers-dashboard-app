import React from 'react';
import { Row, Col, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

//i18N
import { withTranslation } from 'react-i18next';

const SortSection = ({ t, reportSource, sortOrder, setReportSource, setSortOrder }) => {
  const { allReports } = useSelector(state => state.reports);

  return (
    <>

      <Row className=''>
        <Col></Col>
        <Col xl={3} className="d-flex justify-content-end">
          <span className='my-auto alert-report-text'>{t('Results')} {allReports.length}</span>
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
            id="alertSource"
            className="btn-sm sort-select-input"
            name="alertSource"
            placeholder="Source"
            type="select"
            onChange={(e) => setReportSource(e.target.value)}
            value={reportSource}
            data-testid='reportAlertSource'
          >
            <option value={''} >Source : All</option>
          </Input>
        </Col>
        <Col xl={3}>

        </Col>
      </Row>
    </>
  )
}

SortSection.propTypes = {
  reportSource: PropTypes.any,
  sortOrder: PropTypes.string,
  setReportSource: PropTypes.func,
  setSortOrder: PropTypes.func,
  t: PropTypes.func
}

export default withTranslation(['common'])(SortSection);
