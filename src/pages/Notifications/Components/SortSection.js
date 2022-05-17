import React from 'react';
import { Row, Col, Input} from 'reactstrap';
import PropTypes from 'prop-types';
//i18n
import { withTranslation } from 'react-i18next'
import { useSelector } from 'react-redux';

const SortSection = ({ filteredNotifications, notificationSource, setNotificationSource, sortOrder, setSortOrder, t}) => {
  const notificationSources = useSelector(state => state.notifications.sources);
  return(
    <>
      <hr />
      <Row className='my-2'>
        <Col md={4} className='mx-0 my-1 d-flex'>
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
       
          <Input
            id="alertSource"
            className="btn-sm sort-select-input ms-3"
            name="alertSource"
            placeholder="Source"
            type="select"
            onChange={(e) => setNotificationSource(e.target.value)}
            value={notificationSource}
          >
            <option value={'all'} >Source : All</option>
            {notificationSources.map((notificationSource) => {
              <option value={notificationSource} >Source {notificationSource}</option>
            })}
          </Input>
        </Col>
        <Col>
        </Col>
        <Col xl={3} className="d-flex justify-content-end">
          <span className='my-auto alert-report-text'>{t('Results')} {filteredNotifications.length}</span>
        </Col>
      </Row>
      
    </>
  )
}

SortSection.propTypes = {
  alertSource: PropTypes.string,
  setAlertSource: PropTypes.func,
  filteredNotifications: PropTypes.array,
  setFilterdNotifications: PropTypes.func,
  notificationSource: PropTypes.string,
  setNotificationSource: PropTypes.func,
  sortOrder: PropTypes.string,
  setSortOrder: PropTypes.func,
  t: PropTypes.func
}

export default withTranslation(['common'])(SortSection);