import React  from 'react';
import { Container, Row, Card } from 'reactstrap';
import { ReactComponent as Placeholder } from './placeholder.svg'

const TWEET_NUMBERS = [1,2,3,4,5,6,7,8];

const TweetBar = () => 
  <div>
    <Container fluid className="flex-stretch">
      <Card>
        <p className="align-self-baseline">Latest Tweets</p>
        <Row className="mx-4 gx-2 row-cols-8 flex-wrap">
          {TWEET_NUMBERS.map(number=>
            <div key={`tweet_placeholder_${number}`} className="col-3 my-3">
              <Placeholder width="100%" height="120px"/>
            </div>
          )}
        </Row>
      </Card>
    </Container>
  </div>


export default TweetBar;
