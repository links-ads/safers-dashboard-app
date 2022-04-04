import { createStore, compose, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';//or session
import thunk from 'redux-thunk';

import reducers from './appReducer';
// import logger from './middleware/logger';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'user'],
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistedReducer = persistReducer(persistConfig, reducers);

const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export const persistor = persistStore(store);

export default store;
