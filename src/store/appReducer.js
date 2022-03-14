import { combineReducers } from 'redux';
import authReducer from './authentication/reducer';
import myProfileReducer from './myprofile/reducer';
import commonReducer from './common/reducer';

const appReducer = combineReducers({
  auth: authReducer,
  myprofile: myProfileReducer,
  common: commonReducer
});

export default appReducer;
