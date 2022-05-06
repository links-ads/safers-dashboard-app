import * as actionTypes from './types';
import { endpoints } from '../../api/endpoints';
import * as api from '../../api/base';

export const getAllNotifications = (options) => async (dispatch) => {
  const response = await api.get(endpoints.notifications.getAll, options);
  if (response.status === 200) {
    return dispatch(getNotificationsSuccess(response.data));
  }
  else
    return dispatch(getNotificationsFail(response.error));
};
const getNotificationsSuccess = (alerts) => {
  return {
    type: actionTypes.GET_NOTIFICATIONS_SUCCESS,
    payload: alerts
  };
};
const getNotificationsFail = (error) => {
  return {
    type: actionTypes.GET_NOTIFICATIONS_FAIL,
    payload: error
  };
};

export const setFilterdNotifications = (payload) => {
  return {
    type: actionTypes.SET_FILTERED_NOTIFICATIONS,
    payload,
  };
};
export const setPaginatedNotifications = (payload) => {
  return {
    type: actionTypes.SET_PAGINATED_NOTIFICATIONS,
    payload,
  };
};
export const setCurrentNotificationPage = (payload) => {
  return {
    type: actionTypes.SET_CURRENT_NOTIFICATIONS_PAGE,
    payload,
  };
};
export const setNotificationSortByDate = (payload) => {
  return {
    type: actionTypes.SET_NOTIFICATION_SORT_BY_DATE,
    payload,
  };
};
export const setNotificationSource = (payload) => {
  return {
    type: actionTypes.SET_NOTIFICATION_SOURCE,
    payload,
  };
};
export const setNotificationDateRange = (payload) => {
  return {
    type: actionTypes.SET_NOTIFICATION_DATE_RANGE,
    payload,
  };
};