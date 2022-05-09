import axios from 'axios'
import { authHeader, deleteSession } from '../helpers/authHelper';
import { BASE_URL } from '../config';
import store from '../store'
// eslint-disable-next-line no-unused-vars
import { InProgress, signOutSuccess } from '../store/authentication/action';

export const API_PREFIX = 'api';

const axiosApi = axios.create({
  baseURL: `${BASE_URL}/${API_PREFIX}`,
  timeout: 5000
})

axiosApi.interceptors.response.use(
  response => response,
  error => handleError(error)
).then(() => store.dispatch(InProgress(false)))

export const axiosInstance = axiosApi;

export async function get(url, config = {}) {
  return await axiosApi.get(url, { params: config, headers: authHeader()}).then(response => response)
}

export async function patch(url, data, config = {}) {
  return await axiosApi.patch(url, { ...data }, { ...config, headers: authHeader() })
    .then(response => response)
    .catch(error => error.response);
}

export async function post(url, data, config = {}) {
  return axiosApi
    .post(url, { ...data }, { ...config, headers: authHeader() })
    .then(response => response)
    .catch(error => error.response);
}

export async function put(url, data, config = {}) {
  return axiosApi
    .put(url, { ...data }, { ...config, headers: authHeader() })
    .then(response => response)
}

export async function del(url, config = {}) {
  return await axiosApi
    .delete(url, { ...config, headers: authHeader() })
    .then(response => response)
}

const handleError = (error) => {
  switch(error.response.status){
  case 401:
    deleteSession();
    store.dispatch(signOutSuccess())
    return Promise.reject(error)
  
  default:
    return Promise.reject(error)
  }
}
export function isSuccessResp(status) {
  //2xx Status Codes [Success]
  if(status >= 200 && status <= 299){
    return true;
  }
  return false;
}
