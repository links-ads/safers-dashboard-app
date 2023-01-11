import React  from 'react';
import { Container, Row, Card } from 'reactstrap';
import EventsPanel from './EventsPanel';
import MapComponent from './Map'

const AOIBar = () => {
    
  return (
    <div className="">
      <Container fluid className="">
        <Card className='px-3'>
          <Row xs={1} sm={1} md={1} lg={2} xl={2} className="p-2 gx-2 row-cols-2">
            <Card className="gx-2" >
              <MapComponent  />
            </Card>
            <Container className="p-2 my-0">
              <Row className="">
                <EventsPanel />
              </Row>
              <Row className="">
                <Card className="">
                  <div className="alert-title"><p>Pin Values panel</p></div>
                  <div><p>To be done</p></div>
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
