import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage/session'; //or session

import alertReducer from './alerts/reducer';
import authReducer from './authentication/reducer';
import * as actionTypes from './authentication/types';
import commonReducer from './common/reducer';
import commsReducer from './comms/comms.slice';
import dashboardReducer from './dashboard/reducer';
import dataLayerReducer from './datalayer/reducer';
import eventAlertReducer from './events/reducer';
import inSituAlertReducer from './insitu/reducer';
import mapReducer from './map/map.slice';
import missionReducer from './missions/reducer';
import notificationsReducer from './notifications/reducer';
import peopleReducer from './people/reducer';
import reportReducer from './reports/reports.slice';
import userReducer from './user/reducer';

const appReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  common: commonReducer,
  dashboard: dashboardReducer,
  alerts: alertReducer,
  dataLayer: dataLayerReducer,
  eventAlerts: eventAlertReducer,
  inSituAlerts: inSituAlertReducer,
  notifications: notificationsReducer,
  reports: reportReducer,
  comms: commsReducer,
  missions: missionReducer,
  people: peopleReducer,
  map: mapReducer,
});

const rootReducer = (state, action) => {
  if (action.type === actionTypes.SIGN_OUT) {
    storage.removeItem('persist:root');

    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};
export default rootReducer;
