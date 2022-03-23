import * as actionTypes from './types';
import { endpoints } from '../../api/endpoints';
import * as api from '../../api/base';


export const generalInProgress = (msg) => async (dispatch) => {
  dispatch(InProgress(msg));
}

const InProgress = (msg) => {
  return {
    type: actionTypes.CM_WIP,
    payload: msg,
    isLoading: true
  };
};

export const getOrgList = () => async (dispatch) => {
  const response = await api.get(endpoints.common.organizations);
  if (response.status === 200) {
    return dispatch(getOrgListSuccess(response.data));
  }
  else
    return dispatch(getOrgListFail(response.data));
};

export const getRoleList = () => async (dispatch) => {
  const response = await api.get(endpoints.common.roles);
  if (response.status === 200) {
    return dispatch(getRoleListSuccess(response.data));
  }
  else
    return dispatch(getRoleListFail(response.data));
};

const getRoleListSuccess = (roles) => {
  return {
    type: actionTypes.CM_GET_ROLELIST_SUCCESS,
    payload: roles
  };
};
const getRoleListFail = (error) => {
  return {
    type: actionTypes.CM_GET_ROLELIST_FAIL,
    payload: error
  };
};
const getOrgListSuccess = (user) => {
  return {
    type: actionTypes.CM_GET_ORGLIST_SUCCESS,
    payload: user
  };
};
const getOrgListFail = (error) => {
  return {
    type: actionTypes.CM_GET_ORGLIST_FAIL,
    payload: error
  };
};
