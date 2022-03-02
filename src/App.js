import React from 'react';
import { authRoutes, userRoutes } from './routes/allRoutes';
import Authmiddleware from './routes/middleware/Authmiddleware'
import { Routes, Route } from 'react-router-dom';
import './assets/scss/theme.scss'


const App = () => (
  <Routes>
    {authRoutes.map((route, idx) => (
      <Route key={idx} path={route.path} element=
        {
          <Authmiddleware
            path={route.path}
            component={route.component}
            isAuthProtected={false}
            exact
          />
        }
      />
    ))}
    {userRoutes.map((route, idx) => (
      <Route key={idx} path={route.path} element=
        {
          <Authmiddleware
            path={route.path}
            component={route.component}
            isAuthProtected={true}
            exact
          />
        }
      />
    ))}
  </Routes>
);


export default App;
