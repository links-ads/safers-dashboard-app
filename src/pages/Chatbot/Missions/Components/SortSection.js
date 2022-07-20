import React from 'react';
import { Row, Col, Input, Button } from 'reactstrap';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

//i18N
import { withTranslation } from 'react-i18next';

const SortSection = ({ t, missionStatus, sortOrder, setMissionStatus, setSortOrder, setTogglePolygonMap }) => {
  const { allMissions } = useSelector(state => state.missions);

  return (
    <>

      <Row className=''>
        <Col>
          <Button
            onClick={setTogglePolygonMap}>
            Create New Mission
          </Button>
        </Col>
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
        <Col xl={6} className='my-1'>
          <Input
            id="missionStatus"
            className="btn-sm sort-select-input"
            name="missionStatus"
            placeholder="Source"
            type="select"
            onChange={(e) => setMissionStatus(e.target.value)}
            value={missionStatus}
            data-testid='missionStatus'
          >
            <option value={''} >--Status--</option>
            <option value="created" >{t('created').toUpperCase()}</option>
            <option value="taken_in_charge" >{t('taken in charge').toUpperCase()}</option>
            <option value="completed" >{t('completed').toUpperCase()}</option>
          </Input>
        </Col>
      </Row>
    </>
  )
}

SortSection.propTypes = {
  missionStatus: PropTypes.any,
  sortOrder: PropTypes.string,
  setMissionStatus: PropTypes.func,
  setSortOrder: PropTypes.func,
  t: PropTypes.func,
  setTogglePolygonMap: PropTypes.func
}

export default withTranslation(['common'])(SortSection);
