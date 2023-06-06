import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Popup } from 'react-map-gl';
import { CardSubtitle, CardText, CardTitle, Col, Row } from 'reactstrap';

import { formatDate } from 'utility';

const Field = ({ label, value }) => (
  <Row className="g-0">
    <Col md={3}>
      <CardText className="mb-2">
        <small className="font-italic">{label}:</small>
      </CardText>
    </Col>
    <Col>
      <CardText className="mb-2">
        <small className="font-italic">{value}</small>
      </CardText>
    </Col>
  </Row>
);

const Tooltip = ({ object, coordinate, t }) => {
  const stringFields = Object.entries(object).reduce(
    (acc, [key, value]) =>
      typeof value === 'string'
        ? [
            ...acc,
            {
              label: key,
              value,
            },
          ]
        : acc,
    [],
  );

  return (
    <Popup
      longitude={coordinate[0]}
      latitude={coordinate[1]}
      offsetTop={-15}
      offsetLeft={15}
      anchor="left"
    >
      <div className="my-2 mx-4 map-tooltip">
        <Row className="mb-2">
          <Col>
            <CardTitle className="mt-0 card-title">{object.title}</CardTitle>
            <CardSubtitle className="font-14 text-muted">
              {formatDate(object.timestamp)}
            </CardSubtitle>
          </Col>
        </Row>
        <Row className="mt-3 px-1 g-0">
          {stringFields.map(({ label, value }) => (
            <Field key={label} label={`${label}`} value={value} />
          ))}
        </Row>
      </div>
    </Popup>
  );
};

Tooltip.propTypes = {
  object: PropTypes.any,
  coordinate: PropTypes.array,
  t: PropTypes.func,
};

export default withTranslation(['common'])(Tooltip);
