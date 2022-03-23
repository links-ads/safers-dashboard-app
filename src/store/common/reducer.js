import * as actionTypes from './types';
import { updateObject } from '../utility';

const initialState = {
  orgList: [],
  roleList: [],
  isLoading: false,
  loadingMsg: null
};

const commonReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.CM_GET_ORGLIST_SUCCESS: return getOrgListSuccess(state, action);
  case actionTypes.CM_GET_ORGLIST_FAIL: return getOrgListFail(state, action);
  case actionTypes.CM_GET_ROLELIST_SUCCESS: return getRoleListSuccess(state, action);
  case actionTypes.CM_GET_ROLELIST_FAIL: return getRoleListFail(state, action);
  case actionTypes.CM_WIP: return isSiteLoading(state, action);
  default:
    return state;
  }
};

const isSiteLoading = (state, action) => {
  const updatedState = {
    loadingMsg: action.payload,
    isLoading: action.isLoading,
  }
  return updateObject(state, updatedState);
}

const getOrgListSuccess = (state, action) => {
  const updatedState = {
    orgList: action.payload,
    error: false,
  }
  return updateObject(state, updatedState);
}

const getOrgListFail = (state) => {
  const updatedState = {
    error: true,
  }
  return updateObject(state, updatedState);
}

const getRoleListSuccess = (state, action) => {
  const updatedState = {
    roleList: action.payload,
    error: false,
  }
  return updateObject(state, updatedState);
}

const getRoleListFail = (state) => {
  const updatedState = {
    error: true,
  }
  return updateObject(state, updatedState);
}

export default commonReducer;
