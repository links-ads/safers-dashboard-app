import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types'
import { Input, Button, Row, Col, Label } from 'reactstrap';
import DateRangePicker from '../../../../components/DateRangePicker/DateRange';
import MapInput from '../../../../components/BaseMap/MapInput';

import _ from 'lodash';


const CreateMission = ({ t, onCancel, coordinates, setCoordinates }) => {

  const [team, setTeam] = useState();
  const { orgList = [] } = useSelector(state => state.common);
  const { info:user } = useSelector(state => state.user);
  const [orgName, setorgName] = useState('');
  const [chatbotUser, setChatbotUser] = useState();

  useEffect(() => {
    if(orgList.length && user?.organization){
      const organization = _.find(orgList, { id: user.organization });
      setorgName(organization.name.split('-')[0])
    }
  }, [orgList, user]);

  return (<>
    <Input
      id="mission-title-input"
      className='mb-3'
      name="mission-title"
      placeholder='Message Title'
      rows="10"
    />
    <DateRangePicker
      type='text'
      placeholder='Start Date - End Date'
      isTooltipInput={true}
      showIcons={true}
    />
    <MapInput
      id="coordinates-input"
      className='mt-3'
      type='textarea'
      name="coordinates-value"
      placeholder='Map Selection'
      rows="10"
      coordinates={coordinates}
      setCoordinates={setCoordinates}
    />
    <div className='mt-3'>
      <Label className='fw-bold' htmlFor="target">{t('Assign To')}: </Label>
      <Row>
        <Col><Label className='form-label mt-3 mb-0'>{t('Organisation')}: {orgName}</Label></Col>
        <Col>
          <Input
            id="team"
            className="btn-sm sort-select-input"
            name="team"
            placeholder="Team"
            type="select"
            onChange={(e) => {
              setTeam(e.target.value);
              if(!e.target.value) {
                setChatbotUser('');
              }
            }}
            value={team}
          >
            <option value={''} >--{t('Team')}--</option>
            <option value={'team1'} >{t('Team1')}</option>
            <option value={'team2'} >{t('Team2')}</option>
            <option value={'team3'} >{t('Team3')}</option>
          </Input>
        </Col>
        <Col>
          <Input
            id="team"
            className="btn-sm sort-select-input"
            name="team"
            placeholder="Team"
            type="select"
            disabled={!team}
            onChange={(e) => setChatbotUser(e.target.value)}
            value={chatbotUser}
          >
            <option value={''} >--{t('Chatbot User')}--</option>
            <option value={'user1'} >{t('User1')}</option>
            <option value={'user2'} >{t('User2')}</option>
            <option value={'user3'} >{t('User3')}</option>
          </Input>
        </Col>
      </Row>
      
    </div>
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
  </>)
}

CreateMission.propTypes = {
  coordinates: PropTypes.any,
  onCancel: PropTypes.func,
  t: PropTypes.any,
  setCoordinates: PropTypes.func
}

export default CreateMission;
