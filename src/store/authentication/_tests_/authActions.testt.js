/* eslint-disable init-declarations */

import * as mockUser from '../../../mockData/mock_user';
import { mockStore } from '../../../TestUtils';
import { signIn } from '../action';
import { SIGN_IN_SUCCESS } from '../types';

global.fetch = require('jest-fetch-mock');

describe('Sign in user', () => {
  let store;
  let actions;
  let request = {
    username: 'mmb.221177@gmail.com',
    password: '1234',
    rememberMe: false,
  };

  beforeEach(() => {
    store = mockStore({
      users: {},
    });
    request = {
      username: 'mmb.221177@gmail.com',
      password: '1234',
      rememberMe: false,
    };
    fetch.resetMocks();
  });

  it('check action for sign in user - Success Scenario', () => {
    fetch.mockResponse(JSON.stringify(mockUser.SUCCESS_FETCH_USER));

    const authInitialState = {};
    const initialState = { authInitialState };
    store = mockStore(initialState);

    const expectedActions = [SIGN_IN_SUCCESS];

    store.dispatch(signIn(request)).then(() => {
      actions = store.getActions();
      expect(actions).toEqual(expectedActions);
    });
  });
});
