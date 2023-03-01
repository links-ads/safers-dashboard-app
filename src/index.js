import React from 'react';

import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import './index.scss';
import { PersistGate } from 'redux-persist/integration/react';
import * as Yup from 'yup';

import { setupInterceptors } from 'api/base';
import { extendGlobalValidators } from 'Utility/extendGlobalValidators';

import App from './App';
import { MapProvider } from './components/BaseMap/MapContext';
import reportWebVitals from './reportWebVitals';
import store, { persistor } from './store';

setupInterceptors(store);

// adds all shared custom validator methods to global Yup object
extendGlobalValidators(Yup);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter>
        <MapProvider>
          <App />
        </MapProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
