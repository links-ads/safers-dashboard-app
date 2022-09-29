import React, { useEffect, useState } from 'react';
import { Row, Col, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEndpoint } from '../../../../helpers/apiHelper'
import { getFilteredRec } from '../../filter';
import { setFilterdReports } from '../../../../store/reports/action';

//i18N
import { withTranslation } from 'react-i18next';

const SortSection = ({ 
  t, 
}) => {
  const { allReports: OrgReportList, sortOrder, category, missionId } = useSelector(state => state.reports);
  const [selectOptions, setSelectOptions] = useState([]);
  const dispatch = useDispatch();


  useEffect(() => {
    if(OrgReportList.length){
      applyFilter(sortOrder, category, missionId);
    }
  }, [OrgReportList])

  const applyFilter = (sortOrder, category, missionId) => {
    const filters = { 
      categories: category,
      mission_id:  missionId
    };
  
    const sort = { fieldName: 'timestamp', order: sortOrder };
    const actFiltered = getFilteredRec(OrgReportList, filters, sort);
    dispatch(setFilterdReports(actFiltered, {missionId, category, sortOrder}));
  }

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
              applyFilter(sortOrder, category, filterValue)
            }}
          >
            <option value=''>{t('All')}</option>
            <option value={true}>{t('Assigned to Mission')}</option>
            <option value={false}>{t('Unassigned to Mission')}</option>
          </Input>
        </Col>
        <Col xl={5} />
        <Col xl={3} className="d-flex justify-content-end">
          <span className='my-auto alert-report-text'>{t('Results')} {OrgReportList.length}</span>
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
            onChange={(e) => applyFilter(e.target.value, category, missionId)}
            value={sortOrder}
          >
            <option value={'desc'} >{t('Sort By')} : {t('Date')} {t('desc')}</option>
            <option value={'asc'} >{t('Sort By')} : {t('Date')} {t('asc')}</option>
          </Input>
        </Col>
        <Col xl={6} className='my-1'>
          <Input
            id="category"
            className="btn-sm sort-select-input text-capitalize"
            name="category"
            type="select"
            onChange={({ target: { value } }) => 
              applyFilter(sortOrder, value.toLowerCase(), missionId)
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
