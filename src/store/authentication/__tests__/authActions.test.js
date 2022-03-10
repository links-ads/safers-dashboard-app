/* eslint-disable init-declarations */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as mockUser from '../../../mockData/mock_user';
import { signIn } from '../action';

global.fetch = require('jest-fetch-mock');

describe('Sign in user', () => {
  let newStore;
  let actions
  let request = {
    username : 'mmb.221177@gmail.com',
    password : '1234', 
    rememberMe : false};

  beforeEach(() => {
    request = {
      username : 'mmb.221177@gmail.com',
      password : '1234', 
      rememberMe : false};
    fetch.resetMocks();
  });

  afterEach(() => {
    request = null;
    actions = null;
    newStore = null;
  });

  it('check action for sign in user - Success Scenario', () => {
    fetch.mockResponse(JSON.stringify(mockUser.SUCCESS_FETCH_USER));

    const authInitialState = {};

    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);
    const initialState = { authInitialState };
    newStore = mockStore(initialState);

    const expectedActions = [
      mockUser.FETCH_USER_SUCCESS_ACTION,
    ];

    return newStore.dispatch(signIn(request)).then(() => {
      actions = newStore.getActions();
      expect(actions).toEqual(expectedActions);
    });
  });
  
});
