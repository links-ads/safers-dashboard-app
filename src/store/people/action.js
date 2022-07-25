import * as actionTypes from './types';
import { endpoints } from '../../api/endpoints';
import * as api from '../../api/base';

export const getAllPeople = (options) => async (dispatch) => {
  // const response = await api.get(endpoints.chatbot.people.getAll, options);
  //To Do - remove this and use api.get when actual APIs are ready
  const custOption = {...options, baseURL: 'https://safers-dashboard-mock.herokuapp.com/api/',}
  const response = await api.getCustom(endpoints.chatbot.people.getAll, custOption);
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

export const resetPeopleResponseState = () => {
  return {
    type: actionTypes.RESET_PEOPLE_STATE,
  }
};
