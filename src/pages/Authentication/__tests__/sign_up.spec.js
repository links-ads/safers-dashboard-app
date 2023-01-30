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
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { USERS } from '../../../../__mocks__/auth';
import axiosMock from '../../../../__mocks__/axios';
import { ORGS, ROLES } from '../../../../__mocks__/common';
import { endpoints } from '../../../api/endpoints';
import store from '../../../store';
import { baseURL } from '../../../TestUtils';
import SignUp from '../SignUp';

describe('Sign Up Component', () => {
  function renderApp(props = {}) {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <SignUp {...props} />
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
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('Form testing', () => {
    beforeEach(() => {
      renderApp(store);
    });
    test('Should render correctly', () => {
      expect(screen).not.toBeNull();
    });
    test('Fields should be empty initially', () => {
      expect(screen.getByTestId('sign-up-email')).toHaveValue('');
      expect(screen.getByTestId('sign-up-firstName')).toHaveValue('');
      expect(screen.getByTestId('sign-up-lastName')).toHaveValue('');
      expect(screen.getByTestId('sign-up-role')).toHaveValue('');
      expect(screen.getByTestId('sign-up-org')).toHaveValue('');
      expect(screen.getByTestId('sign-up-password')).toHaveValue('');
      expect(screen.getByTestId('sign-up-password-toggle')).toHaveClass(
        'fa-eye',
      );
      expect(
        screen.getByTestId('sign-up-agreeTermsConditions'),
      ).not.toBeChecked();
    });

    test('Click Toggle password should have change icon', async () => {
      act(() => {
        fireEvent.click(screen.getByTestId('sign-up-password-toggle'));
      });
      let passwordToggleInput = screen.getByTestId('sign-up-password-toggle');
      expect(passwordToggleInput).toHaveClass('fa-eye-slash');
    });
    test('Click Agree to terms and conditions to should set remember me to checked', async () => {
      act(() => {
        fireEvent.click(screen.getByTestId('sign-up-agreeTermsConditions'));
      });
      await waitFor(() => {
        expect(
          screen.getByTestId('sign-up-agreeTermsConditions'),
        ).toBeChecked();
      });
    });
  });
  describe('sign up action', () => {
    beforeAll(() => {
      mock = axiosMock;
      mock
        .onPost(`${baseURL}${endpoints.authentication.signUp}`)
        .reply(200, USERS);
    });
    beforeEach(() => {
      renderApp(store);
    });
    it('signs up user correctly', async () => {
      //arrange
      act(() => {
        fireEvent.change(screen.getByTestId('sign-up-email'), {
          target: { value: 'test@gmail.com' },
        });
        fireEvent.change(screen.getByTestId('sign-up-firstName'), {
          target: { value: 'john' },
        });
        fireEvent.change(screen.getByTestId('sign-up-lastName'), {
          target: { value: 'doe' },
        });
        userEvent.selectOptions(
          screen.getByTestId('sign-up-role'),
          'e38000a4-e121-427c-94f0-0330741a5a16',
        );
        userEvent.selectOptions(
          screen.getByTestId('sign-up-org'),
          '92604bfd-856a-468e-93d1-0f146650805e',
        );
        fireEvent.change(screen.getByTestId('sign-up-password'), {
          target: { value: 'HelloWorld12' },
        });
        fireEvent.click(screen.getByTestId('sign-up-agreeTermsConditions'));
      });
      //act
      act(() => {
        fireEvent.click(screen.getByRole('button', { name: /SIGN UP/i }));
      });
      //assert
      await waitFor(async () => {
        expect(store.getState().auth.user).toEqual(USERS.user);
        expect(store.getState().auth.isLoggedIn).toEqual(true);
      });
    });
  });
});
