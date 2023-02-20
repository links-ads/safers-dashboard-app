/* eslint-disable init-declarations */
import React from 'react';

import { act, fireEvent, render, screen, waitFor } from 'test-utils';

import ResetPsw from '../ResetPsw';

xdescribe('Test Update Profile Component', () => {
  const renderApp = (props = {}, state = {}) => {
    return render(<ResetPsw {...props} />, { state });
  };

  beforeEach(() => {
    renderApp();
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
