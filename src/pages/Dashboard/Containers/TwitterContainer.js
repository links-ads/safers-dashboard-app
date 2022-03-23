import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Row, Col } from 'reactstrap';
import { getTweets } from '../../../store/dashboard/action';
import TweetComponent from '../Components/TweetComponent';



const TwitterContainer = () => {
  const dispatch = useDispatch();
  const tweets = useSelector(state => state.dashboard.tweets);
  
  useEffect(() => {
    dispatch(getTweets())
  }, []);
  return (
    <>
      <Col  className='d-flex'>
        <Card className='card-weather' >
          <Row className='mb-2'>
            <span className='weather-text'>Latest Tweets</span>
          </Row>
          <Row>
            {tweets.map((tweet, index) => {
              return( 
                <Col key={index} md={6} lg={4} xs={12}>
                  <TweetComponent tweetID={tweet.tweetID}/>
                </Col>
              )
            })}
          </Row>
        </Card>
      </Col>
    </>     
  );
}

export default TwitterContainer;
