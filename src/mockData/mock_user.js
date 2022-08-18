export const COMMON_ERROR_MSG = 'Fake Error Message';
import * as actionTypes from '../store/authentication/types';

export const SUCCESS_FETCH_USER = {
  id: 8,
  name: 'mmb',
  email: 'mmb.221177@gmail.com',
  status: 2,
  status_label: 'Active',
  mobile: '738422532',
  code_country: '00967',
  avatar: 'http://localhost:3000/default_image.jpg',
  customer_id: 3,
  provider_id: null,
  accessToken: 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6OCwibmFtZSI6Im1tYiIsImVtYWlsIjoibW1iLjIyMTE3N0BnbWFpbC5jb20iLCJpYXQiOjE1NDc5NjYxMzQsImV4cCI6MTU1MDU1ODEzNH0.TLMc6owRpsOWl-al7yErWKcF7ylEGYW4ihEK_gLn5KY'
}
export const FETCH_USER_SUCCESS_ACTION = {
  type: actionTypes.SIGN_IN_SUCCESS,
  payload: SUCCESS_FETCH_USER,
};
  
export const FETCH_USER_FAILURE_ACTION = {
  type: actionTypes.SIGN_IN_FAIL,
  payload : COMMON_ERROR_MSG
};
  
export const SUCCESS_FETCH_USER_STATE = {
  user: SUCCESS_FETCH_USER,
  isLoggedIn: true,
  error: false,
  forgotPswresponse: null
};