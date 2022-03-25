import * as actionTypes from './types';
import { updateObject } from '../utility';

const initialState = {
  allAlerts: [],
  error: false,
};

const alertReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.GET_ALERTS_SUCCESS: return getAlertsSuccess(state, action);
  case actionTypes.GET_ALERTS_FAIL: return getAlertsFail(state, action);
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

export default alertReducer;
