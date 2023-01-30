import * as actionTypes from './types';
import * as api from '../../api/base';
import { endpoints } from '../../api/endpoints';

export const getAllNotifications = options => async dispatch => {
  const response = await api.get(endpoints.notifications.getAll, options);
  if (response.status === 200) {
    return dispatch(getNotificationsSuccess(response.data));
  } else return dispatch(getNotificationsFail(response.error));
};
const getNotificationsSuccess = alerts => {
  return {
    type: actionTypes.GET_NOTIFICATIONS_SUCCESS,
    payload: alerts,
  };
};
const getNotificationsFail = error => {
  return {
    type: actionTypes.GET_NOTIFICATIONS_FAIL,
    payload: error,
  };
};
export const getAllNotificationSources = options => async dispatch => {
  const response = await api.get(endpoints.notifications.sources, options);
  if (response.status === 200) {
    return dispatch(getNotificationSourcesSuccess(response.data));
  } else return dispatch(getNotificationSourcesFail(response.error));
};
const getNotificationSourcesSuccess = sources => {
  return {
    type: actionTypes.GET_NOTIFICATION_SOURCES_SUCCESS,
    payload: sources,
  };
};
const getNotificationSourcesFail = error => {
  return {
    type: actionTypes.GET_NOTIFICATIONS_SOURCES_FAIL,
    payload: error,
  };
};
export const getAllNotificationScopesRestrictions =
  options => async dispatch => {
    const response = await api.get(
      endpoints.notifications.scopesRestrictions,
      options,
    );
    if (response.status === 200) {
      return dispatch(getNotificationScopesRestrictionsSuccess(response.data));
    } else
      return dispatch(getNotificationScopesRestrictionsFail(response.error));
  };
const getNotificationScopesRestrictionsSuccess = sources => {
  return {
    type: actionTypes.GET_NOTIFICATION_SCOPES_RESTRICTIONS_SUCCESS,
    payload: sources,
  };
};
const getNotificationScopesRestrictionsFail = error => {
  return {
    type: actionTypes.GET_NOTIFICATION_SCOPES_RESTRICTIONS_FAIL,
    payload: error,
  };
};
export const setNotificationParams = payload => {
  return {
    type: actionTypes.SET_NOTIFICATION_PARAMS,
    payload,
  };
};
export const resetNotificationApiParams = () => {
  return {
    type: actionTypes.RESET_NOTIFICATION_API_PARAMS,
  };
};

export const setNewNotificationState = (
  notificationState,
  pageState,
  newItemsCount,
) => {
  return {
    type: actionTypes.SET_NEW_NOTIFICATION_STATE,
    isNewNotification: notificationState,
    isPageActive: pageState,
    newItemsCount,
  };
};
