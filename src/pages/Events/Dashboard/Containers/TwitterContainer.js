import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, Row, Col } from 'reactstrap';
import PaginationWrapper from '../../../../components/Pagination';
import TweetComponent from '../../../../components/TweetComponent';

const TwitterContainer = () => {
  const tweets = useSelector(state => state.dashboard.tweets);
  const [pageData, setPageData] = useState([]);
  return (
    <>
      <Col  className='d-flex'>
        <Card className='card-weather' >
          <Row className='mb-2'>
            <span className='weather-text'>Latest Tweets</span>
          </Row>
          <Row>
            {pageData.map((tweet, index) => {
              return( 
                <Col key={index} md={6} lg={4} xs={12}>
                  <TweetComponent tweetID={tweet.tweetID}/>
                </Col>
              )
            })}
          </Row>
          <Row className='text-center'>
            <PaginationWrapper pageSize={6} list={tweets} setPageData={setPageData} />
          </Row>
        </Card>
      </Col>
    </>     
  );
}

export default TwitterContainer;
