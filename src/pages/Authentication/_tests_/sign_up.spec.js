import React from 'react';
import { shallow } from 'enzyme';
import { findByTestAttr } from '../../../TestUtils';
import '@testing-library/jest-dom/extend-expect';
import ShallowRenderer from 'react-test-renderer/shallow';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import SignUp from '../SignUp';
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
    beforeEach(() => {
      wrapper = shallow(
        <SignUp/>
      )
    })
  
    it('Should render a authentication container', () => {
      const container = findByTestAttr(wrapper, 'signUpComponent');
      expect(container.length).toBe(1);
    })
    
    it('Should match snapshot', () => {
      const renderer = new ShallowRenderer()
      const result = renderer.render(<SignUp />)
      expect(result).toMatchSnapshot()
    })
      
  });
  
})
describe('Form testing', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <SignUp/>
      </BrowserRouter>)
  })
  test('Should render correctly', () => {
    expect(screen).not.toBeNull();
  })
  test('Fields should be empty initially', () => {
    const emailInput = screen.getByTestId('sign-up-email');
    expect(emailInput).toHaveValue('');
    const firstNameInput = screen.getByTestId('sign-up-firstName');
    expect(firstNameInput).toHaveValue('');
    const lastNameInput = screen.getByTestId('sign-up-lastName');
    expect(lastNameInput).toHaveValue('');
    const roleInput = screen.getByTestId('sign-up-role');
    expect(roleInput).toHaveValue('');
    const orgInput = screen.getByTestId('sign-up-org');
    expect(orgInput).toHaveValue('');
    const passwordInput = screen.getByTestId('sign-up-password');
    expect(passwordInput).toHaveValue('');
    const passwordToggleInput = screen.getByTestId('sign-up-password-toggle');
    expect(passwordToggleInput).toHaveClass('fa-eye')
    const agreeTermsConditions = screen.getByTestId('sign-up-agreeTermsConditions');
    expect(agreeTermsConditions).not.toBeChecked();
  })

  test('Click Toggle password should have change icon', async () => {
    act(() => {
      fireEvent.click(screen.getByTestId('sign-up-password-toggle'))
    });
    let passwordToggleInput = screen.getByTestId('sign-up-password-toggle');
    expect(passwordToggleInput).toHaveClass('fa-eye-slash')
  })
  test('Click Agree to terms and conditions to should set remember me to checked', async () => {
    act(() => {
      fireEvent.click(screen.getByTestId('sign-up-agreeTermsConditions'))
    });
    let agreeTermsConditions = screen.getByTestId('sign-up-agreeTermsConditions');
    await waitFor(() => {
      expect(agreeTermsConditions).toBeChecked();
    }) 
  })
  
})