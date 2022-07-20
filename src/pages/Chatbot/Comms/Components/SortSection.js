import React from 'react';
import { Row, Col, Input, Button } from 'reactstrap';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

//i18N
import { withTranslation } from 'react-i18next';

const SortSection = ({ t, commStatus, sortOrder, setcommStatus, setSortOrder, target, setTarget, setTogglePolygonMap }) => {
  const { allComms } = useSelector(state => state.comms);

  return (
    <>
      <Row>
        <Col>          
          <Button onClick={setTogglePolygonMap}>
            Create New Message
          </Button>
        </Col>
        <Col className="d-flex justify-content-end">
          <span className='my-auto alert-report-text'>{t('Results')} {allComms.length}</span>
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
            id="commStatus"
            className="btn-sm sort-select-input"
            name="commStatus"
            placeholder="Source"
            type="select"
            onChange={(e) => setcommStatus(e.target.value)}
            value={commStatus}
            data-testid='commStatus'
          >
            <option value={''} >--Status--</option>
            <option value="ongoing" >{t('ongoing').toUpperCase()}</option>
            <option value="expired" >{t('expired').toUpperCase()}</option>
          </Input>
        </Col>
        <Col xl={4} className='my-1'>
          <Input
            id="target"
            className="btn-sm sort-select-input"
            name="target"
            placeholder="Source"
            type="select"
            onChange={(e) => setTarget(e.target.value)}
            value={target}
            data-testid='target'
          >
            <option value={''} >--Target--</option>
            <option value="scope" >{t('scope')}</option>
            <option value="restrictions" >{t('restrictions')}</option>
          </Input>
        </Col>
      </Row>
    </>
  )
}

SortSection.propTypes = {
  commStatus: PropTypes.string,
  sortOrder: PropTypes.string,
  setcommStatus: PropTypes.func,
  setSortOrder: PropTypes.func,
  t: PropTypes.func,
  setTogglePolygonMap: PropTypes.func,
  target: PropTypes.string,
  setTarget: PropTypes.func
}

export default withTranslation(['common'])(SortSection);
