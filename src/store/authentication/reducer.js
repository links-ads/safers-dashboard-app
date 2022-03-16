import * as actionTypes from './types';
import { updateObject } from '../utility';

const initialState = {
  user: {},
  isLoggedIn: false,
  error: false,
  forgotPswresponse: null,
  resetPswRes: null,
  resetPswError: null
  //loading: false
};

const ingredientsReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.SIGN_IN_SUCCESS: return signInSuccess(state, action);
  case actionTypes.SIGN_IN_FAIL: return signInFail(state, action);
  case actionTypes.SIGN_UP_SUCCESS: return signUpSuccess(state, action);
  case actionTypes.SIGN_UP_FAIL: return signUpFail(state, action);
  case actionTypes.FORGOT_PASSWORD_SUCCESS: return reqResetPswSuccess(state, action);
  case actionTypes.FORGOT_PASSWORD_FAIL: return reqResetPswFail(state, action);
  case actionTypes.RESET_PASSWORD_SUCCESS: return resetPswSuccess(state, action);
  case actionTypes.RESET_PASSWORD_FAIL: return resetPswFail(state, action);
  case actionTypes.SIGN_OUT: return signOut(state, action);
  default:
    return state;
  }
};

const signInSuccess = (state, action) => {
  const updatedState = {
    user: action.payload,
    isLoggedIn: true,
    error: false,
  }
  return updateObject(state, updatedState);
}

const signInFail = (state) => {
  const updatedState = {
    error: true,
  }
  return updateObject(state, updatedState);
}

const signUpSuccess = (state, action) => {
  const updatedState = {
    user: action.payload,
    isLoggedIn: true,
    error: false,
  }
  return updateObject(state, updatedState);
}

const signUpFail = (state, action) => {
  return updateObject(state, { error: action.payload });
};

const resetPswSuccess = (state, action) => {
  const updatedState = {
    resetPswRes: action.payload,
    error: false,
  }
  return updateObject(state, updatedState);
}

const resetPswFail = (state, action) => {
  return updateObject(state, { resetPswError: action.payload });
};

const reqResetPswSuccess = (state, action) => {
  const updatedState = {
    forgotPswresponse: action.payload,
    error: false,
  }
  return updateObject(state, updatedState);
}

const reqResetPswFail = (state, action) => {
  return updateObject(state, { error: action.payload });
};

const signOut = (state) => {
  const updatedState = initialState;
  return updateObject(state, updatedState);
}


export default ingredientsReducer;
