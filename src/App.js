import React, { useEffect } from 'react';
import { publicRoutes, privateRoutes } from './routes/allRoutes';
import Authmiddleware from './routes/middleware/Authmiddleware';
import { Routes, Route } from 'react-router-dom';
import './assets/scss/theme.scss';
import 'mapbox-gl/dist/mapbox-gl.css';
import PreLoader from './components/PreLoader';
import { useDispatch, useSelector } from 'react-redux';
import { getConfig } from './store/appAction';

const App = () => {
  const { isLoading, loadingMsg, config } = useSelector(state => state.common);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!config)
      dispatch(getConfig());
  }, []);

  return (
    <React.Fragment>
      <PreLoader isLoading={isLoading} loadingMsg={loadingMsg} />
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
    </React.Fragment>)
};


export default App;
