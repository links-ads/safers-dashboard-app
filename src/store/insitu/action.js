import * as actionTypes from './types';
import { endpoints } from '../../api/endpoints';
import * as api from '../../api/base';

export const getAllInSituAlerts = (options) => async (dispatch) => {
  console.log('called ac');
  const response = await api.post(endpoints.eventAlerts.getAll, options);
  if (response.status === 200) {
    return dispatch(getInSitutAlertsSuccess(response.data));
  }
  else
    return dispatch(getInSitutAlertsFail(response.error));
};
const getInSitutAlertsSuccess = (alerts) => {
  return {
    type: actionTypes.GET_INSITU_ALERTS_SUCCESS,
    payload: alerts
  };
};
const getInSitutAlertsFail = (error) => {
  return {
    type: actionTypes.GET_INSITU_ALERTS_FAIL,
    payload: error
  };
};

export const setInSituFavoriteAlert = (alertId, isFavorite) => async (dispatch) => {
  const response = await api.post(endpoints.eventAlerts.setFavorite, { alert_id: alertId, is_favorite: isFavorite });
  if (response.status === 200) {
    return dispatch(setInSituFavoriteAlertSuccess(response.data));
  }
  else
    return dispatch(setInSituFavoriteAlertFail(response.error));
};
const setInSituFavoriteAlertSuccess = (msg) => {
  return {
    type: actionTypes.SET_FAV_INSITU_ALERT_SUCCESS,
    msg,
  };
};
const setInSituFavoriteAlertFail = (error) => {
  return {
    type: actionTypes.SET_FAV_INSITU_ALERT_FAIL,
    payload: error
  };
}

export const resetInSituAlertsResponseState = () => {
  return {
    type: actionTypes.RESET_INSITU_ALERT_STATE,
  }
};

export const setFilterdAlerts = (payload) => {
  return {
    type: actionTypes.SET_INSITU_FILTERED_ALERTS,
    payload,
  };
};
export const setPaginatedAlerts = (payload) => {
  return {
    type: actionTypes.SET_INSITU_PAGINATED_ALERTS,
    payload,
  };
};
export const setCurrentPage = (page) => {
  return {
    type: actionTypes.SET_INSITU_CURRENT_PAGE,
    page,
  };
};
export const setAlertId = (payload) => {
  return {
    type: actionTypes.SET_INSITU_ALERT_ID,
    payload,
  };
};
export const setHoverInfo = (payload) => {
  return {
    type: actionTypes.SET_INSITU_HOVER_INFO,
    payload,
  };
};
export const setIconLayer = (payload) => {
  return {
    type: actionTypes.SET_INSITU_ICON_LAYER,
    payload,
  };
};
export const setMidpoint = (payload) => {
  return {
    type: actionTypes.SET_INSITU_MIDPOINT,
    payload,
  };
};
export const setZoomLevel = (payload) => {
  return {
    type: actionTypes.SET_INSITU_ZOOM_LEVEL,
    payload,
  };
};
export const setSortByDate = (payload) => {
  return {
    type: actionTypes.SET_INSITU_SORT_BY_DATE,
    payload,
  };
};
export const setDateRange = (payload) => {
  return {
    type: actionTypes.SET_INSITU_DATE_RANGE,
    payload,
  };
};
