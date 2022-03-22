import * as actionTypes from './types';
import { updateObject } from '../utility';

const initialState = {
  stats: {},
  weatherStats : {},
  weatherVariables : [],
  inSituMedia: [],
  tweets: []
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.STATS_GET_SUCCESS: return getStatsSuccess(state, action);
  case actionTypes.STATS_GET_FAIL: return getStatsFail(state, action);
  case actionTypes.WEATHER_STATS_GET_SUCCESS: return getWeatherStatsSuccess(state, action);
  case actionTypes.WEATHER_STATS_GET_FAIL: return getWeatherStatsFail(state, action);
  case actionTypes.WEATHER_VARIABLES_GET_SUCCESS: return getWeatherVariablesSuccess(state, action);
  case actionTypes.WEATHER_VARIABLES_GET_FAIL: return getWeatherVariablesFail(state, action);
  case actionTypes.IN_SITU_MEDIA_GET_SUCCESS: return getInSituMediaSuccess(state, action);
  case actionTypes.IN_SITU_MEDIA_GET_FAIL: return getInSituMediaFail(state, action);
  case actionTypes.TWEETS_GET_SUCCESS: return getTweetsSuccess(state, action);
  case actionTypes.TWEETS_GET_FAIL: return getTweetsFail(state, action);
  default:
    return state;
  }
};

const getStatsSuccess = (state, action) => {
  const updatedState = {
    stats: action.payload,
    error: false,
  }
  return updateObject(state, updatedState);
}

const getStatsFail = (state) => {
  const updatedState = {
    error: true,
  }
  return updateObject(state, updatedState);
}

const getWeatherStatsSuccess = (state, action) => {
  const updatedState = {
    weatherStats: action.payload,
    error: false,
  }
  return updateObject(state, updatedState);
}

const getWeatherStatsFail = (state) => {
  const updatedState = {
    error: true,
  }
  return updateObject(state, updatedState);
}

//WEATHER VARIABLES
const getWeatherVariablesSuccess = (state, action) => {
  const updatedState = {
    weatherVariables: action.payload,
    error: false,
  }
  return updateObject(state, updatedState);
}

const getWeatherVariablesFail = (state) => {
  const updatedState = {
    error: true,
  }
  return updateObject(state, updatedState);
}

//IN SITU MEDIA
const getInSituMediaSuccess = (state, action) => {
  const updatedState = {
    inSituMedia: action.payload,
    error: false,
  }
  return updateObject(state, updatedState);
}

const getInSituMediaFail = (state) => {
  const updatedState = {
    error: true,
  }
  return updateObject(state, updatedState);
}

//TWEETS
//IN SITU MEDIA
const getTweetsSuccess = (state, action) => {
  const updatedState = {
    tweets: action.payload,
    error: false,
  }
  return updateObject(state, updatedState);
}

const getTweetsFail = (state) => {
  const updatedState = {
    error: true,
  }
  return updateObject(state, updatedState);
}

export default dashboardReducer;
