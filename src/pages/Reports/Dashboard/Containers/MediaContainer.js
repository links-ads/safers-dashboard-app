import React, {useState} from 'react';
import PropTypes from 'prop-types'
import { Card, Row, Col } from 'reactstrap';
import MediaComponent from '../../../../components/MediaComponent';
import PaginationWrapper from '../../../../components/Pagination';

const MediaContainer = ({ reportDetail }) => {

  const [pageData, setPageData] = useState([]);

  if(!reportDetail)
    return null;

  return (
    <Row role='in-situ-reports-media'>
      <Col md={12} className='d-flex mt-3'>
        <Card className='card-weather' >
          <Row className='mb-2'>
            <span className='weather-text'>Media Files Attached</span>
          </Row>
          <Row >
            {pageData.map((media, index) => {
              return( 
                <Col key={index} md={3} sm={6} xs={12} className='d-flex dashboard-image justify-content-center'>
                  <MediaComponent media={media}/>
                </Col>)
            })}
          </Row>
          <Row className='text-center'>
            <PaginationWrapper pageSize={8} list={reportDetail.media} setPageData={setPageData} />
          </Row>
        </Card>
      </Col>
    </Row>     
  );
}

MediaContainer.propTypes = {
  reportDetail: PropTypes.object,
}

export default MediaContainer;
