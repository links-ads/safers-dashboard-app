import React, { useEffect }  from 'react';
import { Container } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { getAllEventAlerts } from '../../store/events/action';
import NotificationsBar from './Components/Notifications';

const NewDashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllEventAlerts());
  }, []);

  return (
    <div className="page-content">
      <Container fluid className="sign-up-aoi-map-bg">
        <p className="alert-title">General Dashboard</p>
        <NotificationsBar />
      </Container>
    </div>
  );
}

export default NewDashboard;
