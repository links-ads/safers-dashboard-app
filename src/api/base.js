import axios from 'axios'
import { authHeader } from '../helpers/authHelper';

//apply base url for axios
const BASE_URL = process.env.REACT_APP_DOMAIN ? process.env.REACT_APP_DOMAIN : 'https://safers-dashboard.herokuapp.com'

const axiosApi = axios.create({
  baseURL: BASE_URL,
})

//const authUser = JSON.parse(localStorage.getItem('authUser'));

//axiosApi.defaults.headers.common['Authorization'] = authUser ? authUser.accessToken : '';

axiosApi.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
)

export async function get(url, config = {}) {
  return await axiosApi.get(url, { ...config, headers: authHeader() }).then(response => response)
}

export async function post(url, data, config = {}) {
  return axiosApi
    .post(url, { ...data }, { ...config, headers: authHeader() })
    .then(response => response)
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
