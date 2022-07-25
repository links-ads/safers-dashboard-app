import * as actionTypes from './types';
import { endpoints } from '../../api/endpoints';
import * as api from '../../api/base';

export const getAllPeople = (options) => async (dispatch) => {
  const response = await api.get(endpoints.chatbot.people.getAll, options);
  if (response.status === 200) {
    return dispatch(getPeopleSuccess(response.data));
  }
  else
    return dispatch(getPeopleFail(response.error));
};
const getPeopleSuccess = (alerts) => {
  return {
    type: actionTypes.GET_PEOPLE_SUCCESS,
    payload: alerts
  };
};
const getPeopleFail = (error) => {
  return {
    type: actionTypes.GET_PEOPLE_FAIL,
    payload: error
  };
};

export const setFilterdPeople = (payload) => async (dispatch) => {
  return dispatch(setFilters(payload));
};

const setFilters = (payload) => {
  return {
    type: actionTypes.SET_PEOPLE_FILTERS,
    payload: payload
  };
}

export const setFavorite = (alertId, isFavorite) => async (dispatch) => {
  const response = await api.post(endpoints.eventAlerts.setFavorite, { alert_id: alertId, is_favorite: isFavorite });
  if (response.status === 200) {
    return dispatch(setFavoriteSuccess(response.data));
  }
  else
    return dispatch(setFavoriteFail(response.error));
};
const setFavoriteSuccess = (msg) => {
  return {
    type: actionTypes.SET_FAV_PEOPLE_SUCCESS,
    msg,
  };
};
const setFavoriteFail = (error) => {
  return {
    type: actionTypes.SET_FAV_PEOPLE_FAIL,
    payload: error
  };
}

export const resetPeopleResponseState = () => {
  return {
    type: actionTypes.RESET_PEOPLE_STATE,
  }
};

export const getPeopleDetail = (id) => async (dispatch) => {
  const response = await api.get(endpoints.chatbot.people.getPeopleInfo.replace(':people_id', id));
  if (response.status === 200) {
    return dispatch(getPeopleDetailSuccess(response.data));
  }
  else
    return dispatch(getPeopleDetailFail(response.error));
}

const getPeopleDetailSuccess = (alerts) => {
  return {
    type: actionTypes.GET_PEOPLE_DETAIL_SUCCESS,
    payload: alerts
  };
};
const getPeopleDetailFail = (error) => {
  return {
    type: actionTypes.GET_PEOPLE_DETAIL_FAIL,
    payload: error
  };
};
