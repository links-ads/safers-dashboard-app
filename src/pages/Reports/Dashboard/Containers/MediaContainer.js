import React from 'react';
import PropTypes from 'prop-types'
import { Card, Row, Col } from 'reactstrap';
import MediaComponent from '../../../../components/MediaComponent';

const MediaContainer = ({ reportDetail }) => {
  if(!reportDetail)
    return null;

  return (
    <>
      <Col md={12} className='d-flex mt-3'>
        <Card className='card-weather' >
          <Row className='mb-2'>
            <span className='weather-text'>Media Files Attached</span>
          </Row>
          <Row >
            {reportDetail.media.map((media, index) => {
              return( 
                <Col key={index} md={3} sm={6} xs={12} className='d-flex dashboard-image justify-content-center'>
                  <MediaComponent media={media}/>
                </Col>)
            })}
          </Row>
        </Card>
      </Col>
    </>     
  );
}

MediaContainer.propTypes = {
  reportDetail: PropTypes.object,
}

export default MediaContainer;
