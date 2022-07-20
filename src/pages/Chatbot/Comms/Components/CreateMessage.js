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
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

const CreateMessage = ({ coordinates, setTogglePolygonMap, setToggleCreateNewMessage, setCoordinates  }) => {

  const { t } = useTranslation();  
  const { orgList = [] } = useSelector(state => state.common);
  const { info:user } = useSelector(state => state.user);
  const [orgName, setorgName] = useState('');

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
      <Input
        id="coordinates-input"
        className='mt-3'
        type='textarea'
        name="coordinates-value"
        placeholder='Map Selection, please edit and draw on the map'
        rows="10"
        value={coordinates.map(x => {
          return '[' + x[0] + ' , ' + x[1] + ']';
        }).join('\n')}
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
          >
            <option value="">--{t('Scope')}--</option>
          </Input>
        </Col>
        <Col xl={5}>
          <Input
            id="scope"
            className="btn-sm sort-select-input"
            name="scope"
            type="select"
          >
            <option value="">--{t('Restrictions')}--</option>
          </Input>
        </Col>
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
          onClick={()=>{
            setTogglePolygonMap(false);
            setToggleCreateNewMessage(false);
            setCoordinates([]);
          }}
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
  coordinates: PropTypes.array,
  setTogglePolygonMap: PropTypes.func,
  setToggleCreateNewMessage: PropTypes.func,
  setCoordinates: PropTypes.func
}

export default CreateMessage;
