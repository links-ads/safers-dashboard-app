import axios from 'axios';
import storage from 'redux-persist/lib/storage/session';

import { signOutSuccess } from 'store/authentication.slice';
import { setLoading } from 'store/common.slice';

import { endpoints } from './endpoints';
import { BASE_URL } from '../config';
import { deleteSession, getSession } from '../helpers/authHelper';
export const API_PREFIX = 'api';

const axiosApi = axios.create({
  baseURL: `${BASE_URL}/${API_PREFIX}`,
});

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

export const setupInterceptors = store => {
  axiosApi.interceptors.request.use(
    async config => {
      const isPermitted = isWhitelisted(config.url);
      if (!isPermitted || (isPermitted && config.method === 'post')) {
        store.dispatch(setLoading({ status: true, message: 'Please wait..' }));
      }

      const session = getSession();
      if (session) {
        // Add auth header for bearer token
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  axiosApi.interceptors.response.use(
    response => {
      store.dispatch(setLoading({ status: false }));
      return response;
    },
    error => {
      store.dispatch(setLoading({ status: false }));
      return handleError(error, store);
    },
  );
};

export const axiosInstance = axiosApi;

export async function getCustom(url, config) {
  return await axios({
    method: 'get',
    url,
    ...config,
  }).then(response => response);
}

export async function get(url, config = {}) {
  return await axiosApi.get(url, { params: config }).then(response => response);
}

export async function patch(url, data, config = {}) {
  return await axiosApi
    .patch(url, { ...data }, { ...config })
    .then(response => response)
    .catch(error => error.response);
}

export async function post(url, data, config = {}) {
  return axiosApi
    .post(url, { ...data }, { ...config })
    .then(response => response)
    .catch(error => error.response);
}

export async function put(url, data, config = {}) {
  return axiosApi
    .put(url, { ...data }, { ...config })
    .then(response => response);
}

export async function del(url, config = {}) {
  return await axiosApi.delete(url, { ...config }).then(response => response);
}

const handleError = (error, store) => {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        deleteSession();
        storage.removeItem('persist:root');
        store.dispatch(signOutSuccess());
        window.location.href = '/auth/sign-in';
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
