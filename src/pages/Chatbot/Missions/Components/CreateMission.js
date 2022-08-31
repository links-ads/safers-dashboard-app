import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types'
import { Input, Button, Row, Col, Label, FormGroup } from 'reactstrap';
import DateRangePicker from '../../../../components/DateRangePicker/DateRange';
import MapInput from '../../../../components/BaseMap/MapInput';
import { getError }  from '../../../../helpers/errorHelper';
import { createMission } from '../../../../store/missions/action';
import moment from 'moment'

import _ from 'lodash';

import toastr from 'toastr';
import 'toastr/build/toastr.min.css'


const CreateMission = ({ t, onCancel, coordinates, setCoordinates }) => {

  const dispatch = useDispatch();

  const { orgList = [] } = useSelector(state => state.common);
  const { info:user } = useSelector(state => state.user);
  const { missionCreated } = useSelector(state => state.missions);

  const [team, setTeam] = useState();
  const [orgName, setorgName] = useState('--');
  const [chatbotUser, setChatbotUser] = useState();
  const [title, setTitle] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [desc, setDesc] = useState(null);
  const [errors, setErrors] = useState({});
  const [validCoords, isValidCoordFormat] = useState(false);

  useEffect(() => {
    if(orgList.length && user?.organization){
      const organization = _.find(orgList, { id: user.organization });
      setorgName(organization.name.split('-')[0])
    }
  }, [orgList, user]);

  useEffect(() => {
    if (missionCreated) {
      toastr.success(missionCreated.msg, '');
    }

  }, [missionCreated]);

  useEffect(() => {
    if(dateRange){// On blur validation after setting values
      validate();
    }

  }, [title, dateRange, desc, coordinates, validCoords]);

  const handleDateRangePicker = (dates) => {
    setDateRange(dates.map(date => 
      moment(date).format('YYYY-MM-DD'))
    );
  }

  const validate = () => {
    let errors = {};

    if(!title)
      errors['title'] = 'This field is required';

    if(!desc)
      errors['desc'] = 'This field is required' ;

    if(!coordinates){
      errors['coordinates'] = 'Please select your area on the map' ;
    }
    else if (!validCoords) {
      errors['coordinates'] = 'Please correct your coordinates' ;
    }
      

    if(!dateRange)
      errors['dateRange'] = 'Please select start/end date' ;
    
    setErrors(errors);
  }

  const submitMsg = () => {
    validate();
    if(Object.keys(errors).length === 0){
      const payload = {
        title,
        description: desc,
        start: dateRange[0] ? dateRange[0]: null,
        end: dateRange[1] ? dateRange[1]: null,
        source: 'Chatbot',
        geometry: coordinates ? coordinates : null
      }
      dispatch(createMission(payload))
    }
  }

  return (<>
    <FormGroup className="form-group">
      <Input
        id="mission-title-input"
        className={`${getError('title', errors, errors)}`}
        name="title"
        placeholder='Message Title'
        type="text"
        onChange={(e) => {setTitle(e.target.value); validate({name:'title'});}}
        value={title}
      />
      {getError('title', errors, errors, false)}
    </FormGroup>

    <FormGroup className="form-group mt-3">
      <DateRangePicker
        type='text'
        placeholder='Start Date - End Date'
        className={`${getError('dateRange', errors, errors)}`}
        setDates={handleDateRangePicker}
        defaultDateRange={dateRange}
        isTooltipInput={true}
        showIcons={true}
      />
      {getError('dateRange', errors, errors, false)}
    </FormGroup>
    <FormGroup className="form-group mt-3">
      <MapInput
        id="coordinates-input"
        className={`${getError('coordinates', errors, errors)}`}
        type='textarea'
        name="coordinates-value"
        placeholder='Map Selection'
        rows="10"
        coordinates={coordinates}
        setCoordinates={setCoordinates}
        isValidFormat={isValidCoordFormat}
      />
      {getError('coordinates', errors, errors, false)}
    </FormGroup>
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
            onChange={(e) => {setChatbotUser(e.target.value); validate();}}
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
    <FormGroup className="form-group mt-3">
      <Input
        id="message-description-input"
        className={`${getError('desc', errors, errors)}`}
        type='textarea'
        name="message-description"
        placeholder='Message Description'
        onChange={(e) => {setDesc(e.target.value); validate();}}
        value={desc}
        rows="10"
      />
      {getError('desc', errors, errors, false)}
    </FormGroup>
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
        onClick={submitMsg}
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
