/* eslint-disable init-declarations */
import React from 'react';

import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import store from '../../../store';
import MyProfile from '../index';

describe('Test My Profile Component', () => {
  function renderApp(props = {}) {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <MyProfile {...props} />
        </BrowserRouter>
      </Provider>,
    );
  }

  beforeEach(() => {
    renderApp(store);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    expect(screen.getByText(/My Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Selected Area of Interest/i)).toBeInTheDocument();
  });
});
