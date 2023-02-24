import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import * as Yup from 'yup';

import {
  fetchConfig,
  isLoadingSelector,
  loadingMessageSelector,
  configSelector,
} from 'store/common/common.slice';
import { extendGlobalValidators } from 'Utility/extendGlobalValidators';

import PreLoader from './components/PreLoader';
import { publicRoutes, privateRoutes } from './routes/allRoutes';
import Authmiddleware from './routes/middleware/Authmiddleware';

import './assets/scss/theme.scss';
import 'mapbox-gl/dist/mapbox-gl.css';

const App = () => {
  const isLoading = useSelector(isLoadingSelector);
  const loadingMsg = useSelector(loadingMessageSelector);
  const config = useSelector(configSelector);

  const dispatch = useDispatch();

  // adds all shared custom validator methods to global Yup object
  extendGlobalValidators(Yup);

  useEffect(() => {
    if (!config) {
      dispatch(fetchConfig());
    }
  }, [config, dispatch]);

  return config ? (
    <React.Fragment>
      <PreLoader isLoading={isLoading} loadingMsg={loadingMsg} />
      <Routes>
        {publicRoutes.map(route => (
          <Route
            key={route.path}
            path={route.path}
            element={<route.component />}
          />
        ))}
        {privateRoutes.map(route => (
          <Route
            key={route.path}
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
