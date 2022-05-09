import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import 'react-datepicker/dist/react-datepicker.css';

import 'flatpickr/dist/themes/material_blue.css'
import Flatpickr from 'react-flatpickr'
import { InputGroup } from 'reactstrap';

const DateComponent = ({ setDates = () => { }, clearDates = () => { } }) => {
  const fp = useRef(null);
  return (

    <div className='mb-0'>
      <InputGroup>
        <div className='bg-white d-flex border-none calender-left'>
          <i className='fa fa-calendar px-2 m-auto calender-icon '></i>
        </div>

        <Flatpickr
          className="form-control d-block"
          placeholder="dd/mm/yy"
          ref={fp}
          onChange={(dates) => {
            dates.length > 1 && setDates(dates);
            dates.length == 0 && clearDates(undefined);
          }}
          options={{
            mode: 'range',
            dateFormat: 'd/m/y',
          }}
        />

        <div className='bg-white d-flex border-none calender-right' onClick={() => { fp.current.flatpickr.clear(); }}>
          <i className='fa fa-sync px-2 m-auto bg-white border-none'></i>
        </div>
      </InputGroup>
    </div>
  );
};

DateComponent.propTypes = {
  setDates: PropTypes.func,
  clearDates: PropTypes.func
}

export default DateComponent
