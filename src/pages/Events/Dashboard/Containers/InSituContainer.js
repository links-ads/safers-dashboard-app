import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, Row, Col } from 'reactstrap';
import MediaComponent from '../../../../components/MediaComponent';
import PaginationWrapper from '../../../../components/Pagination';

const InSituContainer = () => {
  const inSituMedia = useSelector(state => state.dashboard.inSituMedia);
  const [pageData, setPageData] = useState([]);
  return (
    <Row role='in-situ-container'>
      <Col md={12} className='d-flex'>
        <Card className='card-weather' >
          <Row className='mb-2'>
            <span className='weather-text'>In-situ Photos & Videos</span>
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
            <PaginationWrapper pageSize={8} list={inSituMedia} setPageData={setPageData} />
          </Row>
        </Card>
      </Col>
    </Row>     
  );
}

export default InSituContainer;
