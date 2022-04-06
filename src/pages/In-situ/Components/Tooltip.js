import React from 'react';
import PropTypes from 'prop-types'
import {
  Col,
  Row
} from 'reactstrap';
import { Popup } from 'react-map-gl';

const Tooltip = ({ coordinate, }) => {
  return (
    <Popup
      longitude={coordinate[0]}
      latitude={coordinate[1]}
      offsetTop={15}
      dynamicPosition={true}
      anchor='top-left'
      style={{ borderRadius: '10px' }}
    >

      <div className='my-2 mx-4 map-tooltip'>
        <Row className='mb-2'>
          <Col md={11} className='text-white ms-auto'>
            <p className='mb-1'>Camera Number: 4170 </p>
            <p className='mb-1'>Camara Location: Lat. 1234 Long. 1234</p>
            <p className='mb-1'>Last Uploaded feed: 2022 - 04 -22 20:47</p>
          </Col>
        </Row>
        <Row>
          <Col md={1} className='d-flex g-0 text-white'>
            <b>Info:</b>
          </Col>
          <Col md={11}>
            Lorem posam
          </Col>
        </Row>
      </div>
    </Popup >
  )
}

Tooltip.propTypes = {
  object: PropTypes.any,
  coordinate: PropTypes.array,
  isEdit: PropTypes.bool,
  setFavorite: PropTypes.func,
}

export default Tooltip;
