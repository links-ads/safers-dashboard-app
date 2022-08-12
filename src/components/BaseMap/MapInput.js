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
      size="lg"
      id="staticBackdrop"
    >
      <ModalHeader style={{borderColor: 'gray'}} toggle={toggle}>WKT Guidance</ModalHeader>
      <ModalBody>
        <div className='px-3 mb-3'>
          Sample of supporting format of WKT<br/><br/>
          <b>
            POINT (30 10)<br/>
            LINESTRING (30 10, 10 30, 40 40)<br/>
            POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))<br/>
            POLYGON ((35 10, 45 45, 15 40, 10 20, 35 10), (20 30, 35 35, 30 20, 20 30))<br/>
            MULTIPOINT ((10 40), (40 30), (20 20), (30 10))<br/>
            MULTIPOINT (10 40, 40 30, 20 20, 30 10)<br/>
            MULTILINESTRING ((10 10, 20 20, 10 40), (40 40, 30 30, 40 20, 30 10))<br/>
            MULTIPOLYGON (((30 20, 45 40, 10 40, 30 20)), ((15 5, 40 10, 10 20, 5 10, 15 5)))<br/>
            MULTIPOLYGON (((40 40, 20 45, 45 30, 40 40)), ((20 35, 10 30, 10 10, 30 5, 45 20, 20 35), (30 20, 20 15, 20 25, 30 20)))<br/>
            GEOMETRYCOLLECTION (POINT (40 10), LINESTRING (10 10, 20 20, 10 40), POLYGON ((40 40, 20 45, 45 30, 40 40)))
          </b><br /><br />
          For more info , please refer wiki link (<a href='https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry' target='_blank' rel="noreferrer" >https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry</a>)
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