import React from 'react';
import PropTypes from 'prop-types';
import 'react-datepicker/dist/react-datepicker.css';
import 'flatpickr/dist/themes/material_blue.css'
import Flatpickr from 'react-flatpickr'
import moment from 'moment';
import { FormGroup, InputGroup } from 'reactstrap';

const DateRangePicker = ({ setDates, defaultDateRange }) => {
  return (
    <FormGroup className="mb-4">
      <InputGroup>
        <div className='bg-white d-flex border-none calender-left'>
          <i className='fa fa-calendar px-2 m-auto calender-icon '></i>
        </div>
        <Flatpickr
          className="form-control d-block"
          placeholder="DD-MM-YYYY"
          onChange={(dates) => {
            dates.length > 1 && setDates(dates);
          }}
          options={{
            mode: 'range',
            dateFormat: 'd-m-Y',
            maxDate: moment(new Date()).format('DD-MM-YYYY'),
            defaultDate: defaultDateRange
          }}
        />
        <div className='bg-white d-flex border-none calender-right'>
          <i className='fa fa-sync px-2 m-auto bg-white border-none'></i>
        </div>
      </InputGroup>
    </FormGroup>
  );
};

DateRangePicker.propTypes = {
  setDates: PropTypes.func,
  defaultDateRange: PropTypes.array
}

export default DateRangePicker