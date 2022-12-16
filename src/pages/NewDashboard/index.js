import React, { useEffect }  from 'react';
import { Container } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { getAllEventAlerts } from '../../store/events/action';
import NotificationsBar from './Components/Notifications';
import AOIBar from './Components/AOIBar';
import PhotoBar from './Components/PhotoBar';
import ReportBar from './Components/ReportBar';
import TweetBar from './Components/TweetBar';

const NewDashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllEventAlerts());
  }, []);

  return (
    <div className="page-content">
      <Container fluid className="sign-up-aoi-map-bg">
        <NotificationsBar />
        <AOIBar />
        <PhotoBar />
        <ReportBar />
        <TweetBar />
      </Container>
    </div>
  );
}

export default NewDashboard;
