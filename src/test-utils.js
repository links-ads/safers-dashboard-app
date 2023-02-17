import React from 'react';

import { render as rtlRender } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { MapProvider } from 'components/BaseMap/MapContext';

const mockStore = createMockStore([thunk]);

function render(Component, { state = {}, mapParams = {}, ...options } = {}) {
  const store = mockStore(state);
  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <BrowserRouter>
        <MapProvider value={mapParams}>{children}</MapProvider>
      </BrowserRouter>
    </Provider>
  );
  const utils = rtlRender(Component, { wrapper: Wrapper, ...options });
  return { ...utils, store };
}

// eslint-disable-next-line import/export
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
// eslint-disable-next-line import/export
export { render };
