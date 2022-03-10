import { combineReducers } from 'redux';
import authReducer from './authentication/reducer';
import userReducer from './user/reducer';

const appReducer = combineReducers({
  auth: authReducer,
  user: userReducer
});

export default appReducer;
