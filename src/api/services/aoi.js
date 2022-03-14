import { endpoints } from '../endpoints';
import * as api from '../base';

export const getAllAreas = async () => {
  const response = await api.get(endpoints.aoi.getAll);
  if (response.status === 200)
    return response.data
  else
    return [];
};