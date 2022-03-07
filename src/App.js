import React from 'react';
import { publicRoutes, privateRoutes } from './routes/allRoutes';
import Authmiddleware from './routes/middleware/Authmiddleware'
import { Routes, Route } from 'react-router-dom';
import './assets/scss/theme.scss'


const App = () => (
  <Routes>
    {publicRoutes.map((route, idx) => (
      <Route key={idx} path={route.path} element={<route.component />} />
    ))}
    {privateRoutes.map((route, idx) => (
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
