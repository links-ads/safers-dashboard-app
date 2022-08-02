import React, { useState, useEffect } from 'react';
import { Input } from 'reactstrap';
import PropTypes from 'prop-types'
import { checkWKTFormate } from '../../store/utility';

const MapInput = (props) => {

  const [showError, setShowError] = useState(false);

  useEffect(() => {
    console.log(checkWKTFormate(props.coordinates));
    setShowError(!checkWKTFormate(props.coordinates));
  }, [props.coordinates])

  return (<>
    <div className='polygon-edit-input'>
      <Input
        {...props}
        onChange={
          (e) => {
            props.setCoordinates(e.target.value);
          }
        }
        value={props.coordinates}
      />
      <div className='error-message'>{showError && props.coordinates != '' && 'Error 003'}</div>
    </div>
    <style jsx>{`
      .polygon-edit-input textarea {
        border-radius: 0.25rem 0.25rem 0px 0px;
        border-bottom: none;
        resize: none;
      }

      .polygon-edit-input .error-message {
        background-color: white;
        border: 1px solid #6F7070;
        border-top: none;
        border-radius: 0 0 0.25rem 0.25rem;
        height: 21px;
        padding: 0 5px;
        color: red;
      }
    `}</style>
  </>);
}

MapInput.propTypes = {
  coordinates: PropTypes.any,
  setCoordinates: PropTypes.func
}

export default MapInput;