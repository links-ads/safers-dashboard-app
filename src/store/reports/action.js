import * as actionTypes from './types';
import { endpoints } from '../../api/endpoints';
import * as api from '../../api/base';

export const getAllReports = (options) => async (dispatch) => {
  const response = await api.get(endpoints.reports.getReports, options);
  if (response.status === 200) {
    return dispatch(getReportsSuccess(response.data));
  }
  else
    return dispatch(getReportsFail(response.error));
};
const getReportsSuccess = (alerts) => {
  return {
    type: actionTypes.GET_REPORTS_SUCCESS,
    payload: alerts
  };
};
const getReportsFail = (error) => {
  return {
    type: actionTypes.GET_REPORTS_FAIL,
    payload: error
  };
};

export const setFilterdReports = (payload) => async (dispatch) => {
  return dispatch(setFilters(payload));
};

const setFilters = (payload) => {
  return {
    type: actionTypes.SET_REPORT_FILTERS,
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
    type: actionTypes.SET_FAV_REPORT_SUCCESS,
    msg,
  };
};
const setFavoriteFail = (error) => {
  return {
    type: actionTypes.SET_FAV_REPORT_FAIL,
    payload: error
  };
}

export const resetReportResponseState = () => {
  return {
    type: actionTypes.RESET_REPORT_STATE,
  }
};
export const setDateRange = (payload) => {
  return {
    type: actionTypes.SET_REPORT_DATE_RANGE,
    payload,
  };
};

export const getReportDetail = (id) => async (dispatch) => {
  const response = await api.get(endpoints.reports.getReportInfo.replace(':report_id', id));
  if (response.status === 200) {
    return dispatch(getReportDetailSuccess(response.data));
  }
  else
    return dispatch(getReportDetailFail(response.error));
}

const getReportDetailSuccess = (alerts) => {
  return {
    type: actionTypes.GET_REPORT_DETAIL_SUCCESS,
    payload: alerts
  };
};
const getReportDetailFail = (error) => {
  return {
    type: actionTypes.GET_REPORT_DETAIL_FAIL,
    payload: error
  };
};
