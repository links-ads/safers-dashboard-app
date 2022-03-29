import * as actionTypes from './types';
import { endpoints } from '../../api/endpoints';
import * as api from '../../api/base';

export const getAllEventAlerts = (options) => async (dispatch) => {
  const response = await api.post(endpoints.fireAlerts.getAll, options);
  if (response.status === 200) {
    return dispatch(getEventAlertsSuccess(response.data));
  }
  else
    return dispatch(getEventAlertsFail(response.error));
};
const getEventAlertsSuccess = (alerts) => {
  return {
    type: actionTypes.GET_EVENT_ALERTS_SUCCESS,
    payload: alerts
  };
};
const getEventAlertsFail = (error) => {
  return {
    type: actionTypes.GET_EVENT_ALERTS_FAIL,
    payload: error
  };
};

export const setEventFavoriteAlert = (alertId, isFavorite) => async (dispatch) => {
  const response = await api.post(endpoints.fireAlerts.setFavorite, { alert_id: alertId, is_favorite: isFavorite });
  if (response.status === 200) {
    return dispatch(setEventFavoriteAlertSuccess(response.data));
  }
  else
    return dispatch(setEventFavoriteAlertFail(response.error));
};
const setEventFavoriteAlertSuccess = (msg) => {
  return {
    type: actionTypes.SET_FAV_EVENT_ALERT_SUCCESS,
    msg,
  };
};
const setEventFavoriteAlertFail = (error) => {
  return {
    type: actionTypes.SET_FAV_EVENT_ALERT_FAIL,
    payload: error
  };
}

export const validateEventAlert = (alertId) => async (dispatch) => {
  const response = await api.post(endpoints.fireAlerts.validate, { alert_id: alertId });
  if (response.status === 200) {
    return dispatch(validateEventAlertSuccess(response.data));
  }
  else
    return dispatch(validateEventAlertFail(response.error));
};
const validateEventAlertSuccess = (msg) => {
  return {
    type: actionTypes.EVENTS_CREATE_EVENT_ALERT_FAIL,
    msg,
  };
};
const validateEventAlertFail = (error) => {
  return {
    type: actionTypes.EVENTS_CREATE_EVENT_ALERT_FAIL,
    payload: error
  };
};

export const editEventAlertInfo = (alertId, desc) => async (dispatch) => {
  const response = await api.patch(endpoints.fireAlerts.edit, { alert_id: alertId, description: desc });
  if (response.status === 200) {
    return dispatch(editEventAlertInfoSuccess(response.data));
  }
  else
    return dispatch(editEventAlertInfoFail(response.error));
};
const editEventAlertInfoSuccess = (msg) => {
  return {
    type: actionTypes.EDIT_EVENT_ALERT_INFO_SUCCESS,
    msg,
  };
};
const editEventAlertInfoFail = (error) => {
  return {
    type: actionTypes.EDIT_EVENT_ALERT_INFO_FAIL,
    payload: error
  };
};

export const resetEventAlertsResponseState = () => {
  return {
    type: actionTypes.RESET_EVENT_ALERT_STATE,
  }
};





