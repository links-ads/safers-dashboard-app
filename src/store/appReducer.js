import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage/session'; //or session

import alertReducer from './alerts.slice';
import authReducer from './authentication.slice';
import commonReducer from './common.slice';
import commsReducer from './comms.slice';
import dashboardReducer from './dashboard.slice';
import dataLayerReducer from './datalayer.slice';
import eventReducer from './events.slice';
import inSituAlertReducer from './insitu.slice';
import mapReducer from './map.slice';
import missionReducer from './missions.slice';
import notificationsReducer from './notifications.slice';
import peopleReducer from './people.slice';
import reportReducer from './reports.slice';
import userReducer from './user.slice';

const appReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  common: commonReducer,
  dashboard: dashboardReducer,
  alerts: alertReducer,
  dataLayer: dataLayerReducer,
  eventAlerts: eventReducer,
  inSituAlerts: inSituAlertReducer,
  notifications: notificationsReducer,
  reports: reportReducer,
  comms: commsReducer,
  missions: missionReducer,
  people: peopleReducer,
  map: mapReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'auth/signOut/fulfilled') {
    storage.removeItem('persist:root');

    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};
export default rootReducer;
