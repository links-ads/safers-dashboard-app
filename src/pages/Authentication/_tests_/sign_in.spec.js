import React from 'react';
import { shallow } from 'enzyme';

import '@testing-library/jest-dom/extend-expect';

import SignIn from '../SignIn';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom';
// import configureStore from 'redux-mock-store';

const mockedNavigator = jest.fn();
const mockedHref = jest.fn();
const mockedSelector = jest.fn();
const mockedDispatch = jest.fn();

afterEach(cleanup);

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom')), // technically it passes without this too, but I'm not sure if its there for other tests to use the real thing so I left it in
  useNavigate: () => mockedNavigator,
  useHref: () => mockedHref
}));
jest.mock('react-redux', () => ({
  ...(jest.requireActual('react-redux')), // technically it passes without this too, but I'm not sure if its there for other tests to use the real thing so I left it in
  useSelector: () => mockedSelector,
  useDispatch: () => mockedDispatch
}));
    
describe('Authentication Component', () => {
  let wrapper = null;
  // pay attention to write it at the top level of your file
  describe('Renders', () => {
    // beforeEach(() => {
    //   wrapper = shallow(
    //     <SignIn/>
    //   )
    // })
    
    // it('Should match snapshot', () => {
    //   const renderer = new ShallowRenderer()
    //   const result = renderer.render(<SignIn />)
    //   expect(result).toMatchSnapshot()
    // })
      
  });

  describe('Form testing', () => {
    beforeEach(() => {
      render(<BrowserRouter>
        <SignIn/>
      </BrowserRouter>)
    })
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
      act(() => {
        fireEvent.click(screen.getByTestId('rememberMe'))
      });
      let rememberMe = screen.getByTestId('rememberMe');
      await waitFor(() => {
        expect(rememberMe).toBeChecked();
      }) 
    })
    
  })
  
})