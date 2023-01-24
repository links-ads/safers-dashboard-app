/* eslint-disable init-declarations */
import React from 'react';

import '@testing-library/jest-dom/extend-expect';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import _ from 'lodash';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { USERS as authUser } from '../../../../__mocks__/auth';
import axiosMock from '../../../../__mocks__/axios';
import { ORGS, ROLES } from '../../../../__mocks__/common';
import { LOGOUT, UPDATED_USER_INFO, USERS } from '../../../../__mocks__/user';
import { endpoints } from '../../../api/endpoints';
import store from '../../../store';
import { signInSuccess } from '../../../store/authentication/action';
import { baseURL } from '../../../TestUtils';
import UpdateProfile from '../UpdateProfile';

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
    //set user in the store
    act(() => {
      store.dispatch(signInSuccess(USERS));
    });
    mock = axiosMock;
    mock.onGet(`${baseURL}${endpoints.common.organizations}`).reply(200, ORGS);
    mock.onGet(`${baseURL}${endpoints.common.roles}`).reply(200, ROLES);
    const uid = authUser.user.id;
    const getInfoUrl = endpoints.user.profile + uid;
    mock.onGet(`${baseURL}${getInfoUrl}`).reply(() => {
      return [200, USERS];
    });
    mock.onPatch(`${baseURL}${getInfoUrl}`).reply(() => {
      return [200, UPDATED_USER_INFO];
    });
    mock.onDelete(`${baseURL}${getInfoUrl}`).reply(() => {
      return [200, LOGOUT];
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
  afterAll(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    renderApp(store);
  });

  it('renders', () => {
    expect(screen).not.toBeNull();
  });

  it('displays user details', () => {
    const role = _.find(ROLES, { id: USERS.role });

    expect(
      screen.getByText(USERS.first_name, { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(USERS.last_name, { exact: false }),
    ).toBeInTheDocument();
    expect(screen.getByText(USERS.email, { exact: false })).toBeInTheDocument();
    expect(
      screen.getByText(USERS.address, { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(USERS.country, { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(role.name, { exact: false })[0],
    ).toBeInTheDocument();
  });

  test('updates user profile details', async () => {
    fireEvent.click(screen.getByRole('button', { name: 'UPDATE DETAILS' }));

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'UPDATE DETAILS' }),
      ).toBeDisabled(),
    );

    await waitFor(() => {
      expect(
        screen.getByText(UPDATED_USER_INFO.email, { exact: false }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(UPDATED_USER_INFO.first_name, { exact: false }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(UPDATED_USER_INFO.last_name, { exact: false }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(UPDATED_USER_INFO.address, { exact: false }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(UPDATED_USER_INFO.country, { exact: false }),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Updated your infomation', { exact: false }),
      ).toBeInTheDocument();
    });

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'UPDATE DETAILS' }),
      ).not.toBeDisabled(),
    );
  });

  test('delete account shows modal', async () => {
    fireEvent.click(screen.getByRole('button', { name: 'DELETE MY ACCOUNT' }));

    await waitFor(async () => {
      expect(
        screen.getByText('Warning!', { exact: false }),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Please confirm if you want to delete this account.', {
          exact: false,
        }),
      ).toBeInTheDocument();

      act(() => {
        fireEvent.click(screen.getByRole('button', { name: 'Yes' }));
      });
    });

    await waitFor(() => {
      expect(
        screen.getByText('Updated your infomation', { exact: false }),
      ).toBeInTheDocument();
    });
  });
});
