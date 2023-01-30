import React from 'react';

import { cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import ShallowRenderer from 'react-test-renderer/shallow';

import store from '../../store';
import {
  mockedDispatch,
  mockedHref,
  mockedNavigator,
  mockedSelector,
} from '../../TestUtils';
import Sidebar from '../Sidebar';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // technically it passes without this too, but I'm not sure if its there for other tests to use the real thing so I left it in
  useNavigate: () => mockedNavigator,
  useHref: () => mockedHref,
}));
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'), // technically it passes without this too, but I'm not sure if its there for other tests to use the real thing so I left it in
  useSelector: () => mockedSelector,
  useDispatch: () => mockedDispatch,
}));

afterEach(cleanup);

describe('SideBar Component', () => {
  describe('Renders', () => {
    it('Should match snapshot', () => {
      const renderer = new ShallowRenderer();
      const result = renderer.render(
        <Provider store={store}>
          <Sidebar />
        </Provider>,
      );
      expect(result).toMatchSnapshot();
    });
  });
});
