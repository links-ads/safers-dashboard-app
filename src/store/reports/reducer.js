import * as actionTypes from './types';
import { updateObject } from '../utility';

const initialState = {
  allReports: [],
  alertSource: 'all',
  error: false,
  success: null,
  filteredReports: null,
  reportDetail: null,
  category : '',
  sortOrder: 'desc',
  missionId: ''
};

const reportReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.GET_REPORTS_SUCCESS: return getReportsSuccess(state, action);
  case actionTypes.GET_REPORTS_FAIL: return getReportsFail(state, action);
  case actionTypes.SET_FAV_REPORT_SUCCESS: return setFavoriteSuccess(state, action);
  case actionTypes.SET_FAV_REPORT_FAIL: return setFavoriteFail(state, action);
  case actionTypes.RESET_REPORT_STATE: return resetReportResponseState(state, action);
  case actionTypes.SET_REPORT_FILTERS: return setFilters(state, action);
  case actionTypes.GET_REPORT_DETAIL_SUCCESS: return getReportDetailSuccess(state, action);
  case actionTypes.GET_REPORT_DETAIL_FAIL: return getReportDetailFail(state, action);
  default:
    return state;
  }
};

const getReportDetailSuccess = (state, action) => {
  const updatedState = {
    reportDetail: action.payload,
    error: false,
  }
  return updateObject(state, updatedState);
}

const getReportDetailFail = (state) => {
  const updatedState = {
    error: true,
  }
  return updateObject(state, updatedState);
}

const getReportsSuccess = (state, action) => {
  const updatedState = {
    allReports: action.payload,
    error: false,
  }
  return updateObject(state, updatedState);
}

const setFilters = (state, action) => {
  const { category, sortOrder, missionId  } = action.filterParams;
  const updatedState = {
    filteredReports: action.payload,
    category,
    sortOrder,
    missionId,
    error: false,
  }
  return updateObject(state, updatedState);
}

const getReportsFail = (state) => {
  const updatedState = {
    error: true,
  }
  return updateObject(state, updatedState);
}

const setFavoriteSuccess = (state, action) => {
  const updatedState = {
    success: action.msg,
    error: false,
  }
  return updateObject(state, updatedState);
}
const setFavoriteFail = (state) => {
  const updatedState = {
    error: true,
  }
  return updateObject(state, updatedState);
}

const resetReportResponseState = (state) => {
  const updatedState = {
    error: false,
    success: null
  }
  return updateObject(state, updatedState);
}

export default reportReducer;
