import * as actionTypes from './types';
import { updateObject } from '../utility';

const initialState = {
  defaultAoi: null,
  aoiSetSuccess: null,
  error: false,
  getAOIerror: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.SET_AOI_SUCCESS: return setAoiSuccess(state, action);
  case actionTypes.SET_AOI_FAIL: return setAoiFail(state, action);
  default:
    return state;
  }
};

const setAoiSuccess = (state, action) => {
  const updatedState = {
    defaultAoi: action.payload,
    aoiSetSuccess: action.msg,
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
