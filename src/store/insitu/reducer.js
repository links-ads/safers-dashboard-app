import * as actionTypes from './types';
import { getDefaultDateRange, updateObject } from '../utility';

const initialState = {
  allAlerts: [],
  paginatedAlerts: [],
  filteredAlerts: [],
  midPoint: [],
  zoomLevel: undefined,
  iconLayer: undefined,
  alertId : null,
  hoverInfo: undefined,
  sortByDate: 'desc',
  alertSource: 'all',
  dateRange : getDefaultDateRange(),
  currentPage: 1,
  error: false,
  success: null
};

const inSituAlertReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.GET_INSITU_ALERTS_SUCCESS: return getAlertsSuccess(state, action);
  case actionTypes.GET_INSITU_ALERTS_FAIL: return getAlertsFail(state, action);
  case actionTypes.SET_FAV_INSITU_ALERT_SUCCESS: return setFavoriteAlertSuccess(state, action);
  case actionTypes.SET_FAV_INSITU_ALERT_FAIL: return setFavoriteAlertFail(state, action);
  case actionTypes.RESET_INSITU_ALERT_STATE: return resetAlertsResponseState(state, action);
  case actionTypes.SET_INSITU_FILTERED_ALERTS: return setFilteredAlerts(state, action);
  case actionTypes.SET_INSITU_PAGINATED_ALERTS: return setPaginatedAlerts(state, action);
  case actionTypes.SET_INSITU_CURRENT_PAGE: return setCurrentPage(state, action);
  case actionTypes.SET_INSITU_ALERT_ID: return setAlertId(state, action);
  case actionTypes.SET_INSITU_ICON_LAYER: return setIconLayer(state, action);
  case actionTypes.SET_INSITU_HOVER_INFO: return setHoverInfo(state, action);
  case actionTypes.SET_INSITU_MIDPOINT: return setMidpoint(state, action);
  case actionTypes.SET_INSITU_ZOOM_LEVEL: return setZoomLevel(state, action);
  case actionTypes.SET_INSITU_SORT_BY_DATE: return setSortByDate(state, action);
  case actionTypes.SET_INSITU_ALERT_SOURCE: return setAlertSource(state, action);
  case actionTypes.SET_INSITU_DATE_RANGE: return setDateRange(state, action);
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

const setFavoriteAlertSuccess = (state, action) => {
  const updatedState = {
    success: action.msg,
    error: false,
  }
  return updateObject(state, updatedState);
}
const setFavoriteAlertFail = (state) => {
  const updatedState = {
    error: true,
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

const setFilteredAlerts = (state, action) => {
  const updatedState = {
    filteredAlerts: action.payload,
  }
  return updateObject(state, updatedState);
}
const setPaginatedAlerts = (state, action) => {
  const updatedState = {
    paginatedAlerts: action.payload,
  }
  return updateObject(state, updatedState);
}
const setCurrentPage = (state, action) => {
  const updatedState = {
    currentPage: action.payload,
  }
  return updateObject(state, updatedState);
}
const setIconLayer = (state, action) => {
  const updatedState = {
    iconLayer: action.payload,
  }
  return updateObject(state, updatedState);
}
const setHoverInfo = (state, action) => {
  const updatedState = {
    hoverInfo: action.payload,
  }
  return updateObject(state, updatedState);
}
const setAlertId = (state, action) => {
  const updatedState = {
    alertId: action.payload,
  }
  return updateObject(state, updatedState);
}
const setMidpoint = (state, action) => {
  const updatedState = {
    midPoint: action.payload,
  }
  return updateObject(state, updatedState);
}
const setZoomLevel = (state, action) => {
  const updatedState = {
    zoomLevel: action.payload,
  }
  return updateObject(state, updatedState);
}
const setSortByDate = (state, action) => {
  const updatedState = {
    sortByDate: action.payload,
  }
  return updateObject(state, updatedState);
}
const setAlertSource = (state, action) => {
  const updatedState = {
    alertSource: action.payload,
  }
  return updateObject(state, updatedState);
}
const setDateRange = (state, action) => {
  const updatedState = {
    dateRange: action.payload,
  }
  return updateObject(state, updatedState);
}


export default inSituAlertReducer;
