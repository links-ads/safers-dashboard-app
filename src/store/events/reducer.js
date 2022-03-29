import * as actionTypes from './types';
import { updateObject } from '../utility';

const initialState = {
  allAlerts: [],
  error: false,
  success: null
};

const eventAlertReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.GET_EVENT_ALERTS_SUCCESS: return getAlertsSuccess(state, action);
  case actionTypes.GET_EVENT_ALERTS_FAIL: return getAlertsFail(state, action);
  case actionTypes.SET_FAV_EVENT_ALERT_SUCCESS: return setFavoriteAlertSuccess(state, action);
  case actionTypes.SET_FAV_EVENT_ALERT_FAIL: return setFavoriteAlertFail(state, action);
  case actionTypes.EVENTS_CREATE_EVENT_ALERT_SUCCESS: return validateAlertSuccess(state, action);
  case actionTypes.EVENTS_CREATE_EVENT_ALERT_FAIL: return validateAlertFail(state, action);
  case actionTypes.EDIT_EVENT_ALERT_INFO_SUCCESS: return editAlertInfoSuccess(state, action);
  case actionTypes.EDIT_EVENT_ALERT_INFO_FAIL: return editAlertInfoFail(state, action);
  case actionTypes.RESET_EVENT_ALERT_STATE: return resetAlertsResponseState(state, action);
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

const setFavoriteAlertSuccess = (state, action) => {
  const updatedState = {
    success: action.msg,
    error: false,
  }
  return updateObject(state, updatedState);
}
const setFavoriteAlertFail = (state) => {
  const updatedState = {
    error: true,
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
const validateAlertFail = (state) => {
  const updatedState = {
    error: true,
  }
  return updateObject(state, updatedState);
}

const editAlertInfoSuccess = (state, action) => {
  const updatedState = {
    success: action.msg,
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

const resetAlertsResponseState = (state) => {
  const updatedState = {
    error: false,
    success: null
  }
  return updateObject(state, updatedState);
}

export default eventAlertReducer;
