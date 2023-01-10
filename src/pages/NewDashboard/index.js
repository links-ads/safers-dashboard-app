import React from 'react';
import { Container } from 'reactstrap';
import NotificationsBar from './Components/Notifications';
import AOIBar from './Components/AOIBar';
import PhotoBar from './Components/PhotoBar';
import ReportBar from './Components/ReportBar';
// import TweetBar from './Components/TweetBar'; -- out of scope

const NewDashboard = () => {

  return (
    <div className="page-content">
      <Container fluid className="sign-up-aoi-map-bg">
        <NotificationsBar />
        <AOIBar />
        <PhotoBar />
        <ReportBar />
        {/* <TweetBar /> -- out of scope for now */}
      </Container>
    </div>
  );
}

export default NewDashboard;
