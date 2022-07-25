import * as actionTypes from './types';
import { updateObject } from '../utility';

const initialState = {
  allPeople: [],
  sortByDate: 'desc',
  alertSource: 'all',
  error: false,
  success: null,
  filteredPeople: null,
  peopleDetail: null
};

const peopleReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.GET_PEOPLE_SUCCESS: return getPeopleSuccess(state, action);
  case actionTypes.GET_PEOPLE_FAIL: return getPeopleFail(state, action);
  case actionTypes.SET_FAV_PEOPLE_SUCCESS: return setFavoriteSuccess(state, action);
  case actionTypes.SET_FAV_PEOPLE_FAIL: return setFavoriteFail(state, action);
  case actionTypes.RESET_PEOPLE_STATE: return resetPeopleResponseState(state, action);
  case actionTypes.SET_PEOPLE_FILTERS: return setFilters(state, action);
  case actionTypes.GET_PEOPLE_DETAIL_SUCCESS: return getPeopleDetailSuccess(state, action);
  case actionTypes.GET_PEOPLE_DETAIL_FAIL: return getPeopleDetailFail(state, action);
  default:
    return state;
  }
};

const getPeopleDetailSuccess = (state, action) => {
  const updatedState = {
    peopleDetail: action.payload,
    error: false,
  }
  return updateObject(state, updatedState);
}

const getPeopleDetailFail = (state) => {
  const updatedState = {
    error: true,
  }
  return updateObject(state, updatedState);
}

const getPeopleSuccess = (state, action) => {
  const updatedState = {
    allPeople: action.payload,
    error: false,
  }
  return updateObject(state, updatedState);
}

const setFilters = (state, action) => {
  const updatedState = {
    filteredPeople: action.payload,
    error: false,
  }
  return updateObject(state, updatedState);
}

const getPeopleFail = (state) => {
  const updatedState = {
    error: true,
  }
  return updateObject(state, updatedState);
}

const setFavoriteSuccess = (state, action) => {
  const updatedState = {
    success: action.msg,
    error: false,
  }
  return updateObject(state, updatedState);
}
const setFavoriteFail = (state) => {
  const updatedState = {
    error: true,
  }
  return updateObject(state, updatedState);
}

const resetPeopleResponseState = (state) => {
  const updatedState = {
    error: false,
    success: null
  }
  return updateObject(state, updatedState);
}

export default peopleReducer;
