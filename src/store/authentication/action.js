import * as actionTypes from './types';
import { endpoints } from '../../api/endpoints';
import * as api from '../../api/base';

export const signIn = (username, password) => async (dispatch) => {
  const response = await api.post(endpoints.authentication.signIn, { username, password });
  if (response.status === 200)
    return dispatch(signInSuccess(response.data));
  else
    return dispatch(signInFail(response.error));
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
  const response = await api.post(endpoints.authentication.signIn, { userInfo });
  if (response.status === 200)
    return dispatch(signUpSuccess(response.data));
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

