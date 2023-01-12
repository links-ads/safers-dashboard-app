import React  from 'react';
import { Container, Row, Card } from 'reactstrap';
import { ReactComponent as Placeholder } from './placeholder.svg'

const TweetBar = () => {
    
  return (
    <div className="">
      <Container fluid className="flex-stretch">
        <Card>
          <p className="align-self-baseline">Latest Tweets</p>
          <Row className="mx-4 gx-2 row-cols-8 flex-wrap">
            {[1,2,3,4,5,6,7,8].map(number=>
              <div key={`photon_${number}`} className="col-3 my-3">
                <Placeholder width="100%" height="120px"/>
              </div>
            )}
          </Row>
        </Card>
      </Container>
    </div>
  );
}

export default TweetBar;
