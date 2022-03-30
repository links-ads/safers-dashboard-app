import * as actionTypes from './types';
import { SIGN_OUT } from '../authentication/types';
import { endpoints } from '../../api/endpoints';
import * as api from '../../api/base';
import { deleteSession } from '../../helpers/authHelper';


export const setDefaultAoi = (uid, objAoi) => async (dispatch) => {
  const endpoint = endpoints.user.profile + uid;
  const response = await api.patch(endpoint, { default_aoi: objAoi.features[0].properties.id });
  if (response.status === 200) {
    return dispatch(setAoiSuccess(objAoi, response.data));
  }
  else
    return dispatch(setAoiFail(response.error));
};
export const setAoiSuccess = (aoi, msg='') => {
  return {
    type: actionTypes.SET_AOI_SUCCESS,
    msg,
    payload: aoi
  };
};

const setAoiFail = (error) => {
  return {
    type: actionTypes.SET_AOI_FAIL,
    payload: error
  };
};


export const getInfo = (id='') => async (dispatch) => {
  const url = endpoints.user.profile + id;
  const response = await api.get(url);
  if (response.status === 200) {
    return dispatch(getInfoSuccess(response.data));
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

export const deleteAccount = (id) => async (dispatch) => {
  const url = endpoints.user.profile + id;
  const response = await api.del(url);
  if (api.isSuccessResp(response.status)) {
    deleteSession();
    return dispatch(deleteAccSuccess());
  }
  else
    return dispatch(deleteAccFail(response.error));
};

const deleteAccSuccess = () => {
  return {
    type: SIGN_OUT,
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

export const updateInfo = (id, userInfo) => async (dispatch) => {
  const url = endpoints.user.profile + id;
  const response = await api.patch(url, {
    organization: userInfo.organization, 
    role: userInfo.role, 
    profile:{
      first_name: userInfo.first_name,
      last_name: userInfo.last_name,
      country: userInfo.country,
      city: userInfo.city,
      address: userInfo.address
    }});
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




