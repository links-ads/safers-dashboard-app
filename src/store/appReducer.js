import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage/session'; //or session

import alertReducer from './alerts/alerts.slice';
import authReducer from './authentication/authentication.slice';
import commonReducer from './common/common.slice';
import commsReducer from './comms/comms.slice';
import dashboardReducer from './dashboard/dashboard.slice';
import dataLayerReducer from './datalayer/datalayer.slice';
import eventReducer from './events/events.slice';
import inSituAlertReducer from './insitu/insitu.slice';
import mapReducer from './map/map.slice';
import missionReducer from './missions/missions.slice';
import notificationsReducer from './notifications/notifications.slice';
import peopleReducer from './people/people.slice';
import reportReducer from './reports/reports.slice';
import userReducer from './user/user.slice';

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
