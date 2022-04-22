/* eslint-disable init-declarations */
/* eslint-disable no-unused-vars */
import React from 'react';

import '@testing-library/jest-dom/extend-expect';

import SignIn from '../SignIn';
import { act, fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../../store'
import axiosMock from '../../../../__mocks__/axios';
import { baseURL } from '../../../TestUtils';
import { endpoints } from '../../../api/endpoints';
import { USERS } from '../../../../__mocks__/auth';

describe('Sign In Component', () => {
  
  function renderApp(props = {}) {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <SignIn {...props} />
        </BrowserRouter>
      </Provider>,
    );
  }

  describe('Form testing', () => {
    
    beforeEach(() => {
      renderApp(store);
    })
    afterEach(() => {
      jest.resetAllMocks();
    });
    afterAll(() => {
      jest.clearAllMocks();
    });

    test('Should render correctly', () => {
      expect(screen).not.toBeNull();
    })
    test('Fields should be empty initially', () => {
      const emailInput = screen.getByTestId('sign-in-email');
      expect(emailInput).toHaveValue('');
      const passwordInput = screen.getByPlaceholderText('password');
      expect(passwordInput).toHaveValue('');
      const passwordToggleInput = screen.getByTestId('password-toggle');
      expect(passwordToggleInput).toHaveClass('fa-eye')
      const rememberMe = screen.getByTestId('rememberMe');
      expect(rememberMe).not.toBeChecked();
    })
  
    test('Click Toggle password should have change icon', async () => {
      act(() => {
        fireEvent.click(screen.getByTestId('password-toggle'))
      });
      let passwordToggleInput = screen.getByTestId('password-toggle');
      expect(passwordToggleInput).toHaveClass('fa-eye-slash')
    })
    test('Click Remember me to should set remember me to checked', async () => {
      let rememberMe = screen.getByTestId('rememberMe');
      const checked = rememberMe.checked;
      
      act(() => {
        fireEvent.click(screen.getByTestId('rememberMe'))
      });
      
      await waitFor(() => {
        checked ? expect(rememberMe).not.toBeChecked() : expect(rememberMe).toBeChecked()
        
      }) 
    })
    
  })

  describe('Test Sign In', () => {
    let mock;
    //mock all requests on page
    beforeAll(() => {
      mock = axiosMock;
      mock.onPost(`${baseURL}${endpoints.authentication.signIn}`).reply( 200, USERS);
    })
    beforeEach(() => {
      renderApp(store);
    })
    
    it('rejects empty values validation', async () => {
      
      act(() => {
        fireEvent.click(screen.getByRole('button', {name: /SIGN IN/i}));
      })
      await waitFor(() => {
        expect(screen.getAllByText(/The field cannot be empty/i)).toHaveLength(2)
      })
      
    })

    it('signs in user correctly', async () => {
      
      act(() => {
        fireEvent.change(screen.getByRole('textbox', {name : 'EMAIL ADDRESS:'}), {target: {value: 'test@gmail.com'}})
        fireEvent.change(screen.getByPlaceholderText('password'), {target: {value: '12345'}})
      })
      act(() => {
        fireEvent.click(screen.getByRole('button', {name: /SIGN IN/i}));
      })
      await waitFor(async () => {
        expect(screen.getByPlaceholderText('password')).toHaveValue('12345')
      })
      //check store sign in
      await waitFor(async () => {
        expect(store.getState().auth.user).toEqual(USERS.user)
        expect(store.getState().auth.isLoggedIn).toEqual(true)
      })
      
    })
  })
  
})
