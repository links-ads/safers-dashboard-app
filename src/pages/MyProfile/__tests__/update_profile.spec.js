/* eslint-disable init-declarations */
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import store from '../../../store'
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import UpdateProfile from '../UpdateProfile';
import axiosMock from '../../../../__mocks__/axios';
import { baseURL } from '../../../TestUtils';
import { endpoints } from '../../../api/endpoints';
import { ORGS, ROLES } from '../../../../__mocks__/common';
import { USERS } from '../../../../__mocks__/auth';

describe('Test Update Profile Component', () => {
  function renderApp(props = {}) {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <UpdateProfile {...props} />
        </BrowserRouter>
      </Provider>,
    );
  }
  let mock;
  //mock all requests on page
  beforeAll(() => {
    mock = axiosMock;
    mock.onGet(`${baseURL}${endpoints.common.organizations}`).reply(200, ORGS);
    mock.onGet(`${baseURL}${endpoints.common.roles}`).reply(200, ROLES);
    const uid = USERS.user.id
    const getInfoUrl = endpoints.user.profile + uid;
    console.log(getInfoUrl);
    mock.onGet(`${baseURL}${getInfoUrl}`).reply(200, USERS);
  })

  afterEach(() => {
    jest.resetAllMocks();
  });
  afterAll(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    renderApp(store);
  })


  it('renders', () => {
    expect(screen).not.toBeNull()
  });
  
})