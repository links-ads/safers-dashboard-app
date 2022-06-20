import * as actionTypes from './types';
import { updateObject } from '../utility';

const initialState = {
  allAlerts: [],
  event: {},
  paginatedAlerts: [],
  filteredAlerts: [],
  midPoint: [],
  zoomLevel: undefined,
  iconLayer: undefined,
  alertId: null,
  hoverInfo: undefined,
  currentPage: 1,
  error: false,
  updateError: null,
  success: null,
  params: {
    order: '-date',
    default_bbox: true,
    default_date: true
  },
  isNewEvent: false,
  isPageActive: false,
  newItemsCount: 0,
  inSituMedia: [],
  tweets: []
};

const eventAlertReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.GET_EVENT_ALERTS_SUCCESS: return getAlertsSuccess(state, action);
  case actionTypes.GET_EVENT_ALERTS_FAIL: return getAlertsFail(state, action);
  case actionTypes.GET_EVENT_SUCCESS: return getEventAlertSuccess(state, action);
  case actionTypes.GET_EVENT_FAIL: return getEventAlertFail(state, action);
  case actionTypes.SET_FAV_EVENT_ALERT_SUCCESS: return setFavoriteAlertSuccess(state, action);
  case actionTypes.SET_FAV_EVENT_ALERT_FAIL: return setFavoriteAlertFail(state, action);
  case actionTypes.EVENTS_CREATE_EVENT_ALERT_SUCCESS: return validateAlertSuccess(state, action);
  case actionTypes.EVENTS_CREATE_EVENT_ALERT_FAIL: return validateAlertFail(state, action);
  case actionTypes.EDIT_EVENT_ALERT_INFO_SUCCESS: return editAlertInfoSuccess(state, action);
  case actionTypes.EDIT_EVENT_ALERT_INFO_FAIL: return editAlertInfoFail(state, action);
  case actionTypes.RESET_EVENT_ALERT_STATE: return resetAlertsResponseState(state, action);
  case actionTypes.SET_NEW_EVENT_STATE: return setNewEventState(state, action);
  case actionTypes.SET_EVENT_PARAMS: return setEventParams(state, action);
  case actionTypes.EVENTS_IN_SITU_MEDIA_GET_SUCCESS: return getInSituMediaSuccess(state, action);
  case actionTypes.EVENTS_IN_SITU_MEDIA_GET_FAIL: return getInSituMediaFail(state, action);
  case actionTypes.EVENTS_TWEETS_GET_SUCCESS: return getTweetsSuccess(state, action);
  case actionTypes.EVENTS_TWEETS_GET_FAIL: return getTweetsFail(state, action);

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

const getEventAlertSuccess = (state, action) => {
  const updatedState = {
    event: action.payload,
    error: false,
  }
  return updateObject(state, updatedState);
}
const getEventAlertFail = (state) => {
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
const setFavoriteAlertFail = (state, action) => {
  const updatedState = {
    error: action.payload
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
    event: action.payload,
    error: false,
  }
  return updateObject(state, updatedState);
}
const editAlertInfoFail = (state, action) => {
  const updatedState = {
    error: true,
    updateError: action.payload
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

export const setEventParams = (state, action) => {
  const updatedState = {
    params: action.payload ? action.payload : initialState.params
  }
  return updateObject(state, updatedState);
};

const setNewEventState = (state, action) => {
  const updatedState = {
    isNewEvent: action.isNewEvent,
    isPageActive: action.isPageActive,
    newItemsCount: action.newItemsCount
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

export default eventAlertReducer;
