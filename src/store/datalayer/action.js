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

export const getDataLayerTimeSeriesData = (options) => async (dispatch) => {
  const response = await fetch('https://geoserver-test.safers-project.cloud/geoserver/ermes/wms'.concat('?', queryString.stringify(options)));
  if (response.status === 200) {
    return dispatch(getTimeSeriesDataSuccess(await response.text()));
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
