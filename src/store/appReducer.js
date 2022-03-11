import { combineReducers } from 'redux';
import authReducer from './authentication/reducer';
import myProfileReducer from './myprofile/reducer';

const appReducer = combineReducers({
  auth: authReducer,
  myprofile: myProfileReducer
});

export default appReducer;
