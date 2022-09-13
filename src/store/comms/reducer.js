import * as actionTypes from './types';
import { updateObject } from '../utility';
import { getFilteredRec } from '../../pages/Chatbot/filter';

const initialState = {
  allComms: [],
  sortByDate: 'desc',
  alertSource: 'all',
  error: false,
  success: null,
  filteredComms: null,
  msgCreated: null
};

const commsReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.GET_COMMS_SUCCESS: return getCommsSuccess(state, action);
  case actionTypes.GET_COMMS_FAIL: return getCommsFail(state, action);
  case actionTypes.SET_COMMS_FILTERS: return setFilters(state, action);
  case actionTypes.RESET_COMMS_STATE: return resetCommsResponseState(state, action);
  case actionTypes.CREATE_MSG_SUCCESS: return createMsgSuccess(state, action);
  case actionTypes.CREATE_MSG_FAIL: return createMsgFail(state, action);
  default:
    return state;
  }
};

const createMsgSuccess = (state, action) => {
  const updatedState = {
    msgCreated: action.payload,
    error: false,
  }
  return updateObject(state, updatedState);
}

const createMsgFail = (state) => {
  const updatedState = {
    error: true,
  }
  return updateObject(state, updatedState);
}

const getCommsSuccess = (state, action) => {
  const {target, status, sortOrder} = action.feFilters;
  const filters = {target, status};
  const sort = {fieldName: 'start', order: sortOrder};
  const filteredComms = getFilteredRec(action.payload, filters, sort);
  const updatedState = {
    filteredComms,
    allComms: action.payload,
    error: false,
  }
  return updateObject(state, updatedState);
}

const getCommsFail = (state) => {
  const updatedState = {
    error: true,
  }
  return updateObject(state, updatedState);
}

const setFilters = (state, action) => {
  const updatedState = {
    filteredComms: action.payload,
    error: false,
  }
  return updateObject(state, updatedState);
}

const resetCommsResponseState = (state) => {
  const updatedState = {
    error: false,
    msgCreated: null,
    success: null
  }
  return updateObject(state, updatedState);
} 

export default commsReducer;
