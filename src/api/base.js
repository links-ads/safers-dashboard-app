import axios from 'axios'
import { authHeader } from '../helpers/authHelper';
import { BASE_URL } from '../config';
import store from '../store'
import { InProgress, signOut } from '../store/authentication/action';

export const API_PREFIX = 'api';

const axiosApi = axios.create({
  baseURL: `${BASE_URL}/${API_PREFIX}`,
})

axiosApi.interceptors.request.use(async(config) => {
  // spinning start to show
  if(!config.url.includes('alerts')){
    store.dispatch(InProgress(true, 'Please wait..'));
  }
  await new Promise(r => setTimeout(r, 2000));
  return config
}, (error) => {
  return Promise.reject(error);
});

axiosApi.interceptors.response.use(
  (response) => {
    store.dispatch(InProgress(false));
    return response
  },
  error => handleError(error)
)

export const axiosInstance = axiosApi;

export async function get(url, config = {}) {
  return await axiosApi.get(url, {...config, headers: authHeader()}).then(response => response)
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
    store.dispatch(signOut())
    return Promise.reject(error)
  case 404:
    window.location.href = '/pages-404'
    return Promise.reject(error)
  case 500:
    window.location.href = '/pages-500'
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
