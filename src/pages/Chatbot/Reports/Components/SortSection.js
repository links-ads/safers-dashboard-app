import React, { useEffect, useState } from 'react';
import { Row, Col, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { fetchEndpoint } from '../../../../helpers/apiHelper'

//i18N
import { withTranslation } from 'react-i18next';

const SortSection = ({ 
  t, 
  sortOrder, 
  setSortOrder,
  setCategory,
  missionId,
  setMissionId
}) => {
  const { allReports } = useSelector(state => state.reports);
  const [selectOptions, setSelectOptions] = useState([]);

  //fetch data to populate 'Categories' select
  useEffect(() => {
    (async () => {
      const categories = await fetchEndpoint('/chatbot/reports/categories');
      setSelectOptions(categories)
    })()
  }, []);

  return (
    <>
      <Row className=''>
        <Col xl={4}>
          <Input
            type='select'
            className="btn-sm sort-select-input"
            value={missionId}
            onChange={({ target: { value } }) => {
              // this is necessary because the select stringifies the value
              let filterValue = value;
              if (value === 'true') filterValue = true;
              if (value === 'false') filterValue = false;
              setMissionId(filterValue);
            }}
          >
            <option value=''>{t('All')}</option>
            <option value={true}>{t('Assigned to Mission')}</option>
            <option value={false}>{t('Unassigned to Mission')}</option>
          </Input>
        </Col>
        <Col xl={5} />
        <Col xl={3} className="d-flex justify-content-end">
          <span className='my-auto alert-report-text'>{t('Results')} {allReports.length}</span>
        </Col>
      </Row>
      <hr />
      <Row className='my-2'>
        <Col xl={6} className='mx-0 my-1'>
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
        <Col xl={6} className='my-1'>
          <Input
            id="category"
            className="btn-sm sort-select-input text-capitalize"
            name="category"
            type="select"
            onChange={({ target: { value } }) => 
              setCategory(value.toLowerCase())
            }
            data-testid='reportAlertCategory'
          >
            <option value={''}>{t('Category')}: All</option>
            {selectOptions.map((option) => (
              <option key={option} value={option}>{t('Category')}: {option}</option>
            ))}
          </Input>
        </Col>
      </Row>
    </>
  )
}

SortSection.propTypes = {
  sortOrder: PropTypes.string,
  setSortOrder: PropTypes.func,
  setCategory: PropTypes.func,
  t: PropTypes.func,
  missionId: PropTypes.string,
  setMissionId: PropTypes.func
}

export default withTranslation(['common'])(SortSection);
