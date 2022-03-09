import React from 'react';
import { shallow } from 'enzyme';
import { findByTestAttr } from '../../../TestUtils';
import '@testing-library/jest-dom/extend-expect';
import ShallowRenderer from 'react-test-renderer/shallow';
import SignIn from '../SignIn';
// import configureStore from 'redux-mock-store';

const mockedNavigator = jest.fn();
const mockedHref = jest.fn();
const mockedSelector = jest.fn();
const mockedDispatch = jest.fn();

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
        <SignIn/>
      )
    })
  
    it('Should render a authentication container', () => {
      const container = findByTestAttr(wrapper, 'signInComponent');
      expect(container.length).toBe(1);
    })
    
    it('Should match snapshot', () => {
      const renderer = new ShallowRenderer()
      const result = renderer.render(<SignIn />)
      expect(result).toMatchSnapshot()
    })
      
  });
  
})