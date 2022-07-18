import React from 'react';
import PropTypes from 'prop-types'
import { Input, Button } from 'reactstrap';
import DateRangePicker from '../../../../components/DateRangePicker/DateRange';

const CreateMission = ({ onCancel, coordinates }) => {

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
    <Input
      id="coordinates-input"
      className='mt-3'
      type='textarea'
      name="coordinates-value"
      placeholder='Map Selection'
      rows="10"
      value={coordinates.map(x => {
        return '[' + x[0] + ' , ' + x[1] + ']';
      }).join('\n')}
    />
    <div className='mt-3'>
      <h5>Assign To:</h5>
      {
        //Dropdowns goes here
      }
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
  coordinates: PropTypes.array,
  onCancel: PropTypes.func,
}

export default CreateMission;
