import * as actionTypes from './types';
import { endpoints } from '../../api/endpoints';
import * as api from '../../api/base';

export const setDefaultAoi = ({aoi}) => async (dispatch) => {
  const response = await api.get(endpoints.user.setDefaultAoi, { aoi });//should be post with the backend
  if (response.status === 200) {
    return dispatch(signInSuccess(response.data?.aoi));
  }
  else
    return dispatch(signInFail(response.error));
};
const signInSuccess = (aoi) => {
  return {
    type: actionTypes.SET_AOI_SUCCESS,
    payload: aoi
  };
};

const signInFail = (error) => {
  return {
    type: actionTypes.SET_AOI_FAIL,
    payload: error
  };
};




