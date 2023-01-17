import React  from 'react';
import { Container, Row, Card } from 'reactstrap';
import EventsPanel from './EventsPanel';
import MapComponent from './Map'

const AOIBar = () => 
  <div >
    <Container fluid="true" >
      <Card className="px-3">
        <Row xs={1} sm={1} md={1} lg={2} xl={2} className="p-2 gx-2 row-cols-2">
          <Card className="gx-2" >
            <MapComponent  />
          </Card>
          <Container className="px-4 my-auto container">
            <Row >
              <EventsPanel />
            </Row>
            <Row >
              <Card className="card alert-card-secondary" style={{minHeight: 300}}>
                <div className="alert-title"><p>Pin Values panel</p></div>
                <div><p>To be done</p></div>
              </Card>                
            </Row>
          </Container>
        </Row>
      </Card>
    </Container>
  </div>
;

export default AOIBar;
