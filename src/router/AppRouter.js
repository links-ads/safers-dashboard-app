import React, { PureComponent } from 'react';
import { Route, Routes } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';

import PageOne from '../pages/PageOne';
import PageTwo from '../pages/PageTwo';


class AppRouter extends PureComponent {

  render() {
    return (
      <Routes>
        <Route path="/page1" element=
          {
            <PrivateRoute><PageOne /></PrivateRoute>
          }
        />
        <Route path="/page2" element=
          {
            <PrivateRoute><PageTwo /></PrivateRoute>
          }
        />
      </Routes>
    );
  }
}

export default AppRouter;
