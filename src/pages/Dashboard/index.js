import React from 'react';
import { Container } from 'reactstrap';
import NotificationsBar from './Components/Notifications';
import AOIBar from './Components/AOIBar';
import PhotoBar from './Components/PhotoBar';
import ReportBar from './Components/ReportBar';

const NewDashboard = () => 
  <div className="page-content">
    <Container fluid className="sign-up-aoi-map-bg">
      <NotificationsBar />
      <AOIBar />
      <PhotoBar />
      <ReportBar />
    </Container>
  </div>

export default NewDashboard;
