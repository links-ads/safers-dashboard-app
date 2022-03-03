import * as actionTypes from './types';
import { endpoints } from '../../api/endpoints';
import * as api from '../../api/base';
import { setSession ,deleteSession} from '../../helpers/authHelper';

export const signIn = ({username, password, rememberMe}) => async (dispatch) => {
  const response = await api.get(endpoints.authentication.signIn, { username, password });//should be post with the backend
  if (response.status === 200) {
    setSession(response.data?.user, rememberMe);
    return dispatch(signInSuccess(response.data?.user));
  }
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


export const signOut = () => async (dispatch) => {
  deleteSession();
  return dispatch(signOutSuccess());
};

const signOutSuccess = () => {
  return {
    type: actionTypes.SIGN_OUT,
  };
};

