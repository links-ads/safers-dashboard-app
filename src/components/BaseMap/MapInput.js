import React, { useState, useEffect } from 'react';
import { Input, Modal, ModalHeader, ModalBody } from 'reactstrap';
import PropTypes from 'prop-types'
import { checkWKTFormate } from '../../store/utility';

const MapInput = (props) => {

  const [showError, setShowError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

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
      toggle={toggle}
      id="staticBackdrop"
    >
      <ModalHeader style={{borderColor: 'gray'}} toggle={toggle}>WKT Guidance</ModalHeader>
      <ModalBody>
        <div className='px-3 mb-3'>
          Sample of supporting format of WKT<br/><br/>
          <b>POINT (1 2)<br />
          POINT (1 2 3)<br />
          LINESTRING (100 0, 101 1)<br />
          POLYGON ((1 2, 3 4, 0 5, 1 2))<br />
          POLYGON ((20.3 28.6, 20.3 19.6, 8.5 19.6, 8.5 28.6, 20.3 28.6))</b><br />
          <br /><br />
          P.S: Currently the map does not support MULTIPOINT and MULTIPOLYGON.
        </div>
      </ModalBody>
    </Modal>
  </>);
}

MapInput.propTypes = {
  coordinates: PropTypes.any,
  setCoordinates: PropTypes.func
}

export default MapInput;