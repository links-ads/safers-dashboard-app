import React from 'react';
import { shallow } from 'enzyme';
import Authentication from '../index';
import { findByTestAttr } from '../../../TestUtils';
import '@testing-library/jest-dom/extend-expect';
import ShallowRenderer from 'react-test-renderer/shallow';
// import configureStore from 'redux-mock-store';

const mockedNavigator = jest.fn();

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom')), // technically it passes without this too, but I'm not sure if its there for other tests to use the real thing so I left it in
  useNavigate: () => mockedNavigator,
}));

  
describe('Authentication Component', () => {
  let wrapper = null;
  // pay attention to write it at the top level of your file
  describe('Renders', () => {
    beforeEach(() => {
      wrapper = shallow(
        <Authentication/>
      )
    })

    it('Should render a authentication container', () => {
      const container = findByTestAttr(wrapper, 'containerComponent');
      expect(container.length).toBe(1);
    })
    it('Should render overlay text paragraph', () => {
      const textComponent = findByTestAttr(wrapper, 'overlay-text');
      expect(textComponent.length).toBe(1);
    })
    it('Should match snapshot', () => {
      const renderer = new ShallowRenderer()
      const result = renderer.render(<Authentication />)
      expect(result).toMatchSnapshot()
    })
    
  });

})