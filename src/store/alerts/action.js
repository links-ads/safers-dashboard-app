import * as actionTypes from './types';
import { endpoints } from '../../api/endpoints';
import * as api from '../../api/base';

export const getAllFireAlerts = () => async (dispatch) => {
  const response = await api.get(endpoints.fireAlerts.getAll);
  if (response.status === 200) {
    return dispatch(getAlertsSuccess(response.data));
  }
  else
    return dispatch(getAlertsFail(response.error));
};

const getAlertsSuccess = (alerts) => {
  return {
    type: actionTypes.GET_ALERTS_SUCCESS,
    payload: alerts
  };
};

const getAlertsFail = (error) => {
  return {
    type: actionTypes.GET_ALERTS_FAIL,
    payload: error
  };
};




