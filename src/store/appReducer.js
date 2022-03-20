import { combineReducers } from 'redux';
import authReducer from './authentication/reducer';
import userReducer from './user/reducer';
import myProfileReducer from './myprofile/reducer';
import * as actionTypes from './authentication/types';
import commonReducer from './common/reducer';

import storage from 'redux-persist/lib/storage/session';//or session

const appReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  myprofile: myProfileReducer,
  common: commonReducer

});

const rootReducer = (state, action) => {
  if (action.type === actionTypes.SIGN_OUT) {
    storage.removeItem('persist:root')
    // storage.removeItem('persist:otherKey')

    return appReducer(undefined, action);
  }
  return appReducer(state, action);
}
export default rootReducer;
