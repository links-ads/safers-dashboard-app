import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'
import {
  Input,
  Button,
  Label,
  Row,
  Col
} from 'reactstrap';
import DateRangePicker from '../../../../components/DateRangePicker/DateRange';
import MapInput from '../../../../components/BaseMap/MapInput';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

const CreateMessage = ({ coordinates, onCancel, setCoordinates }) => {

  const { t } = useTranslation();  
  const { orgList = [] } = useSelector(state => state.common);
  const { info:user } = useSelector(state => state.user);
  const [orgName, setorgName] = useState('');
  const [scope, setScope] = useState('');

  useEffect(() => {
    if(orgList.length && user?.organization){
      const organization = _.find(orgList, { id: user.organization });
      setorgName(organization.name.split('-')[0])
    }
  }, [orgList, user]);

  return (
    <>
      <DateRangePicker
        type='text'
        placeholder='Start Date | End date'
        isTooltipInput={true}
        showIcons={true}
      />
      <MapInput
        id="coordinates-input"
        className='mt-3'
        type='textarea'
        name="coordinates-value"
        placeholder='Map Selection, please edit and draw on the map'
        rows="10"
        coordinates={coordinates}
        setCoordinates={setCoordinates}
      />
      <Label className='form-label mt-3 mb-0'>{t('Organisation')}: {orgName}</Label>
      <Row className='my-3'>
        <Col xl={1} md={2}><Label htmlFor="target">{t('Target')}: </Label></Col>
        <Col xl={5} className="pe-xl-0 text-center">
          <Input
            id="scope"
            className="btn-sm sort-select-input me-2 mb-2"
            name="scope"
            type="select"
            onChange={(e)=>{setScope(e.target.value)}}
          >
            <option value="">--{t('Scope')}--</option>
            <option value="public">{t('Public')}</option>
            <option value="restricted">{t('Restricted')}</option>
          </Input>
        </Col>
        { scope === 'restricted' && <Col xl={5}>
          <Input
            id="restrictions"
            className="btn-sm sort-select-input"
            name="restrictions"
            type="select"
          >
            <option value="">--{t('Restrictions')}--</option>
            <option value="citizen">{t('Citizen')}</option>
            <option value="professional">{t('Professional')}</option>
            <option value="organisation">{t('Organisation')}</option>
          </Input>
        </Col>}
      </Row>
      <Input
        id="message-description-input"
        className='mt-3'
        type='textarea'
        name="message-description"
        placeholder='Message Description'
        rows="10"
      />
      <div className='mt-3'>
        <Button
          type="button"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="button"
          className="mx-3"
        >
          Send
        </Button>
      </div>
    </>
  )
}

CreateMessage.propTypes = {
  coordinates: PropTypes.any,
  onCancel: PropTypes.func,
  setCoordinates: PropTypes.func
}

export default CreateMessage;
