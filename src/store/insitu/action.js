import queryString from 'query-string';

import * as actionTypes from './types';
import * as api from '../../api/base';
import { endpoints } from '../../api/endpoints';

export const getCameraList = options => async dispatch => {
  const response = await api.get(
    endpoints.insitu.cameraList.concat('?', queryString.stringify(options)),
  );
  if (response.status === 200) {
    return dispatch(getCameraListSuccess(response.data));
  } else return dispatch(getCameraListFail(response.error));
};

const getCameraListSuccess = list => {
  return {
    type: actionTypes.GET_CAMERA_LIST_SUCCESS,
    payload: list,
  };
};
const getCameraListFail = error => {
  return {
    type: actionTypes.GET_CAMERA_LIST_FAIL,
    payload: error,
  };
};

export const getCameraSources = () => async dispatch => {
  const response = await api.get(endpoints.insitu.getSources);
  if (response.status === 200) {
    return dispatch(getCameraSourcesSuccess(response.data));
  } else return dispatch(getCameraSourcesFail(response.error));
};

const getCameraSourcesSuccess = list => {
  return {
    type: actionTypes.GET_CAMERA_SOURCES_SUCCESS,
    payload: list,
  };
};
const getCameraSourcesFail = error => {
  return {
    type: actionTypes.GET_CAMERA_SOURCES_FAIL,
    payload: error,
  };
};

export const getCamera = id => async dispatch => {
  const response = await api.get(endpoints.insitu.cameraList + id + '/');
  if (response.status === 200) {
    return dispatch(getCameraSuccess(response.data));
  } else return dispatch(getCameraFail(response.error));
};

const getCameraSuccess = list => {
  return {
    type: actionTypes.GET_CAMERA_SUCCESS,
    payload: list,
  };
};
const getCameraFail = error => {
  return {
    type: actionTypes.GET_CAMERA_FAIL,
    payload: error,
  };
};

export const getAllInSituAlerts = options => async dispatch => {
  const response = await api.get(endpoints.insitu.getMedia, options);
  if (response.status === 200) {
    return dispatch(getInSituAlertsSuccess(response.data));
  } else return dispatch(getInSituAlertsFail(response.error));
};
const getInSituAlertsSuccess = alerts => {
  return {
    type: actionTypes.GET_INSITU_ALERTS_SUCCESS,
    payload: alerts,
  };
};
const getInSituAlertsFail = error => {
  return {
    type: actionTypes.GET_INSITU_ALERTS_FAIL,
    payload: error,
  };
};

export const setInSituFavoriteAlert =
  (alertId, isFavorite) => async dispatch => {
    const response = await api.post(
      endpoints.insitu.setFavorite.replace(':media_id', alertId),
      { is_favorite: isFavorite },
    );
    if (response.status === 200) {
      const successMessage = `sucessfully ${
        isFavorite ? 'added to' : 'removed from'
      } the favorite list`;
      return dispatch(setInSituFavoriteAlertSuccess(successMessage));
    } else return dispatch(setInSituFavoriteAlertFail(response?.data?.[0]));
  };
const setInSituFavoriteAlertSuccess = msg => {
  return {
    type: actionTypes.SET_FAV_INSITU_ALERT_SUCCESS,
    msg,
  };
};
const setInSituFavoriteAlertFail = error => {
  return {
    type: actionTypes.SET_FAV_INSITU_ALERT_FAIL,
    payload: error,
  };
};

export const resetInSituAlertsResponseState = () => {
  return {
    type: actionTypes.RESET_INSITU_ALERT_STATE,
  };
};

export const setFilteredInSituAlerts = payload => {
  return {
    type: actionTypes.SET_INSITU_FILTERED_ALERTS,
    payload,
  };
};
export const setPaginatedAlerts = payload => {
  return {
    type: actionTypes.SET_INSITU_PAGINATED_ALERTS,
    payload,
  };
};
export const setCurrentPage = page => {
  return {
    type: actionTypes.SET_INSITU_CURRENT_PAGE,
    page,
  };
};
export const setAlertId = payload => {
  return {
    type: actionTypes.SET_INSITU_ALERT_ID,
    payload,
  };
};
export const setHoverInfo = payload => {
  return {
    type: actionTypes.SET_INSITU_HOVER_INFO,
    payload,
  };
};
export const setIconLayer = payload => {
  return {
    type: actionTypes.SET_INSITU_ICON_LAYER,
    payload,
  };
};
export const setMidpoint = payload => {
  return {
    type: actionTypes.SET_INSITU_MIDPOINT,
    payload,
  };
};
export const setZoomLevel = payload => {
  return {
    type: actionTypes.SET_INSITU_ZOOM_LEVEL,
    payload,
  };
};
export const setSortByDate = payload => {
  return {
    type: actionTypes.SET_INSITU_SORT_BY_DATE,
    payload,
  };
};
export const setAlertSource = payload => {
  return {
    type: actionTypes.SET_INSITU_ALERT_SOURCE,
    payload,
  };
};
export const setDateRange = payload => {
  return {
    type: actionTypes.SET_INSITU_DATE_RANGE,
    payload,
  };
};
