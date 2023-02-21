/* eslint-disable no-unused-vars */
import React from 'react';

import { USERS } from 'mockData/auth';
import { act, fireEvent, render, screen, waitFor } from 'test-utils';

import SignIn from '../SignIn';

xdescribe('Sign In Component', () => {
  const renderApp = (props = {}, state = {}) => {
    return render(<SignIn {...props} />, { state });
  };

  describe('Form testing', () => {
    beforeEach(() => {
      renderApp();
    });

    test('Should render correctly', () => {
      expect(screen).not.toBeNull();
    });

    test('Fields should be empty initially', () => {
      const emailInput = screen.getByTestId('sign-in-email');
      expect(emailInput).toHaveValue('');
      const passwordInput = screen.getByPlaceholderText('password');
      expect(passwordInput).toHaveValue('');
      const passwordToggleInput = screen.getByTestId('password-toggle');
      expect(passwordToggleInput).toHaveClass('fa-eye');
      const rememberMe = screen.getByTestId('rememberMe');
      expect(rememberMe).not.toBeChecked();
    });

    test('Click Toggle password should have change icon', async () => {
      act(() => {
        fireEvent.click(screen.getByTestId('password-toggle'));
      });

      let passwordToggleInput = screen.getByTestId('password-toggle');
      expect(passwordToggleInput).toHaveClass('fa-eye-slash');
    });

    test('Click Remember me to should set remember me to checked', async () => {
      act(() => {
        fireEvent.click(screen.getByTestId('rememberMe'));
      });

      await waitFor(() =>
        expect(screen.getByTestId('rememberMe')).toBeChecked(),
      );
      act(() => {
        fireEvent.click(screen.getByTestId('rememberMe'));
      });
    });
  });

  describe('Test Sign In', () => {
    let store = null;
    beforeEach(() => {
      const utils = renderApp();
      store = utils.store;
    });

    it('rejects empty values validation', async () => {
      act(() => {
        fireEvent.click(screen.getByRole('button', { name: /SIGN IN/i }));
      });

      await waitFor(() => {
        expect(screen.getAllByText(/The field cannot be empty/i)).toHaveLength(
          2,
        );
      });
    });

    it('signs in user correctly', async () => {
      act(() => {
        fireEvent.change(
          screen.getByRole('textbox', { name: 'EMAIL ADDRESS:' }),
          { target: { value: 'test@gmail.com' } },
        );
        fireEvent.change(screen.getByPlaceholderText('password'), {
          target: { value: '12345' },
        });
      });

      act(() => {
        fireEvent.click(screen.getByRole('button', { name: /SIGN IN/i }));
      });

      await waitFor(async () => {
        expect(screen.getByPlaceholderText('password')).toHaveValue('12345');
      });

      //check store sign in
      await waitFor(async () => {
        expect(store.getState().auth.user).toEqual(USERS.user);
        expect(store.getState().auth.isLoggedIn).toEqual(true);
      });
    });
  });
});
