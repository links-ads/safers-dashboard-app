import React from 'react';
import PropTypes from 'prop-types';

import 'react-datepicker/dist/react-datepicker.css';

import 'flatpickr/dist/themes/material_blue.css'
import Flatpickr from 'react-flatpickr'
import { FormGroup, InputGroup } from 'reactstrap';

const DateComponent = (props) => {

  return (

    <FormGroup className="mb-4">
      <InputGroup>
        <div className='bg-white d-flex border-none calender-left'>
          <i className='fa fa-calendar px-2 m-auto calender-icon '></i>
        </div>
        
        <Flatpickr
          className="form-control d-block"
          placeholder="dd M,yyyy"
          onChange={(dates) => {
            dates.length > 1 && props.setDates(dates);
          }}
          options={{
            mode: 'range',
            dateFormat: 'Y-m-d',
          }}
        />

        <div className='bg-white d-flex border-none calender-right'>
          <i className='fa fa-sync px-2 m-auto bg-white border-none'></i>
        </div>
      </InputGroup>
    </FormGroup>
  );
};

DateComponent.propTypes = {
  setDates : PropTypes.func
}

export default DateComponent