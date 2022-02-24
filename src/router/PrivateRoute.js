/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Container } from 'reactstrap';
import TopNavigation from '../components/TopNav';
import LeftNavigation from '../components/LeftNav';

const PrivateRoute = ({ children }) => {
  const [sidebarIsOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!sidebarIsOpen);

  return (
    <div className="App wrapper">
      <LeftNavigation toggle={toggleSidebar} isOpen={sidebarIsOpen} />
      <Container>
        <TopNavigation toggleSidebar={toggleSidebar} sidebarIsOpen={sidebarIsOpen} />
        {children}
      </Container>
    </div>
  );
};

export default PrivateRoute;
