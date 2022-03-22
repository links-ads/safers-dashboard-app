import * as actionTypes from './types';
import { updateObject } from '../utility';

const initialState = {
  user: {},
  uploadFileSuccessRes : null,
  uploadFileFailRes : null,
  resetPswSuccessRes: null,
  resetPswFailRes: null,
  deleteAccSuccessRes: null,
  deleteAccFailRes: null,
};

const myProfileReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.MP_GET_SUCCESS: return getInfoSuccess(state, action);
  case actionTypes.MP_GET_FAIL: return getInfoFail(state, action);
  case actionTypes.MP_UPDATE_SUCCESS: return updateInfoSuccess(state, action);
  case actionTypes.MP_UPDATE_FAIL: return updateInfoFail(state, action);
  case actionTypes.MP_FILEUPLOAD_SUCCESS: return uploadFileSuccess(state, action);
  case actionTypes.MP_FILEUPLOAD_FAIL: return uploadFileFailed(state, action);
  case actionTypes.MP_RESETPSW_SUCCESS: return resetPswSuccess(state, action);
  case actionTypes.MP_RESETPSW_FAIL: return resetPswFail(state, action);
  case actionTypes.MP_DELETE_SUCCESS: return deleteAccSuccess(state, action);
  case actionTypes.MP_DELETE_FAIL: return deleteAccFail(state, action);
  default:
    return state;
  }
};

const uploadFileSuccess = (state, action) => {
  const updatedState = {
    uploadFileSuccessRes: action.payload,
  }
  return updateObject(state, updatedState);
}

const uploadFileFailed = (state) => {
  const updatedState = {
    uploadFileFailRes: true,
  }
  return updateObject(state, updatedState);
}
const resetPswSuccess = (state, action) => {
  const updatedState = {
    resetPswSuccessRes: action.payload,
  }
  return updateObject(state, updatedState);
}

const resetPswFail = (state, action) => {
  const updatedState = {
    resetPswFailRes: action.payload,
  }
  return updateObject(state, updatedState);
}
const deleteAccSuccess = (state, action) => {
  const updatedState = {
    deleteAccSuccessRes: action.payload,
  }
  return updateObject(state, updatedState);
}

const deleteAccFail = (state, action) => {
  const updatedState = {
    deleteAccFailRes: action.payload,
  }
  return updateObject(state, updatedState);
}

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
