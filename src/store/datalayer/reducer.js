import * as actionTypes from './types';
import { updateObject } from '../utility';

const initialState = {
  dataLayers: [],
  currentLayer: {},
  error: false,
  success: null
};

const alertReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.GET_DATA_LAYERS_SUCCESS: return getDataLayersSuccess(state, action);
  case actionTypes.GET_DATA_LAYERS_FAIL: return getDataLayersFail(state, action);
  case actionTypes.EDIT_ALERT_INFO_SUCCESS: return getDataLayerInfoSuccess(state, action);
  case actionTypes.EDIT_ALERT_INFO_FAIL: return getDataLayerInfoFail(state, action);
  case actionTypes.RESET_ALERT_STATE: return resetDataLayersResponseState(state, action);
  default:
    return state;
  }
};

const getDataLayersSuccess = (state, action) => {
  const updatedState = {
    allDataLayers: action.payload,
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


const getDataLayerInfoSuccess = (state, action) => {
  const updatedState = {
    success: action.msg,
    error: false,
  }
  return updateObject(state, updatedState);
}
const getDataLayerInfoFail = (state) => {
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

export default alertReducer;
