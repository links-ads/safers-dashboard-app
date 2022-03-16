import React from 'react';

import 'react-datepicker/dist/react-datepicker.css';

import 'flatpickr/dist/themes/material_blue.css'
import Flatpickr from 'react-flatpickr'
import { FormGroup, InputGroup } from 'reactstrap';

const DateComponent = () => {
//   const [startDate, setStartDate] = useState(new Date());
  return (

    <FormGroup className="mb-4">
      <InputGroup>
        <div className='bg-white d-flex border-none calender-left'>
          <i className='fa fa-calendar px-2 m-auto calender-icon '></i>
        </div>
        
        <Flatpickr
          className="form-control d-block"
          placeholder="dd M,yyyy"
          
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

export default DateComponent