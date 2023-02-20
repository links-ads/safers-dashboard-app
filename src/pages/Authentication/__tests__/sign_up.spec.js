/* eslint-disable init-declarations */
import React from 'react';

import { act, fireEvent, render, screen, waitFor, userEvent } from 'test-utils';

import { USERS } from '../../../../__mocks__/auth';
import store from '../../../store';
import SignUp from '../SignUp';

xdescribe('Sign Up Component', () => {
  const renderApp = (props = {}, state = {}) => {
    render(<SignUp {...props} />, { state });
  };

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
