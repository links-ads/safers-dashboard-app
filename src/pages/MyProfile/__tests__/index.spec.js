/* eslint-disable init-declarations */
import React from 'react';

import { render, screen } from 'test-utils';

import MyProfile from '../index';

xdescribe('Test My Profile Component', () => {
  const renderApp = (props = {}, state = {}) => {
    return render(<MyProfile {...props} />, { state });
  };

  beforeEach(() => {
    renderApp();
  });

  it('renders', () => {
    expect(screen.getByText(/My Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Selected Area of Interest/i)).toBeInTheDocument();
  });
});
