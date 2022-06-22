import * as actionTypes from './types';
import { endpoints } from '../../api/endpoints';
import * as api from '../../api/base';
import queryString from 'query-string';


export const getSource = () => async (dispatch) => {
  const response = await api.get(endpoints.fireAlerts.source);
  if (response.status === 200) {
    return dispatch(getSourceSuccess(response.data));
  }
  else
    return dispatch(getSourceFail(response.data));
};

const getSourceSuccess = (sources) => {
  return {
    type: actionTypes.GET_ALERT_SOURCE_SUCCESS,
    payload: sources
  };
};
const getSourceFail = (error) => {
  return {
    type: actionTypes.GET_ALERT_SOURCE_FAIL,
    payload: error
  };
};


export const getAllFireAlerts = (options, fromPage) => async (dispatch) => {
  const response = await api.get(endpoints.fireAlerts.getAll.concat('?', queryString.stringify(options)));
  if (response && response?.status === 200) {
    fromPage && dispatch(setFilteredAlerts(response?.data));
    return dispatch(getAlertsSuccess(response.data));
  }
  else
    return dispatch(getAlertsFail(response?.error));
};
const getAlertsSuccess = (alerts) => {
  return {
    type: actionTypes.GET_ALERTS_SUCCESS,
    payload: alerts,
  };
};
export const setFilteredAlerts = (alerts) => {
  return {
    type: actionTypes.SET_FILTERED_ALERTS,
    payload: alerts,
  };
};
const getAlertsFail = (error) => {
  return {
    type: actionTypes.GET_ALERTS_FAIL,
    payload: error
  };
};

export const setFavoriteAlert = (alertId, isFavorite) => async (dispatch) => {
  const response = await api.post(endpoints.fireAlerts.setFavorite.replace(':alert_id', alertId), { is_favorite: isFavorite });
  if (response && response.status === 200) {
    let successMessage = `Successfully ${isFavorite ? 'added to' : 'removed from'} the favorite list`;
    return dispatch(setFavoriteAlertSuccess(successMessage));
  }
  else
    return dispatch(setFavoriteAlertFail(response?.data?.[0]));
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
  const response = await api.post(endpoints.fireAlerts.validate.replace(':alert_id', alertId), { type: 'VALIDATED' });
  if (response.status === 200 || response.status === 201) {
    const successMessage = response.data['detail']
    return dispatch(validateAlertSuccess(successMessage));
  }
  else
    return dispatch(validateAlertFail(response?.data?.[0]));
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
  const response = await api.patch(endpoints.fireAlerts.edit.replace(':alert_id', alertId), { information: desc });
  if (response && response.status === 200) {
    let successMessage = 'Successfully updated the information';
    return dispatch(editAlertInfoSuccess(successMessage));
  }
  else {
    let failureMessage = 'Information update failed';
    return dispatch(editAlertInfoFail(response?.data?.[0] || failureMessage));
  }
};
const editAlertInfoSuccess = (message) => {
  return {
    type: actionTypes.EDIT_ALERT_INFO_SUCCESS,
    message,
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





