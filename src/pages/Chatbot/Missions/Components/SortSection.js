import React from 'react';
import { Row, Col, Input, Button } from 'reactstrap';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

//i18N
import { withTranslation } from 'react-i18next';

const SortSection = ({ t, missionSource, sortOrder, setMissionSource, setSortOrder, setTogglePolygonMap }) => {
  const { allMissions } = useSelector(state => state.missions);

  return (
    <>

      <Row className=''>
        <Col></Col>
        <Col xl={3} className="d-flex justify-content-end">
          <span className='my-auto alert-mission-text'>{t('Results')} {allMissions.length}</span>
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
            onChange={(e) => setMissionSource(e.target.value)}
            value={missionSource}
            data-testid='missionAlertSource'
          >
            <option value={''} >Source : All</option>
          </Input>
        </Col>
        <Col xl={3} className='my-1'>
          <Button
            onClick={setTogglePolygonMap} className='align-self-baseline p-0'>
            Create New Mission
          </Button>
        </Col>
      </Row>
    </>
  )
}

SortSection.propTypes = {
  missionSource: PropTypes.any,
  sortOrder: PropTypes.string,
  setMissionSource: PropTypes.func,
  setSortOrder: PropTypes.func,
  t: PropTypes.func,
  setTogglePolygonMap: PropTypes.func
}

export default withTranslation(['common'])(SortSection);
