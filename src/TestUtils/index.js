import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { API_PREFIX } from '../api/base';
import { BASE_URL } from '../config';

const middlewares = [thunk];
export const mockStore = configureMockStore(middlewares);

export const baseURL = `${BASE_URL}/${API_PREFIX}`

export const mockedNavigator = jest.fn();
export const mockedHref = jest.fn();
export const mockedSelector = jest.fn();
export const mockedDispatch = jest.fn();