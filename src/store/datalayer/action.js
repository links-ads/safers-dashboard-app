import * as actionTypes from './types';
import { endpoints } from '../../api/endpoints';
import * as api from '../../api/base';
import queryString from 'query-string';

export const getAllDataLayers = (options) => async (dispatch) => {
  const response = await api.get(endpoints.dataLayers.getAll.concat('?', queryString.stringify(options)));
  if (response.status === 200) {
    return dispatch(getDataLayersSuccess(response.data));
  }
  else
    return dispatch(getDataLayersFail(response.error));
};
const getDataLayersSuccess = (DataLayers) => {
  return {
    type: actionTypes.GET_DATA_LAYERS_SUCCESS,
    payload: DataLayers
  };
};
const getDataLayersFail = (error) => {
  return {
    type: actionTypes.GET_DATA_LAYERS_FAIL,
    payload: error
  };
};

export const getMetaData = (endpoint) => async (dispatch) => {
  dispatch(metaDataLoading());
  const response = await api.get(endpoint);
  if (response.status === 200) {
    return dispatch(getMetaDataSuccess(response.data));
  }
  else
    return dispatch(getMetaDataFail(response.error));
};

const metaDataLoading = () => {
  return {
    type: actionTypes.META_DATA_LOADING,
  };
};

export const resetMetaData = () => {
  return {
    type: actionTypes.META_DATA_RESET,
  };
};
const getMetaDataSuccess = (DataLayers) => {
  return {
    type: actionTypes.GET_META_DATA_SUCCESS,
    payload: DataLayers
  };
};
const getMetaDataFail = (error) => {
  return {
    type: actionTypes.GET_META_DATA_FAIL,
    payload: error
  };
};

export const getDataLayerTimeSeriesData = (options, type) => async (dispatch) => {
  // const response = await api.get('https://geoserver-test.safers-project.cloud/geoserver/ermes/wms'.concat('?', queryString.stringify(options)));
  const response = await fetch(options);
  if (response.status === 200 && type == 'GetTimeSeries') {
    return dispatch(getTimeSeriesDataSuccess(await response.text()));
  } else if (response.status === 200 && type == 'GetFeatureInfo') {
    return dispatch(getFeatureInfoSuccess(await response.json()));
  }
  else
    return dispatch(getTimeSeriesDataFail(response.error));
};
const getTimeSeriesDataSuccess = (TimeSeries) => {
  return {
    type: actionTypes.GET_TIME_SERIES_SUCCESS,
    payload: TimeSeries
  };
};
const getFeatureInfoSuccess = (FeatureInfo) => {
  return {
    type: actionTypes.GET_FEATURE_INFO_SUCCESS,
    payload: FeatureInfo
  };
};
const getTimeSeriesDataFail = (error) => {
  return {
    type: actionTypes.GET_TIME_SERIES_FAIL,
    payload: error
  };
};

export const resetDataLayersResponseState = () => {
  return {
    type: actionTypes.RESET_DATA_LAYER_STATE,
  }
};
