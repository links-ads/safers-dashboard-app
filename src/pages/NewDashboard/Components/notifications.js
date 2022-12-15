import React, { useEffect }  from 'react';
import { Container } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { getAllEventAlerts } from '../../../store/events/action';

const NotificationsBar = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllEventAlerts());
  }, []);

  return (
    <div className="">
      <Container fluid className="">
        <p className="align-self-baseline alert-title">Hello this is the Notifications Bars</p>
      </Container>
    </div>
  );
}

export default NotificationsBar;
