import * as actionTypes from './types';
import { endpoints } from '../../api/endpoints';
import * as api from '../../api/base';

export const getOrgaList = () => async (dispatch) => {
  const response = await api.get(endpoints.common.organizations);
  if (response.status === 200) {
    return dispatch(getOrgListSuccess(response.data));
  }
  else
    return dispatch(getOrgListFail(response.data));
};
const getOrgListSuccess = (user) => {
  return {
    type: actionTypes.CM_GET_ORGLIST_SUCCESS,
    payload: user
  };
};
const getOrgListFail = (error) => {
  return {
    type: actionTypes.CM_GET_ORGLIST_FAIL,
    payload: error
  };
};
