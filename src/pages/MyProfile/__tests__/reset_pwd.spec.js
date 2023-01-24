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
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import axiosMock from '../../../../__mocks__/axios';
import { USERS } from '../../../../__mocks__/user';
import { endpoints } from '../../../api/endpoints';
import store from '../../../store';
import { signInSuccess } from '../../../store/authentication/action';
import { baseURL } from '../../../TestUtils';
import ResetPsw from '../ResetPsw';

describe('Test Update Profile Component', () => {
  function renderApp(props = {}) {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <ResetPsw {...props} />
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
    mock.onGet(`${baseURL}${endpoints.user.resetPsw}`).reply(200, USERS);
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

  it('sets initial fields to be empty', () => {
    expect(screen.getByTestId('old_password')).toHaveValue('');
    expect(screen.getByTestId('new_password')).toHaveValue('');
    expect(screen.getByTestId('confirm_password')).toHaveValue('');
  });

  it('validates wrong password', async () => {
    act(() => {
      fireEvent.change(screen.getByTestId('new_password'), {
        target: { value: 'john' },
      });
    });
    await waitFor(() => {
      expect(screen.getByTestId('change-password')).toHaveTextContent(
        'Uppercase letter',
      );
      expect(screen.getByTestId('change-password')).toHaveTextContent(
        'Must contain number',
      );
      expect(screen.getByTestId('change-password')).toHaveTextContent(
        'characters long',
      );
    });
  });

  test('validates old password is required form will not submit', async () => {
    fireEvent.click(screen.getByRole('button', { name: 'CHANGE PASSWORD' }));

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'CHANGE PASSWORD' }),
      ).not.toBeDisabled(),
    );

    await waitFor(() => {
      expect(screen.getByTestId('change-password')).toHaveTextContent(
        'The field cannot be empty',
      );
    });
  });
});
