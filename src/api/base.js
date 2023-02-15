import axios from 'axios';

import { endpoints } from './endpoints';
import { BASE_URL } from '../config';
import { authHeader, deleteSession } from '../helpers/authHelper';
import store from '../store';
// eslint-disable-next-line no-unused-vars
import { InProgress, signOutSuccess } from '../store/authentication/action';
export const API_PREFIX = 'api';

const axiosApi = axios.create({
  baseURL: `${BASE_URL}/${API_PREFIX}`,
});

console.log('AXIOS: ', `${BASE_URL}/${API_PREFIX}`);

const whitelistedUrls = [
  endpoints.notifications.getAll,
  endpoints.eventAlerts.getAll,
  endpoints.fireAlerts.getAll,
  endpoints.dataLayers.metadata,
  endpoints.dataLayers.mapRequests,
  endpoints.chatbot.people.getAll,
  endpoints.chatbot.comms.getAll,
  endpoints.chatbot.missions.getMissions,
  endpoints.chatbot.reports.getReports,
];

axiosApi.interceptors.request.use(
  async config => {
    const isPermitted = isWhitelisted(config.url);
    if (!isPermitted || (isPermitted && config.method === 'post')) {
      store.dispatch(InProgress(true, 'Please wait..'));
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

axiosApi.interceptors.response.use(
  response => {
    store.dispatch(InProgress(false));
    return response;
  },
  error => {
    store.dispatch(InProgress(false));
    return handleError(error);
  },
);

export const axiosInstance = axiosApi;

export async function getCustom(url, config) {
  return await axios({
    method: 'get',
    url,
    ...config,
  }).then(response => response);
}

export async function get(url, config = {}) {
  return await axiosApi
    .get(url, { params: config, headers: authHeader() })
    .then(response => response);
}

export async function patch(url, data, config = {}) {
  return await axiosApi
    .patch(url, { ...data }, { ...config, headers: authHeader() })
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
    .then(response => response);
}

export async function del(url, config = {}) {
  return await axiosApi
    .delete(url, { ...config, headers: authHeader() })
    .then(response => response);
}

const handleError = error => {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        deleteSession();
        store.dispatch(signOutSuccess());
        return Promise.reject(error);
      case 500:
        window.location.href = '/pages-500';
        return Promise.reject(error);

      default:
        return Promise.reject(error);
    }
  } else {
    return Promise.reject(error);
  }
};
export function isSuccessResp(status) {
  //2xx Status Codes [Success]
  if (status >= 200 && status <= 299) {
    return true;
  }
  return false;
}

function isWhitelisted(url) {
  // Check if any part of url includes a whitelisted URL. Some URLs
  // have user/layer specific data, but we still want that to match.
  // e.g. does the whitelisted`/data/layers/metadata/` exist in url
  // paramter `/api/data/layers/metadata/123/abc`
  return !!whitelistedUrls.find(whitelisted => url.includes(whitelisted));
}
