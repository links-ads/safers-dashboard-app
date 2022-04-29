import * as actionTypes from './types';
import { endpoints } from '../../api/endpoints';
import * as api from '../../api/base';

export const getAllFireAlerts = (options) => async (dispatch) => {
  const response = await api.post(endpoints.fireAlerts.getAll, options);
  if (response.status === 200) {
    return dispatch(getAlertsSuccess(response.data));
  }
  else
    return dispatch(getAlertsFail(response.error));
};
const getAlertsSuccess = (alerts) => {
  return {
    type: actionTypes.GET_ALERTS_SUCCESS,
    payload: alerts
  };
};
const getAlertsFail = (error) => {
  return {
    type: actionTypes.GET_ALERTS_FAIL,
    payload: error
  };
};

export const setFavoriteAlert = (alertId, isFavorite) => async (dispatch) => {
  const response = await api.post(endpoints.fireAlerts.setFavorite, { alert_id: alertId, is_favorite: isFavorite });
  if (response.status === 200) {
    return dispatch(setFavoriteAlertSuccess(response.data));
  }
  else
    return dispatch(setFavoriteAlertFail(response.error));
};
const setFavoriteAlertSuccess = (msg) => {
  return {
    type: actionTypes.SET_FAV_ALERT_SUCCESS,
    msg,
  };
};
const setFavoriteAlertFail = (error) => {
  return {
    type: actionTypes.SET_FAV_ALERT_FAIL,
    payload: error
  };
}

export const validateAlert = (alertId) => async (dispatch) => {
  const response = await api.post(endpoints.fireAlerts.validate, { alert_id: alertId });
  if (response.status === 200) {
    return dispatch(validateAlertSuccess(response.data));
  }
  else
    return dispatch(validateAlertFail(response.error));
};
const validateAlertSuccess = (msg) => {
  return {
    type: actionTypes.CREATE_EVENT_ALERT_SUCCESS,
    msg,
  };
};
const validateAlertFail = (error) => {
  return {
    type: actionTypes.CREATE_EVENT_ALERT_FAIL,
    payload: error
  };
};

export const editAlertInfo = (alertId, desc) => async (dispatch) => {
  const response = await api.patch(endpoints.fireAlerts.edit, { alert_id: alertId, description: desc });
  if (response.status === 200) {
    return dispatch(editAlertInfoSuccess(response.data));
  }
  else
    return dispatch(editAlertInfoFail(response.error));
};
const editAlertInfoSuccess = (msg) => {
  return {
    type: actionTypes.EDIT_ALERT_INFO_SUCCESS,
    msg,
  };
};
const editAlertInfoFail = (error) => {
  return {
    type: actionTypes.EDIT_ALERT_INFO_FAIL,
    payload: error
  };
};

export const resetAlertsResponseState = () => {
  return {
    type: actionTypes.RESET_ALERT_STATE,
  }
};

export const setAlertApiParams = (params) => {
  return {
    type: actionTypes.SET_ALERT_API_PARAMS,
    payload: params
  }
};

export const setNewAlertState = (alertState, pageState, newItemsCount) => {
  return {
    type: actionTypes.SET_NEW_ALERT_STATE,
    isNewAlert: alertState,
    isPageActive: pageState,
    newItemsCount
  }
};





