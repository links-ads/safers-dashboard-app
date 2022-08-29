import * as actionTypes from './types';
import { updateObject } from '../utility';

const initialState = {
  dataLayers: [],
  currentLayer: {},
  error: false,
  success: null,
  metaData: null,
  isMetaDataLoading: null
};

const dataLayerReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.GET_DATA_LAYERS_SUCCESS: return getDataLayersSuccess(state, action);
  case actionTypes.GET_DATA_LAYERS_FAIL: return getDataLayersFail(state, action);
  case actionTypes.GET_META_DATA_SUCCESS: return getMetaDataSuccess(state, action);
  case actionTypes.META_DATA_LOADING: return getMetaLoading(state, action);
  case actionTypes.META_DATA_RESET: return resetMetaData(state, action);
  case actionTypes.GET_META_DATA_FAIL: return getMetaDataFail(state, action);
  case actionTypes.RESET_DATA_LAYER_STATE: return resetDataLayersResponseState(state, action);
  default:
    return state;
  }
};

const resetMetaData = (state) => {
  const updatedState = {
    metaData: null,
  }
  return updateObject(state, updatedState);
}
const getMetaLoading = (state) => {
  const updatedState = {
    isMetaDataLoading: true,
  }
  return updateObject(state, updatedState);
}
const getMetaDataSuccess = (state, action) => {
  const updatedState = {
    metaData: action.payload,
    isMetaDataLoading: false,
    error: false,
  }
  return updateObject(state, updatedState);
}
const getMetaDataFail = (state) => {
  const updatedState = {
    error: true,
    isMetaDataLoading: false
  }
  return updateObject(state, updatedState);
}
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

export default dataLayerReducer;
