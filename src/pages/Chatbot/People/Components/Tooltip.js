import React from 'react';

import PropTypes from 'prop-types';
import { Popup } from 'react-map-gl';
import { Col, Row } from 'reactstrap';

import { formatDate } from '../../../../store/utility';

const Tooltip = ({ object, coordinate }) => {
  return (
    <Popup
      longitude={coordinate[0]}
      latitude={coordinate[1]}
      offsetTop={15}
      dynamicPosition={true}
      anchor="top-left"
      style={{ borderRadius: '10px' }}
    >
      <div className="my-2 mx-4 map-tooltip">
        <Row className="mb-2">
          <Col md={11} className="text-white ms-auto">
            <p className="mb-1">Camera Number: {object.sourceInfo.camNo} </p>
            <p className="mb-1">
              Camara Location: {object.sourceInfo.camLocation}
            </p>
            <p className="mb-1">
              Last Uploaded feed:{' '}
              {formatDate(object.sourceInfo.lastUploadedFeed)}
            </p>
          </Col>
        </Row>
        <Row>
          <Col md={1} className="d-flex g-0 text-white">
            <b>Info:</b>
          </Col>
          <Col md={11}>{object.sourceInfo.desc}</Col>
        </Row>
      </div>
    </Popup>
  );
};

Tooltip.propTypes = {
  object: PropTypes.any,
  coordinate: PropTypes.array,
};

export default Tooltip;
