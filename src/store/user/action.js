import * as actionTypes from './types';
import { endpoints } from '../../api/endpoints';
import * as api from '../../api/base';


export const setDefaultAoi = (uid, { aoiId, objAoi }) => async (dispatch) => {
  const endpoint = endpoints.user.profile + uid;
  const response = await api.patch(endpoint, { default_aoi: aoiId });
  if (response.status === 200) {
    return dispatch(setAoiSuccess(objAoi, response.data));
  }
  else
    return dispatch(setAoiFail(response.error));
};
const setAoiSuccess = (aoi, msg) => {
  return {
    type: actionTypes.SET_AOI_SUCCESS,
    msg,
    payload: aoi
  };
};

const setAoiFail = (error) => {
  return {
    type: actionTypes.SET_AOI_FAIL,
    payload: error
  };
};




