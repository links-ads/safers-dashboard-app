import React, { useEffect }  from 'react';
import { Container, Row } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { getAllEventAlerts } from '../../../store/events/action';
import NotificationCard from './NotificationCard';

const NotificationsBar = () => {
  const dispatch = useDispatch();
  const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

  useEffect(() => {
    dispatch(getAllEventAlerts());
  }, []);

  return (
    <div className="">
      <Container fluid className="">
        <p className="align-self-baseline alert-title">Hello this is the Notifications Bars</p>
        <Row className="gx-1 row-cols-5">
          <NotificationCard cardName="Fire Alerts" iconClass="bx bx-error-circle" content={ lorem }/>
          <NotificationCard cardName="People" iconClass="fas fa-user-alt" content={ lorem }/>
          <NotificationCard cardName="Reports" iconClass="fas fa-file-image" content={ lorem }/>
          <NotificationCard cardName="Mission" iconClass="fas fa-flag-checkered" content={ lorem }/>
          <NotificationCard cardName="Communications" iconClass="fas fa-envelope" content={ lorem }/>
        </Row>
      </Container>
    </div>
  );
}

export default NotificationsBar;
