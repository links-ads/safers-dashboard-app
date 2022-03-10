/* eslint-disable init-declarations */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as mockUser from '../../../mockData/mock_user';
import authReducer from '../reducer';
import { signInSuccess } from '../action';

describe('fetchUser Success ', () => {
  let action;
  let store;
  let newState;
  let request;

  afterEach(() => {
    request, action, newState, (store = null);
  });

  it('receive sign in success', async () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    request = mockUser.REQUEST_PAYLOAD;

    const initialState = {
      user: {},
      isLoggedIn: false,
      error: false,
      forgotPswresponse: null
      //loading: false
    };

    store = mockStore(initialState);
    action = signInSuccess(mockUser.SUCCESS_FETCH_USER);
    
    newState = await authReducer(store.getState(), action);
    expect(newState).toEqual(mockUser.SUCCESS_FETCH_USER_STATE);
  });
});
