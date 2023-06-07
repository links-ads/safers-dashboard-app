import { OK } from 'api/constants';

import * as api from '../api/base';

export const fetchEndpoint = async url => {
  const response = await api.get(url);
  if (response.status === OK) return response.data;
  else return [];
};
