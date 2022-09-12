import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';
import Flatpickr from 'react-flatpickr'
import { InputGroup } from 'reactstrap';

import 'react-datepicker/dist/react-datepicker.css';
import 'flatpickr/dist/themes/material_blue.css'

const DateComponent = ({ 
  setDates = () => { }, 
  clearDates = () => { },
  resetDates = () => { },
  defaultDateRange,
  placeholder=null,
  isDateRangeDisabled=false
}) => {
  const fp = useRef(null);

  const defaultDate = defaultDateRange?.map(date => 
    moment(date).format('DD/MM/YY')
  ) ?? []

  const onClearClick = () => {
    if(!isDateRangeDisabled) {
      const picker = fp.current.flatpickr;
      picker.setDate(defaultDate);
      resetDates();
    }
  }
  return (
    <div className={`mb-0 ${isDateRangeDisabled? 'custom-disabled-container' : ''}`}>
      <InputGroup>
        <div className='bg-white d-flex border-none calender-left'>
          <i className='fa fa-calendar px-2 m-auto calender-icon '></i>
        </div>

        <Flatpickr
          className="form-control d-block"
          placeholder={placeholder ? placeholder : 'dd/mm/yy'}
          ref={fp}
          onChange={(dates) => {
            if (dates.length > 1) setDates(dates)
            else if (dates.length === 0) clearDates()
          }}
          disabled={isDateRangeDisabled}
          options={{
            mode: 'range',
            dateFormat: 'd/m/y',
            defaultDate
          }}
        />

        <div 
          className='bg-white d-flex border-none calender-right' 
          onClick={onClearClick}
        >
          <i className='fa fa-sync px-2 m-auto bg-white border-none'></i>
        </div>
      </InputGroup>
    </div>
  );
};

DateComponent.propTypes = {
  setDates: PropTypes.func,
  clearDates: PropTypes.func,
  resetDates: PropTypes.func,
  defaultDateRange: PropTypes.array,
  placeholder: PropTypes.string,
  isDateRangeDisabled: PropTypes.bool
}

export default DateComponent
