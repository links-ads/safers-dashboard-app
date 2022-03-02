import { combineReducers } from 'redux';
import authReducer from './authentication/reducer';

const appReducer = combineReducers({
  auth: authReducer,
});

export default appReducer;
