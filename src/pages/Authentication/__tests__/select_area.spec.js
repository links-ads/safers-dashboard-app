/* eslint-disable init-declarations */
import React from 'react';

import '@testing-library/jest-dom/extend-expect';

import { act, fireEvent, render, screen, waitFor } from 'test-utils';
import { mockedNavigator } from 'TestUtils';

import SelectArea from '../SelectArea';

xdescribe('Select Area Component', () => {
  const renderApp = (props = {}, state = {}) => {
    return render(<SelectArea {...props} />, { state });
  };

  beforeEach(() => {
    renderApp();
  });

  describe('redirect to sign in if not logged in', () => {
    it('should  navigate to a sign in page', () => {
      expect(mockedNavigator).toHaveBeenCalledWith('/auth/sign-in');
    });
  });

  describe('Test Select Aoi Component', () => {
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

      //calls dashboard
      await waitFor(() => {
        expect(mockedNavigator).toHaveBeenCalledWith('/dashboard');
      });
    });
  });
});
