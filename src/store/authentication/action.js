import * as actionTypes from './types';
import { CM_WIP } from '../common/types';
import { endpoints } from '../../api/endpoints';
import * as api from '../../api/base';
import { setSession, deleteSession, getSession } from '../../helpers/authHelper';
import _ from 'lodash';


const InProgress = (status, msg='') => {
  return {
    type: CM_WIP,
    payload: msg,
    isLoading: status
  };
};

export const setAoiBySignInSuccess = (aoi) => {
  return {
    type: actionTypes.SET_AOI_SUCCESS,
    payload: aoi
  };
};

const setSessionData = (token, refreshToken, user, dispatch, rememberMe=false) => {
  const sessionData = {
    access_token: token, 
    refresh_token: refreshToken, 
    userId: user.id
  };
  setSession(sessionData, rememberMe);
  return dispatch(signInSuccess(user));
}

/* Sign In */

export const signInOauth2 = ({authCode}) => async (dispatch) => {
  const response = await api.post(endpoints.authentication.oAuth2SignIn, {
    code: authCode,
  });
  const content = response.data;
  dispatch(InProgress(false));
  if (response.status === 200) {
    return setSessionData(content.token, null, content.user, dispatch)
  }
  return dispatch(signInFail(content.detail));
}

export const signIn = ({email, password, rememberMe}) => async (dispatch) => {
  dispatch(InProgress(true, 'Please wait..'));
  const response = await api.post(endpoints.authentication.signIn, { email, password });
  if (response.status === 200) {
    const {access_token, refresh_token, user} = response.data;
    return setSessionData(access_token, refresh_token, user, dispatch, rememberMe)
  }
  dispatch(InProgress(false));
  return dispatch(signInFail(response.data));
};

export const isRemembered = () => async (dispatch) => {
  const session = getSession();
  if(session && !_.isEmpty(session)) {
    const response = await api.post(endpoints.authentication.refreshToken, {
      'refresh': session.refresh_token
    });
    if (response.status === 200) {
      const newSession = {...session, access_token: response.data.access}
      setSession(newSession, true);
      return dispatch(signInSuccess(newSession.user));
    }
    return dispatch(signInFail(response.data));
  }
}

export const signInSuccess = (user) => {
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

/* Sign Up */

export const signUp = (userInfo) => async (dispatch) => {
  const response = await api.post(endpoints.authentication.signUp, { ...userInfo });
  if (api.isSuccessResp(response.status)) {
    const {access_token, user} = response.data;
    return setSessionData(access_token, null, user, dispatch);
  }
  
  return dispatch(signUpFail(response.data));
};
const signUpFail = (error) => {
  return {
    type: actionTypes.SIGN_UP_FAIL,
    payload: error
  };
};

/* Reset Password */

export const reqResetPsw = (email) => async (dispatch) => {
  const response = await api.post(endpoints.authentication.forgotPswReset, email);// To Do: change to post when API ready
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
export const resetPsw = (data) => async (dispatch) => {
  const response = await api.post(endpoints.authentication.resetPsw, { ...data });
  if (response.status === 200)
    return dispatch(resetPswSuccess(response.data));
  
  return dispatch(resetPswFail(response.data));
};
const resetPswSuccess = (res) => {
  return {
    type: actionTypes.RESET_PASSWORD_SUCCESS,
    payload: res
  };
};
const resetPswFail = (error) => {
  return {
    type: actionTypes.RESET_PASSWORD_FAIL,
    payload: error
  };
};



export const signOut = () => async (dispatch) => {
  const response = await api.post(endpoints.authentication.signOut);
  if (response.status === 200) {
    deleteSession();
    return dispatch(signOutSuccess());
  }
};

const signOutSuccess = () => {
  return {
    type: actionTypes.SIGN_OUT,
  };
};

