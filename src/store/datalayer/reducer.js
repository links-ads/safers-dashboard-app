import * as actionTypes from './types';
import { updateObject } from '../utility';

const initialState = {
  dataLayers: [],
  currentLayer: {},
  error: false,
  success: null,
  mapRequest: {},
  allMapRequests: [],
  filteredMapRequests: [],
  params: {
    order: '-date',
    default_bbox: true,
    default_date: false
  },
  isPageActive: false,
  isNewAlert: false
};

const dataLayerReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.GET_DATA_LAYERS_SUCCESS: return getDataLayersSuccess(state, action);
  case actionTypes.GET_DATA_LAYERS_FAIL: return getDataLayersFail(state, action);
  case actionTypes.RESET_DATA_LAYER_STATE: return resetDataLayersResponseState(state, action);
  case actionTypes.POST_MAP_REQUESTS_SUCCESS: return postMapRequestSuccess(state, action);
  case actionTypes.POST_MAP_REQUESTS_FAIL: return postMapRequestFail(state, action);
  case actionTypes.GET_ALL_MAP_REQUESTS_SUCCESS: return getAllMapRequestsSuccess(state, action);
  case actionTypes.GET_ALL_MAP_REQUESTS_FAIL: return getAllMapRequestsFail(state, action);
  case actionTypes.SET_NEW_MAP_REQUEST_STATE: return setNewMapRequestState(state, action);
  case actionTypes.GET_ALL_FILTERED_MAP_REQUESTS_SUCCESS: return getAllFilteredMapRequestsSuccess(state, action);
  case actionTypes.GET_ALL_FILTERED_MAP_REQUESTS_FAIL: return getAllFilteredMapRequestsFail(state, action);
  case actionTypes.SET_MAP_REQUEST_PARAMS: return setMapRequestsParams(state, action)
  default:
    return state;
  }
};

const getDataLayersSuccess = (state, action) => {
  const updatedState = {
    dataLayers: action.payload,
    error: false,
  }
  return updateObject(state, updatedState);
}
const getDataLayersFail = (state) => {
  const updatedState = {
    error: true,
  }
  return updateObject(state, updatedState);
}

const resetDataLayersResponseState = (state) => {
  const updatedState = {
    error: false,
    success: null
  }
  return updateObject(state, updatedState);
}

// Map requests (POST)
const postMapRequestSuccess = (state, action) => {
  const updatedState = {
    mapRequest: action.payload,
    error: false,
  }
  return updateObject(state, updatedState);
}
const postMapRequestFail = (state) => {
  const updatedState = {
    error: true,
  }
  return updateObject(state, updatedState);
}

// All Map requests (GET)
const getAllMapRequestsSuccess = (state, action) => {
  const updatedState = {
    allMapRequests: action.payload,
    error: false,
  }
  return updateObject(state, updatedState);
}
const getAllMapRequestsFail = (state) => {
  const updatedState = {
    error: true,
  }
  return updateObject(state, updatedState);
}

// All Filtered Map requests (GET)
const getAllFilteredMapRequestsSuccess = (state, action) => {
  const updatedState = {
    filteredMapRequests: action.payload,
    error: false,
  }
  return updateObject(state, updatedState);
}
const getAllFilteredMapRequestsFail = (state) => {
  const updatedState = {
    error: true,
  }
  return updateObject(state, updatedState);
}

const setMapRequestsParams = (state, action) => {
  const updatedState = {
    params: action,
  }
  return updateObject(state, updatedState);
}

const setNewMapRequestState = (state, action) => {
  const updatedState = {
    isNewMapRequest: action.isNewMapRequest,
    isPageActive: action.isPageActive,
    newItemsCount: action.newItemsCount
  }
  return updateObject(state, updatedState);
}

export default dataLayerReducer;
