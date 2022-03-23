import { endpoints } from '../endpoints';
import * as api from '../base';

export const getAllFireAlerts = async () => {
  const response = await api.get(endpoints.fireAlerts.getAll);
  if (response.status === 200)
    return response.data
  else
    return [];
};
