import * as actionTypes from './types';
import { updateObject } from '../utility';

const initialState = {
  sources: [],
  allAlerts: [],
  filteredAlerts: [],
  params: {
    order: '-date',
    default_bbox: true,
    default_date: true
  },
  isNewAlert: false,
  isPageActive: false,
  newItemsCount: 0,
  error: null,
  success: null
};

const alertReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.GET_ALERTS_SUCCESS: return getAlertsSuccess(state, action);
  case actionTypes.GET_ALERTS_FAIL: return getAlertsFail(state, action);
  case actionTypes.SET_FILTERED_ALERTS: return setFilteredAlerts(state, action);
  case actionTypes.SET_FAV_ALERT_SUCCESS: return setFavoriteAlertSuccess(state, action);
  case actionTypes.SET_FAV_ALERT_FAIL: return setFavoriteAlertFail(state, action);
  case actionTypes.CREATE_EVENT_ALERT_SUCCESS: return validateAlertSuccess(state, action);
  case actionTypes.CREATE_EVENT_ALERT_FAIL: return validateAlertFail(state, action);
  case actionTypes.EDIT_ALERT_INFO_SUCCESS: return editAlertInfoSuccess(state, action);
  case actionTypes.EDIT_ALERT_INFO_FAIL: return editAlertInfoFail(state, action);
  case actionTypes.SET_ALERT_API_PARAMS: return setAlertApiParams(state, action);
  case actionTypes.SET_NEW_ALERT_STATE: return setNewAlertState(state, action);
  case actionTypes.GET_ALERT_SOURCE_SUCCESS: return getAlertSourceSuccess(state, action);
  case actionTypes.GET_ALERT_SOURCE_FAIL: return getAlertSourceFail(state, action);
  case actionTypes.RESET_ALERT_STATE: return resetAlertsResponseState(state, action);
  default:
    return state;
  }
};

const getAlertsSuccess = (state, action) => {
  const updatedState = {
    allAlerts: action.payload,
    error: false,
  }
  return updateObject(state, updatedState);
}
const getAlertsFail = (state) => {
  const updatedState = {
    error: true,
  }
  return updateObject(state, updatedState);
}
const setFilteredAlerts = (state, action) => {
  const updatedState = {
    filteredAlerts: action.payload,
  }
  return updateObject(state, updatedState);
}

const setFavoriteAlertSuccess = (state, action) => {
  const updatedState = {
    success: action.msg,
    error: false,
  }
  return updateObject(state, updatedState);
}
const setFavoriteAlertFail = (state, action) => {
  const updatedState = {
    error: action.payload,
  }
  return updateObject(state, updatedState);
}

const validateAlertSuccess = (state, action) => {
  const updatedState = {
    success: action.msg,
    error: false,
  }
  return updateObject(state, updatedState);
}
const validateAlertFail = (state, action) => {
  const updatedState = {
    error: action.payload,
  }
  return updateObject(state, updatedState);
}

const editAlertInfoSuccess = (state, action) => {
  const updatedState = {
    success: action.message,
    error: false,
  }
  return updateObject(state, updatedState);
}
const editAlertInfoFail = (state) => {
  const updatedState = {
    error: true,
  }
  return updateObject(state, updatedState);
}

export const setAlertApiParams = (state, action) => {
  const updatedState = {
    params: action.payload ? action.payload : initialState.params
  }
  return updateObject(state, updatedState);
};

const resetAlertsResponseState = (state) => {
  const updatedState = {
    error: false,
    success: null
  }
  return updateObject(state, updatedState);
}

const setNewAlertState = (state, action) => {
  const updatedState = {
    isNewAlert: action.isNewAlert,
    isPageActive: action.isPageActive,
    newItemsCount: action.newItemsCount
  }
  return updateObject(state, updatedState);
}

const getAlertSourceSuccess = (state, action) => {
  const updatedState = {
    sources: action.payload,
    error: false,
  }
  return updateObject(state, updatedState);
}
const getAlertSourceFail = (state) => {
  const updatedState = {
    error: true,
  }
  return updateObject(state, updatedState);
}


export default alertReducer;
