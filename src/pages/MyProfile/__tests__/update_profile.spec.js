/* eslint-disable init-declarations */
import React from 'react';

import _ from 'lodash';

import { act, fireEvent, render, screen, waitFor } from 'test-utils';

import { ROLES } from '../../../../__mocks__/common';
import { UPDATED_USER_INFO, USERS } from '../../../../__mocks__/user';
import UpdateProfile from '../UpdateProfile';

xdescribe('Test Update Profile Component', () => {
  function renderApp(props = {}, state = {}) {
    render(<UpdateProfile {...props} />, { state });
  }

  beforeEach(() => {
    renderApp();
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
