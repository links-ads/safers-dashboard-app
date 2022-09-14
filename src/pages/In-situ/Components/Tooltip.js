import React from 'react';
import PropTypes from 'prop-types'
import {
  Col,
  Row
} from 'reactstrap';
import { Popup } from 'react-map-gl';
import { formatDate } from '../../../store/utility';

const Tooltip = ({ object }) => {
  const obj = (object?.objects) ? object.objects : [object.object];
  return (
    <Popup
      longitude={obj[0].geometry.coordinates[0]}
      latitude={obj[0].geometry.coordinates[1]}
      offsetLeft={15}
      dynamicPosition={true}
      anchor='left'
      className="cameras-tooltip"
      style={{ borderRadius: '10px' }}>
      <div>
        {obj.map(({properties: { id, direction, last_update, description }}) => (
          <React.Fragment key={id}>
            <div className='my-2 m-4 map-tooltip'>
              <Row className='mb-2'>
                <Col md={2} className='d-flex g-0 text-white'>
                  <b>Data:</b>
                </Col>
                <Col md={10} className='text-white ms-auto'>
                  <p className='mb-1'>Camera Number: {id}</p>
                  <p className='mb-1'>
                    Camera Location: Lon. {location.longitude}, 
                    Lat. {location.latitude}
                  </p>
                  <p className='mb-1'>Camera Direction: {direction}&#176;</p>
                  <p className='mb-1'>
                    Last Uploaded feed: {last_update ? formatDate(last_update) : '-'}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col md={2} className='d-flex g-0 text-white'>
                  <b>Info:</b>
                </Col>
                <Col md={10}>
                  {description}
                </Col>
              </Row>
            </div>
            {obj.length > 1 ? <hr /> : null}
          </React.Fragment>
        )
        )}
      </div>
    </Popup>
  )
};

Tooltip.propTypes = {
  coordinate: PropTypes.array,
  object: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
}

export default Tooltip;
