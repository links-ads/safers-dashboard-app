/* eslint-disable init-declarations */
import React from 'react';

import '@testing-library/jest-dom/extend-expect';

import { USERS } from 'mockData/auth';
import { signInSuccess } from 'store/authentication/action';
import { act, fireEvent, render, screen, waitFor } from 'test-utils';
import { mockedNavigator } from 'TestUtils';

import SelectArea from '../SelectArea';

xdescribe('Select Area Component', () => {
  let mockStore = null;

  const renderApp = (props = {}, state = {}) => {
    return render(<SelectArea {...props} />, { state });
  };

  beforeEach(() => {
    const { store } = renderApp();
    mockStore = store;
  });

  describe('redirect to sign in if not logged in', () => {
    it('should  navigate to a sign in page', () => {
      expect(mockedNavigator).toHaveBeenCalledWith('/auth/sign-in');
    });
  });

  describe('Test Select Aoi Component', () => {
    beforeAll(() => {
      act(() => {
        mockStore.dispatch(signInSuccess(USERS.user));
      });
    });

    it('check if page is displaying', () => {
      expect(
        screen.getByText(/Choose your area of interest/i),
      ).toBeInTheDocument();
    });

    it('updates selected area of in interest in the store', async () => {
      act(() => {
        const radioInputs = screen.getAllByRole('radio');
        fireEvent.click(radioInputs[0]);
      });

      act(() => {
        fireEvent.click(
          screen.getByRole('button', { name: 'SAVE AREA OF INTEREST' }),
        );
      });

      await waitFor(() => {
        expect(mockStore.getState().user.aoiSetSuccess).not.toEqual(null);
      });

      //calls dashboard
      await waitFor(() => {
        expect(mockedNavigator).toHaveBeenCalledWith('/dashboard');
      });
    });
  });
});
