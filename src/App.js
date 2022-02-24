/* eslint-disable react/react-in-jsx-scope */
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import AppRouter from './router/AppRouter';

const App = () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <AppRouter />
    </PersistGate>
  </Provider>
);


export default App;
