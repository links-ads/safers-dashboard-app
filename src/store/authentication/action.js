import * as actionTypes from './types';
import { endpoints } from '../../api/endpoints';
import * as api from '../../api/base';
import { setSession, deleteSession } from '../../helpers/authHelper';

export const signIn = ({ username, password, rememberMe }) => async (dispatch) => {
  const response = await api.get(endpoints.authentication.signIn, { username, password });//should be post with the backend
  if (response.status === 200) {
    setSession(response.data?.user, rememberMe);
    if (response.data?.user.default_aoi)
      dispatch(setAoiBySignInSuccess(response.data?.user.default_aoi));

    return dispatch(signInSuccess(response.data?.user));
  }
  else
    return dispatch(signInFail(response.error));
};

const setAoiBySignInSuccess = (aoi) => {
  return {
    type: actionTypes.SET_AOI_SUCCESS,
    payload: aoi
  };
};
const signInSuccess = (user) => {
  return {
    type: actionTypes.SIGN_IN_SUCCESS,
    payload: user
  };
};
const signInFail = (error) => {
  return {
    type: actionTypes.SIGN_IN_FAIL,
    payload: error
  };
};

export const signUp = (userInfo) => async (dispatch) => {
  const response = await api.get(endpoints.authentication.signUp, { userInfo });//should be post with the backend
  if (response.status === 200) {
    setSession(response.data?.user, false);
    return dispatch(signUpSuccess(response.data?.user));
  }
  else
    return dispatch(signUpFail(response.error));
};
const signUpSuccess = (user) => {
  return {
    type: actionTypes.SIGN_UP_SUCCESS,
    payload: user
  };
};
const signUpFail = (error) => {
  return {
    type: actionTypes.SIGN_UP_FAIL,
    payload: error
  };
};

export const reqResetPsw = (email) => async (dispatch) => {
  const response = await api.get(endpoints.authentication.forgotPassword, { email });// To Do: change to post when API ready
  if (response.status === 200)
    return dispatch(reqResetPswSuccess(response.data));
  else
    return dispatch(reqResetPswFail(response.error));
};
const reqResetPswSuccess = (res) => {
  return {
    type: actionTypes.FORGOT_PASSWORD_SUCCESS,
    payload: res
  };
};
const reqResetPswFail = (error) => {
  return {
    type: actionTypes.FORGOT_PASSWORD_FAIL,
    payload: error
  };
};



export const signOut = () => async (dispatch) => {
  deleteSession();
  return dispatch(signOutSuccess());
};

const signOutSuccess = () => {
  return {
    type: actionTypes.SIGN_OUT,
  };
};

