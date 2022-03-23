import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Row, Col } from 'reactstrap';
import { getInSituMedia } from '../../../store/dashboard/action';
import MediaComponent from '../Components/MediaComponent';



const InSituContainer = () => {
  const dispatch = useDispatch();
  const inSituMedia = useSelector(state => state.dashboard.inSituMedia);

  useEffect(() => {
    dispatch(getInSituMedia())
  }, []);
  return (
    <>
      <Col md={12} className='d-flex'>
        <Card className='card-weather' >
          <Row className='mb-2'>
            <span className='weather-text'>In-situ Photos & Videos</span>
          </Row>
          <Row >
            {inSituMedia.map((media, index) => {
              return( 
                <Col key={index} md={3} sm={6} xs={12} className='d-flex  dashboard-image justify-content-center'>
                  <MediaComponent media={media}/>
                </Col>)
            })}
          </Row>
        </Card>
      </Col>
    </>     
  );
}

export default InSituContainer;
