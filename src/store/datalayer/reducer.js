import * as actionTypes from './types';
import { updateObject } from '../utility';

const initialState = {
  dataLayers: [],
  currentLayer: {},
  error: false,
  success: null
};

const dataLayerReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.GET_DATA_LAYERS_SUCCESS: return getDataLayersSuccess(state, action);
  case actionTypes.GET_DATA_LAYERS_FAIL: return getDataLayersFail(state, action);
  case actionTypes.RESET_DATA_LAYER_STATE: return resetDataLayersResponseState(state, action);
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

export default dataLayerReducer;
