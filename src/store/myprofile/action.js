import * as actionTypes from './types';
import { endpoints } from '../../api/endpoints';
import * as api from '../../api/base';

export const getInfo = (id='') => async (dispatch) => {
  console.log(id);//To be used
  const response = await api.get(`${endpoints.myprofile.user}`);
  if (response.status === 200) {
    return dispatch(getInfoSuccess(response.data?.user));
  }
  else
    return dispatch(getInfoFail(response.error));
};
const getInfoSuccess = (user) => {
  return {
    type: actionTypes.MP_GET_SUCCESS,
    payload: user
  };
};
const getInfoFail = (error) => {
  return {
    type: actionTypes.MP_GET_FAIL,
    payload: error
  };
};

export const deleteAccount = () => async (dispatch) => {
  const response = await api.get(endpoints.myprofile.deleteAcc);
  if (response.status === 200) {
    return dispatch(deleteAccSuccess(response.data));
  }
  else
    return dispatch(deleteAccFail(response.error));
};
const deleteAccSuccess = (user) => {
  return {
    type: actionTypes.MP_DELETE_SUCCESS,
    payload: user
  };
};
const deleteAccFail = (error) => {
  return {
    type: actionTypes.MP_DELETE_FAIL,
    payload: error
  };
};

export const resetProfilePsw = () => async (dispatch) => {
  const response = await api.get(endpoints.myprofile.getInfo);
  if (response.status === 200) {
    return dispatch(resetPswSuccess(response.data));
  }
  else
    return dispatch(resetPswFail(response.error));
};
const resetPswSuccess = (res) => {
  return {
    type: actionTypes.MP_RESETPSW_SUCCESS,
    payload: res
  };
};
const resetPswFail = (error) => {
  return {
    type: actionTypes.MP_RESETPSW_FAIL,
    payload: error
  };
};

export const uploadProfImg = (file) => async (dispatch) => {
  const response = await api.post(endpoints.myprofile.uploadProfImg, {file});
  if (response.status === 200) {
    return dispatch(uploadFileSuccess(response.data));
  }
  else
    return dispatch(uploadFileFailed(response.data));
};

const uploadFileSuccess = (res) => {
  return {
    type: actionTypes.MP_FILEUPLOAD_SUCCESS,
    payload: res
  };
};
const uploadFileFailed = (error) => {
  return {
    type: actionTypes.MP_FILEUPLOAD_FAIL,
    payload: error
  };
};

export const updateInfo = (userInfo) => async (dispatch) => {
  const response = await api.post(endpoints.myprofile.updateInfo, {userInfo});
  if (response.status === 200) {
    getInfo();
    return dispatch(updateInfoSuccess(response.data));
  }
  else
    return dispatch(updateInfoFail(response.data));
};
const updateInfoSuccess = (user) => {
  return {
    type: actionTypes.MP_UPDATE_SUCCESS,
    payload: user
  };
};
const updateInfoFail = (error) => {
  return {
    type: actionTypes.MP_UPDATE_FAIL,
    payload: error
  };
};
