import * as actionTypes from './types';
import { getDefaultDateRange, updateObject } from '../utility';

const initialState = {
  allNotifications: [],
  sources: [],
  dateRange: getDefaultDateRange(),
  error: false,
  success: null,
  params: {
    order: '-date',
    default_bbox: true,
    default_date: false
  },
  isNewNotification: false,
  isPageActive: false,
  newItemsCount: 0,
};

const notificationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_NOTIFICATIONS_SUCCESS: return getNotificationSuccess(state, action);
    case actionTypes.GET_NOTIFICATIONS_FAIL: return getNotificationsFail(state, action);
    case actionTypes.RESET_NOTIFICATION_API_PARAMS: return resetNotificationApiParams(state, action);
    case actionTypes.SET_NEW_NOTIFICATION_STATE: return setNewNotificationState(state, action);
    case actionTypes.SET_NOTIFICATION_PARAMS: return setNotificationParams(state, action);
    case actionTypes.GET_NOTIFICATION_SOURCES_SUCCESS: return getNotificationSourcesSuccess(state, action);
    case actionTypes.GET_NOTIFICATIONS_SOURCES_FAIL: return getNotificationSourcesFail(state, action);
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
const setNotificationParams = (state, action) => {
  const updatedState = {
    params: action.payload ? action.payload : initialState.params,
  }
  return updateObject(state, updatedState);
}

const resetNotificationApiParams = (state) => {
  const updatedState = {
    params: initialState.params,
  }
  return updateObject(state, updatedState);
}

const setNewNotificationState = (state, action) => {
  const updatedState = {
    isNewNotification: action.isNewNotification,
    isPageActive: action.isPageActive,
    newItemsCount: action.newItemsCount
  }
  return updateObject(state, updatedState);
}
const getNotificationSourcesSuccess = (state, action) => {
  const updatedState = {
    sources: action.payload,
    error: false,
  }
  return updateObject(state, updatedState);
}
const getNotificationSourcesFail = (state) => {
  const updatedState = {
    error: true,
  }
  return updateObject(state, updatedState);
}
export default notificationsReducer;
