import React, { useEffect }  from 'react';
import { Container, Row  } from 'reactstrap';
import InSituContainer from './Containers/InSituContainer';
import InfoContainer from './Containers/InfoContainer';
import { useDispatch } from 'react-redux';
import { getAllEventAlerts } from '../../../store/events/action';

const ReportsDashboard = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllEventAlerts(
      
    ));
  }, []);

  return (
    <div className="page-content">
      <Container fluid >

        <Row>
          <InfoContainer/>
        </Row>
      
        <Row>
          <InSituContainer/>
        </Row>

      </Container>
    </div>
  );
}

export default ReportsDashboard;
