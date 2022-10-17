import * as actionTypes from './types';
import { endpoints } from '../../api/endpoints';
import * as api from '../../api/base';


export const createMsg = (payload) => async (dispatch) => {
  const response = await api.post(endpoints.chatbot.comms.createMsg, payload);

  if (response.status === 200) {
    return dispatch(createMsgSuccess(response.data));
  }
  else
    return dispatch(createMsgFail(response.error));
};
const createMsgSuccess = (data) => {
  return {
    type: actionTypes.CREATE_MSG_SUCCESS,
    payload: data,
  };
};
const createMsgFail = (error) => {
  return {
    type: actionTypes.CREATE_MSG_FAIL,
    payload: error
  };
};
export const getAllComms = (options, feFilters=null, calledFromPage=false) => async (dispatch) => {
  const response = await api.get(endpoints.chatbot.comms.getAll, options);
  if (response.status === 200) {
    let data = response.data;
    if(!calledFromPage){
      data = [{'id':'68','name':'Communication 68','status':'Expired','target':'Professional','start':'2022-09-26T00:00:00Z','end':'2022-09-27T00:00:00Z','source':'Chatbot','message':'Test 26/09/22','source_organization':'Test Organization','target_organizations':[],'geometry':{'type':'Point','coordinates':[9.167399877601,41.856605070376]},'location':[9.167399877601236,41.85660507037579]},{'id':'36','name':'Communication 36','status':'Expired','target':'Public','start':'2022-08-28T00:00:00Z','end':'2022-08-31T00:00:00Z','source':'Chatbot','message':'This is a public communication. Read me via the Chatbot!','source_organization':'Test Organization','target_organizations':[],'geometry':{'type':'Point','coordinates':[9.025506,42.358615]},'location':[9.025506,42.358615]},{'id':'99','name':'Communication 68','status':'Expired','target':'Professional','start':'2022-09-26T00:00:00Z','end':'2022-09-27T00:00:00Z','source':'Chatbot','message':'Test 26/09/22','source_organization':'Test Organization','target_organizations':[],'geometry':{'type':'Point','coordinates':[9.167399877601,41.856605070376]},'location':[9.167399877601236,41.85660507037579]}];
    }
    return dispatch(getCommsSuccess(data, feFilters, calledFromPage));
  }
  else
    return dispatch(getCommsFail(response.error));
};
const getCommsSuccess = (alerts, feFilters, calledFromPage) => {
  return {
    type: actionTypes.GET_COMMS_SUCCESS,
    payload: { 
      alerts,
      feFilters,
      calledFromPage
    }
  };
};
const getCommsFail = (error) => {
  return {
    type: actionTypes.GET_COMMS_FAIL,
    payload: error
  };
};

export const setFilterdComms = (payload) => async (dispatch) => {
  return dispatch(setFilters(payload));
};

const setFilters = (payload) => {
  return {
    type: actionTypes.SET_COMMS_FILTERS,
    payload: payload
  };
}

export const refreshData = (payload) => {
  return {
    type: actionTypes.REFRESH_MSG,
    payload: payload
  };
}

export const resetCommsResponseState = () => {
  return {
    type: actionTypes.RESET_COMMS_STATE,
  }
};


