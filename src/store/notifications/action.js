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

export const setNotificationParams = (payload) => {
  console.log(payload)
  return {
    type: actionTypes.SET_NOTIFICATION_PARAMS,
    payload,
  };
};
export const resetNotificationApiParams = () => {
  return {
    type: actionTypes.RESET_NOTIFICATION_API_PARAMS,
  }
};

export const setNewNotificationState = (notificationState, pageState, newItemsCount) => {
  return {
    type: actionTypes.SET_NEW_NOTIFICATION_STATE,
    isNewNotification: notificationState,
    isPageActive: pageState,
    newItemsCount
  }
};