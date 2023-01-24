import * as api from '../api/base';

export const fetchEndpoint = async url => {
  const response = await api.get(url);
  if (response.status === 200) return response.data;
  else return [];
};
