import React from 'react';
import { Card, CardHeader, CardBody, CardFooter } from 'reactstrap';

const TweetComponent = () => {
  return (
    <Card>
      <CardHeader>
              Social Engagement
      </CardHeader>
      <CardBody className='mx-auto'>
        <span>20k</span>
      </CardBody>
      <CardFooter className='mx-auto'>
                Total number of tweets
      </CardFooter>
    </Card>
  )
}

export default TweetComponent;