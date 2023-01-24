import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';

import PreLoader from './components/PreLoader';
import { publicRoutes, privateRoutes } from './routes/allRoutes';
import Authmiddleware from './routes/middleware/Authmiddleware';
import './assets/scss/theme.scss';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getConfig } from './store/appAction';

const App = () => {
  const { isLoading, loadingMsg, config } = useSelector(state => state.common);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!config) {
      dispatch(getConfig());
    }
  }, [config, dispatch]);

  return config ? (
    <React.Fragment>
      <PreLoader isLoading={isLoading} loadingMsg={loadingMsg} />
      <Routes>
        {publicRoutes.map(route => (
          <Route key={route} path={route.path} element={<route.component />} />
        ))}
        {privateRoutes.map(route => (
          <Route
            key={route}
            path={route.path}
            element={
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
    </React.Fragment>
  ) : null;
};

export default App;
