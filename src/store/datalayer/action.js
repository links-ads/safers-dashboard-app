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

// Request a map (POST)
export const postMapRequest = (body) => async (dispatch) => {
  const response = await api.post(endpoints.dataLayers.mapRequests, body);
  if (response.status === 200) {
    return dispatch(postMapRequestSuccess(response.data));
  }
  else
    return dispatch(postMapRequestFail(response.error));
};

const postMapRequestSuccess = (mapRequest) => {
  return {
    type: actionTypes.POST_MAP_REQUESTS_SUCCESS,
    payload: mapRequest
  };
};
const postMapRequestFail = (error) => {
  return {
    type: actionTypes.POST_MAP_REQUESTS_FAIL,
    payload: error
  };
};

// get All Map Requests (GET)
export const getAllMapRequests = () => async (dispatch) => {
  const response = await api.get(endpoints.dataLayers.mapRequests);
  if (response.status === 200) {
    return dispatch(getAllMapRequestsSuccess(response.data));
  }
  else
    return dispatch(getAllMapRequestsFail(response.error));
};

const getAllMapRequestsSuccess = (mapRequests) => {
  return {
    type: actionTypes.GET_ALL_MAP_REQUESTS_SUCCESS,
    payload: mapRequests
  };
};

const getAllMapRequestsFail = (error) => {
  return {
    type: actionTypes.GET_ALL_MAP_REQUESTS_FAIL,
    payload: error
  };
};

// get All Filtered Map Requests (GET)
export const getAllFilteredMapRequests = (options) => async (dispatch) => {
  const url = endpoints.dataLayers.mapRequests.concat('?', queryString.stringify(options))
  
  // TODO: Why this not being triggered?

  const response = await api.get(url);

  if (response.status === 200) {
    return dispatch(getAllFilteredMapRequestsSuccess(response.data));
  }
  else
    return dispatch(getAllFilteredMapRequestsFail(response.error));
};

export const setNewMapRequestState = (eventState, pageState, newItemsCount) => {
  return {
    type: actionTypes.SET_NEW_MAP_REQUEST_STATE,
    isNewAlert: eventState,
    isPageActive: pageState,
    newItemsCount
  }
};

const getAllFilteredMapRequestsSuccess = (mapRequests) => {
  return {
    type: actionTypes.GET_ALL_FILTERED_MAP_REQUESTS_SUCCESS,
    payload: mapRequests
  };
};

const getAllFilteredMapRequestsFail = (error) => {
  return {
    type: actionTypes.GET_ALL_FILTERED_MAP_REQUESTS_FAIL,
    payload: error
  };
};

export const setMapRequestParams = (payload) => {
  return {
    type: actionTypes.SET_MAP_REQUEST_PARAMS,
    payload,
  };
};
