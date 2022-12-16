import React  from 'react';
import { Container, Row, Card } from 'reactstrap';
import { ReactComponent as Placeholder } from './placeholder.svg'

const AOIBar = () => {
    
  return (
    <div className="">
      <Container fluid className="">
        <Card className='px-3'>
          <Row className="gx-2 row-cols-2">
            <Card className="col-7">
              <Placeholder width="100%"/>
            </Card>
            <div className="col-1" />
            <Card className="col-4">Events and Pin Values</Card>
          </Row>
        </Card>
      </Container>
    </div>
  );
}

export default AOIBar;
