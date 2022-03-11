import * as actionTypes from './types';
import { updateObject } from '../utility';

const initialState = {
  user: {}
};

const myProfileReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.MP_GET_SUCCESS: return getInfoSuccess(state, action);
  case actionTypes.MP_GET_FAIL: return getInfoFail(state, action);
  case actionTypes.MP_UPDATE_SUCCESS: return updateInfoSuccess(state, action);
  case actionTypes.MP_UPDATE_FAIL: return updateInfoFail(state, action);
  default:
    return state;
  }
};

const getInfoSuccess = (state, action) => {
  const updatedState = {
    user: action.payload,
    error: false,
  }
  return updateObject(state, updatedState);
}

const getInfoFail = (state) => {
  const updatedState = {
    error: true,
  }
  return updateObject(state, updatedState);
}
const updateInfoSuccess = (state, action) => {
  const updatedState = {
    updateStatus: action.payload,
    error: false,
  }
  return updateObject(state, updatedState);
}

const updateInfoFail = (state) => {
  const updatedState = {
    error: true,
  }
  return updateObject(state, updatedState);
}

export default myProfileReducer;
