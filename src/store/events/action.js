import queryString from 'query-string';

import * as actionTypes from './types';
import * as api from '../../api/base';
import { endpoints } from '../../api/endpoints';
import { InProgress } from '../authentication/action';

export const getAllEventAlerts =
  (options, fromPage, isLoading = false) =>
  async dispatch => {
    if (isLoading) {
      dispatch(InProgress(true, 'Loading..'));
    }
    const response = await api.get(
      endpoints.eventAlerts.getAll.concat('?', queryString.stringify(options)),
    );
    if (response && response?.status === 200) {
      if (isLoading) {
        dispatch(InProgress(false));
      }
      fromPage && dispatch(setFilteredEventAlerts(response?.data));
      return dispatch(getEventAlertsSuccess(response?.data));
    } else {
      if (isLoading) {
        dispatch(InProgress(false));
      }
      return dispatch(getEventAlertsFail(response?.error));
    }
  };

const getEventAlertsSuccess = alerts => {
  return {
    type: actionTypes.GET_EVENT_ALERTS_SUCCESS,
    payload: alerts,
  };
};

export const setFilteredEventAlerts = alerts => {
  return {
    type: actionTypes.SET_FILTERED_EVENT_ALERTS,
    payload: alerts,
  };
};

const getEventAlertsFail = error => {
  return {
    type: actionTypes.GET_EVENT_ALERTS_FAIL,
    payload: error,
  };
};

export const setEventFavoriteAlert =
  (alertId, isFavorite) => async dispatch => {
    const response = await api.post(
      endpoints.eventAlerts.setFavorite.replace(':event_id', alertId),
      { is_favorite: isFavorite },
    );
    if (response.status === 200) {
      const successMessage = `Successfully ${
        isFavorite ? 'added to' : 'removed from'
      } the favorite list`;
      return dispatch(setEventFavoriteAlertSuccess(successMessage));
    } else {
      return dispatch(setEventFavoriteAlertFail(response?.data?.[0]));
    }
  };

const setEventFavoriteAlertSuccess = msg => {
  return {
    type: actionTypes.SET_FAV_EVENT_ALERT_SUCCESS,
    msg,
  };
};

const setEventFavoriteAlertFail = error => {
  return {
    type: actionTypes.SET_FAV_EVENT_ALERT_FAIL,
    payload: error,
  };
};

export const validateEventAlert = alertId => async dispatch => {
  const response = await api.post(endpoints.eventAlerts.validate, {
    alert_id: alertId,
  });
  if (response.status === 200) {
    return dispatch(validateEventAlertSuccess(response.data));
  } else return dispatch(validateEventAlertFail(response.error));
};

const validateEventAlertSuccess = msg => {
  return {
    type: actionTypes.EVENTS_CREATE_EVENT_ALERT_FAIL,
    msg,
  };
};

const validateEventAlertFail = error => {
  return {
    type: actionTypes.EVENTS_CREATE_EVENT_ALERT_FAIL,
    payload: error,
  };
};

export const editEventAlertInfo = (eventId, editInfo) => async dispatch => {
  const response = await api.patch(
    endpoints.eventAlerts.edit.replace(':event_id', eventId),
    editInfo,
  );
  dispatch(InProgress(true, 'Loading..'));
  if (response.status === 200) {
    dispatch(InProgress(false, 'Loading..'));
    let successMessage = 'Successfully updated the information';
    return dispatch(editEventAlertInfoSuccess(response.data, successMessage));
  } else {
    dispatch(InProgress(false, 'Loading..'));
    let failureMessage = 'Information update failed';
    return dispatch(editEventAlertInfoFail(response?.data || failureMessage));
  }
};

const editEventAlertInfoSuccess = (payload, message) => {
  return {
    type: actionTypes.EDIT_EVENT_ALERT_INFO_SUCCESS,
    payload,
    message,
  };
};

const editEventAlertInfoFail = error => {
  return {
    type: actionTypes.EDIT_EVENT_ALERT_INFO_FAIL,
    payload: error,
  };
};

export const getEventInfo = eventId => async dispatch => {
  const response = await api.get(
    endpoints.eventAlerts.getEvent.replace(':event_id', eventId),
  );
  dispatch(InProgress(true, 'Loading..'));
  if (response.status === 200) {
    dispatch(InProgress(false, 'Loading..'));
    return dispatch(getEventAlertInfoSuccess(response.data));
  } else {
    dispatch(InProgress(false, 'Loading..'));
    return dispatch(getEventAlertInfoFail(response.data));
  }
};

const getEventAlertInfoSuccess = payload => {
  return {
    type: actionTypes.GET_EVENT_SUCCESS,
    payload,
  };
};
const getEventAlertInfoFail = error => {
  return {
    type: actionTypes.GET_EVENT_FAIL,
    payload: error,
  };
};

export const resetEventAlertsResponseState = () => {
  return {
    type: actionTypes.RESET_EVENT_ALERT_STATE,
  };
};

export const setEventParams = payload => {
  return {
    type: actionTypes.SET_EVENT_PARAMS,
    payload,
  };
};

export const setNewEventState = (eventState, pageState, newItemsCount) => {
  return {
    type: actionTypes.SET_NEW_EVENT_STATE,
    isNewEvent: eventState,
    isPageActive: pageState,
    newItemsCount,
  };
};

export const getInSituMedia = params => async dispatch => {
  const response = await api.get(endpoints.eventAlerts.getInSitu, params);
  if (response.status === 200) {
    return dispatch(getInSituMediaSuccess(response.data));
  } else return dispatch(getInSituMediaFail(response.error));
};

const getInSituMediaSuccess = data => {
  return {
    type: actionTypes.EVENTS_IN_SITU_MEDIA_GET_SUCCESS,
    payload: data,
  };
};

const getInSituMediaFail = error => {
  return {
    type: actionTypes.EVENTS_IN_SITU_MEDIA_GET_FAIL,
    payload: error,
  };
};

export const getTweets = params => async dispatch => {
  const response = await api.get(endpoints.eventAlerts.getTweets, params);
  if (response.status === 200) {
    return dispatch(getTweetsSuccess(response.data));
  } else return dispatch(getTweetsFail(response.error));
};

const getTweetsSuccess = data => {
  return {
    type: actionTypes.EVENTS_TWEETS_GET_SUCCESS,
    payload: data,
  };
};

const getTweetsFail = error => {
  return {
    type: actionTypes.EVENTS_TWEETS_GET_FAIL,
    payload: error,
  };
};
