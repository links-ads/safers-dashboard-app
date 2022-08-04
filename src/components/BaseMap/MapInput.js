import React, { useState, useEffect } from 'react';
import { Input, Modal } from 'reactstrap';
import PropTypes from 'prop-types'
import { checkWKTFormate } from '../../store/utility';

const MapInput = (props) => {

  const [showError, setShowError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
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
      <i onClick={() => setIsOpen(true)} className={`fa fa-question-circle fa-2x ${showError && props.coordinates != '' ? 'text-danger' : ''}`}></i>
      <div className='error-message'>{showError && props.coordinates != '' && 'Incorrect Format'}</div>
    </div>
    <Modal
      centered
      isOpen={isOpen}
      toggle={() => {
        setIsOpen(!isOpen);
      }}
      id="staticBackdrop"
    >
      <div className='p-5'>
        Follow the standard pattern displayed in the link below.<br />
        <a href='https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry' target='_blank' rel="noreferrer" >https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry</a>
        <br /><br />
        P.S: Currently the map does not support MULTIPOINT and MULTIPOLYGON.
      </div>
    </Modal>
    <style jsx>{`
      .polygon-edit-input {
        position: relative;
      }
      
      .polygon-edit-input i.fa-question-circle {
        position: absolute;
        right: 7.5px;
        top: 10px;
        font-size: 20px;
      }
      .polygon-edit-input textarea {
        border-radius: 0.25rem;
        border-bottom: none;
        resize: none;
        padding-right: 25px;
        padding-bottom: 25px;
      }

      .polygon-edit-input .error-message {
        background-color: white;
        border: 1px solid #6F7070;
        border-top: none;
        border-bottom: none;
        border-right: none;
        border-radius: 0 0 0.25rem 0.25rem;
        height: 21px;
        padding: 0 5px;
        color: red;
        position: absolute;
        width: calc(100% - 16px);
        bottom: 0;
      }
    `}</style>
  </>);
}

MapInput.propTypes = {
  coordinates: PropTypes.any,
  setCoordinates: PropTypes.func
}

export default MapInput;