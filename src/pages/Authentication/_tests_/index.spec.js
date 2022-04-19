import React from 'react';
import { shallow } from 'enzyme';
import Authentication from '../index';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';

const mockedNavigator = jest.fn();

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom')),
  useNavigate: () => mockedNavigator,
}));

describe('Authentication Component', () => {
  let wrapper = null;
  // pay attention to write it at the top level of your file
  describe('Renders', () => {
    beforeEach(() => {
      wrapper = shallow(
        render(<Authentication/>)
      )
    })

    it('Should render a authentication container', () => {
      const container = screen.getAllByTestId(wrapper, 'containerComponent');
      expect(container.length).toBe(1);
    })
    // it('Should render overlay text paragraph', () => {
    //   const textComponent = findByTestAttr(wrapper, 'overlay-text');
    //   expect(textComponent.length).toBe(1);
    // })
    // it('Should match snapshot', () => {
    //   const renderer = new ShallowRenderer()
    //   const result = renderer.render(<Authentication />)
    //   expect(result).toMatchSnapshot()
    // })
    
  });

})