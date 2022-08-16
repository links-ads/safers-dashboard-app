import * as actionTypes from './types';
import { endpoints } from '../../api/endpoints';
import * as api from '../../api/base';
import queryString from 'query-string';

// data layers

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

export const resetDataLayersResponseState = () => {
  return {
    type: actionTypes.RESET_DATA_LAYER_STATE,
  }
};

// Map requests (POST)

export const getMapRequests = (body) => async (dispatch) => {
  const response = await api.post(endpoints.dataLayers.mapRequests, body);
  if (response.status === 200) {
    return dispatch(getMapRequestsSuccess(response.data));
  }
  else
    return dispatch(getMapRequestsFail(response.error));
};

const getMapRequestsSuccess = (mapRequest) => {
  return {
    type: actionTypes.GET_MAP_REQUESTS_SUCCESS,
    payload: mapRequest
  };
};
const getMapRequestsFail = (error) => {
  return {
    type: actionTypes.GET_MAP_REQUESTS_FAIL,
    payload: error
  };
};

// get All Map Requests (GET)

export const getAllMapRequests = () => async (dispatch) => {
  const response = await api.get(endpoints.dataLayers.getAllMapRequests);
  if (response.status === 200) {
    return dispatch(getAllMapRequestsSuccess(response.data));
  }
  else
    return dispatch(getAllMapRequestsFail(response.error));
};

const getAllMapRequestsSuccess = (mapRequest) => {
  return {
    type: actionTypes.GET_ALL_MAP_REQUESTS_SUCCESS,
    payload: mapRequest
  };
};

const getAllMapRequestsFail = (error) => {
  return {
    type: actionTypes.GET_ALL_MAP_REQUESTS_FAIL,
    payload: error
  };
};

export const setNewOnDemandState = (alertState, pageState) => {
  return {
    type: actionTypes.SET_NEW_ON_DEMAND_STATE,
    isNewAlert: alertState,  // has data changed since last time?
    isPageActive: pageState, // has user navigated to the form?
  }
};
