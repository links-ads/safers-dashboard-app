import * as actionTypes from './types';
import { getDefaultDateRange, updateObject } from '../utility';

const initialState = {
  allNotifications: [],
  dateRange : getDefaultDateRange(),
  error: false,
  success: null
};

const notificationsReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.GET_NOTIFICATIONS_SUCCESS: return getNotificationSuccess(state, action);
  case actionTypes.GET_NOTIFICATIONS_FAIL: return getNotificationsFail(state, action);
  default:
    return state;
  }
};

const getNotificationSuccess = (state, action) => {
  const updatedState = {
    allNotifications: action.payload,
    error: false,
  }
  return updateObject(state, updatedState);
}
const getNotificationsFail = (state) => {
  const updatedState = {
    error: true,
  }
  return updateObject(state, updatedState);
}

export default notificationsReducer;
