import React  from 'react';
import { Container, Row, Card } from 'reactstrap';
import EventsPanel from './EventsPanel';
import MapComponent from './Map'

const AOIBar = () => {
    
  return (
    <div className="">
      <Container fluid className="">
        <Card className='px-3'>
          <Row className="gx-2 row-cols-2">
            <Card className="col-7 px-1 py-2" >
              <MapComponent  />
            </Card>
            <div className="col-1" />
            <Container className="col-4">
              <Row className="col-12">
                <EventsPanel />
              </Row>
              <Row className="col-12">
                <Card>
                  <h1>Pin Values panel</h1>
                </Card>                
              </Row>
            </Container>
          </Row>
        </Card>
      </Container>
    </div>
  );
}

export default AOIBar;
