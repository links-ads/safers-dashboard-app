import MockAdapter from 'axios-mock-adapter';
import { axiosInstance } from '../src/api/base';

const axiosMock = new MockAdapter(axiosInstance)

export default axiosMock