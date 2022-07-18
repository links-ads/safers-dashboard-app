import * as actionTypes from './types';
import { endpoints } from '../../api/endpoints';
import * as api from '../../api/base';

export const getAllMissions = (options) => async (dispatch) => {
  const response = await api.get(endpoints.missions.getMissions, options);
  if (response.status === 200) {
    return dispatch(getMissionsSuccess(response.data));
  }
  else
    return dispatch(getMissionsFail(response.error));
};
const getMissionsSuccess = (alerts) => {
  return {
    type: actionTypes.GET_MISSIONS_SUCCESS,
    payload: alerts
  };
};
const getMissionsFail = (error) => {
  return {
    type: actionTypes.GET_MISSIONS_FAIL,
    payload: error
  };
};

export const setFilterdMissions = (payload) => async (dispatch) => {
  return dispatch(setFilters(payload));
};

const setFilters = (payload) => {
  return {
    type: actionTypes.SET_MISSION_FILTERS,
    payload: payload
  };
}

export const setFavorite = (alertId, isFavorite) => async (dispatch) => {
  const response = await api.post(endpoints.eventAlerts.setFavorite, { alert_id: alertId, is_favorite: isFavorite });
  if (response.status === 200) {
    return dispatch(setFavoriteSuccess(response.data));
  }
  else
    return dispatch(setFavoriteFail(response.error));
};
const setFavoriteSuccess = (msg) => {
  return {
    type: actionTypes.SET_FAV_MISSION_SUCCESS,
    msg,
  };
};
const setFavoriteFail = (error) => {
  return {
    type: actionTypes.SET_FAV_MISSION_FAIL,
    payload: error
  };
}

export const resetMissionResponseState = () => {
  return {
    type: actionTypes.RESET_MISSION_STATE,
  }
};

export const getMissionDetail = (id) => async (dispatch) => {
  const response = await api.get(endpoints.missions.getMissionInfo.replace(':mission_id', id));
  if (response.status === 200) {
    return dispatch(getMissionDetailSuccess(response.data));
  }
  else
    return dispatch(getMissionDetailFail(response.error));
}

const getMissionDetailSuccess = (alerts) => {
  return {
    type: actionTypes.GET_MISSION_DETAIL_SUCCESS,
    payload: alerts
  };
};
const getMissionDetailFail = (error) => {
  return {
    type: actionTypes.GET_MISSION_DETAIL_FAIL,
    payload: error
  };
};
