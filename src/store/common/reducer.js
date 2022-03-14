import * as actionTypes from './types';
import { updateObject } from '../utility';

const initialState = {
  // orgList: []
  orgList: [
    {
      'id': '136eaf6a-95d1-40dd-93ed-97017109c530',
      'name': 'PCF - Pau Costa Foundation',
      'description': ''
    },
    {
      'id': '45702a9f-cd4b-44db-a599-7ccc1e0be110',
      'name': 'HRT - Hellenic Rescue Team',
      'description': ''
    },
    {
      'id': '8ed85a12-d8f1-4e4f-ba41-a5880ac97ac3',
      'name': 'HMOD - Hellenic Republic Ministry of National Defence',
      'description': ''
    },
    {
      'id': '92604bfd-856a-468e-93d1-0f146650805e',
      'name': 'SIS2B - Service d',
      'description': ''
    },
    {
      'id': 'c6133d6f-ff1d-4beb-bad5-87e7d61ee2b2',
      'name': 'CSI - Consorzio per il Sistema Informativo',
      'description': ''
    },
    {
      'id': 'f4e84ec4-2b1f-4521-aaa5-215a923ce97c',
      'name': 'CIMA - Fondazione CIMA',
      'description': ''
    }
  ]

};

const commonReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.CM_GET_ORGLIST_SUCCESS: return getOrgListSuccess(state, action);
  case actionTypes.CM_GET_ORGLIST_FAIL: return getOrgListFail(state, action);
  default:
    return state;
  }
};

const getOrgListSuccess = (state, action) => {
  const updatedState = {
    orgList: action.payload,
    error: false,
  }
  return updateObject(state, updatedState);
}

const getOrgListFail = (state) => {
  const updatedState = {
    error: true,
  }
  return updateObject(state, updatedState);
}

export default commonReducer;
