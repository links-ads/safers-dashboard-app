import * as actionTypes from './types';
import { endpoints } from '../../api/endpoints';
import * as api from '../../api/base';

export const getStats = (params) => async (dispatch) => {
  const response = await api.get(endpoints.dashboard.getStats, params);
  if (response.status === 200) {
    return dispatch(getStatsSuccess(response.data));
  }
  else
    return dispatch(getStatsFail(response.error));
};
const getStatsSuccess = (data) => {
  return {
    type: actionTypes.STATS_GET_SUCCESS,
    payload: data
  };
};
const getStatsFail = (error) => {
  return {
    type: actionTypes.STATS_GET_FAIL,
    payload: error
  };
};

export const getWeatherStats = (params) => async (dispatch) => {
  const response = await api.get(endpoints.dashboard.getWeatherStats, params);
  if (response.status === 200) {
    return dispatch(getWeatherStatsSuccess(response.data));
  }
  else
    return dispatch(getWeatherStatsFail(response.error));
};
const getWeatherStatsSuccess = (data) => {
  return {
    type: actionTypes.WEATHER_STATS_GET_SUCCESS,
    payload: data
  };
};
const getWeatherStatsFail = (error) => {
  return {
    type: actionTypes.WEATHER_STATS_GET_FAIL,
    payload: error
  };
};

export const getWeatherVariables = (params) => async (dispatch) => {
  const response = await api.get(endpoints.dashboard.getWeatherVariables, params);
  if (response.status === 200) {
    return dispatch(getWeatherVariablesSuccess(response.data));
  }
  else
    return dispatch(getWeatherVariablesFail(response.error));
};
const getWeatherVariablesSuccess = (data) => {
  return {
    type: actionTypes.WEATHER_VARIABLES_GET_SUCCESS,
    payload: data
  };
};
const getWeatherVariablesFail = (error) => {
  return {
    type: actionTypes.WEATHER_VARIABLES_GET_FAIL,
    payload: error
  };
};

export const getInSituMedia = (params) => async (dispatch) => {
  const response = await api.get(endpoints.dashboard.getInSitu, params);
  if (response.status === 200) {
    return dispatch(getInSituMediaSuccess(response.data));
  }
  else
    return dispatch(getInSituMediaFail(response.error));
};
const getInSituMediaSuccess = (data) => {
  return {
    type: actionTypes.IN_SITU_MEDIA_GET_SUCCESS,
    payload: data
  };
};
const getInSituMediaFail = (error) => {
  return {
    type: actionTypes.IN_SITU_MEDIA_GET_FAIL,
    payload: error
  };
};

export const getTweets = (params) => async (dispatch) => {
  const response = await api.get(endpoints.dashboard.getTweets, params);
  if (response.status === 200) {
    return dispatch(getTweetsSuccess(response.data));
  }
  else
    return dispatch(getTweetsFail(response.error));
};
const getTweetsSuccess = (data) => {
  return {
    type: actionTypes.TWEETS_GET_SUCCESS,
    payload: data
  };
};
const getTweetsFail = (error) => {
  return {
    type: actionTypes.TWEETS_GET_FAIL,
    payload: error
  };
};