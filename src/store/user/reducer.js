import * as actionTypes from './types';
import { updateObject } from '../utility';

const initialState = {
  aois: [],
  defaultAoi: null,
  error: false,
  getAOIerror: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.SET_AOI_SUCCESS: return setAoiSuccess(state, action);
  case actionTypes.SET_AOI_FAIL: return setAoiFail(state, action);
  case actionTypes.GET_AOI_SUCCESS: return getAoiSuccess(state, action);
  case actionTypes.GET_AOI_FAIL: return getAoiFail(state, action);
  default:
    return state;
  }
};

const getAoiSuccess = (state, action) => {
  const updatedState = {
    aois: action.payload,
    error: false,
  }
  return updateObject(state, updatedState);
}

const getAoiFail = (state, action) => {
  const updatedState = {
    getAOIerror: action.payload,
  }
  return updateObject(state, updatedState);
}

const setAoiSuccess = (state, action) => {
  const updatedState = {
    defaultAoi: action.payload,
    error: false,
  }
  return updateObject(state, updatedState);
}

const setAoiFail = (state) => {
  const updatedState = {
    error: true,
  }
  return updateObject(state, updatedState);
}

export default userReducer;
