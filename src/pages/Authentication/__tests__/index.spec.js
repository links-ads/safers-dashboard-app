/* eslint-disable init-declarations */
import React from 'react';

import { render, screen } from 'test-utils';

import Authentication from '../index';

xdescribe('Test Authentication Component', () => {
  const renderApp = (props = {}, state = {}) => {
    render(<Authentication {...props} />, { state });
  };

  beforeEach(() => {
    renderApp();
  });

  it('renders text overlay', () => {
    expect(screen.getByText(/structured Approaches for/i)).toBeInTheDocument();
    expect(screen.getByText(/Forest fire Emergencies/i)).toBeInTheDocument();
    expect(screen.getByText(/in Resilient Societies/i)).toBeInTheDocument();
  });

  describe('when API call is successful', () => {
    it('roles to be fetched', async () => {
      expect(
        await screen.findByText(/Organization Manager/i),
      ).toBeInTheDocument();
      expect(await screen.findByText(/Decision Maker/i)).toBeInTheDocument();
      expect(await screen.findByText(/First Responder/i)).toBeInTheDocument();
    });

    it('organizations to be fetched', async () => {
      expect(
        await screen.findByText(/PCF - Pau Costa Foundation/i),
      ).toBeInTheDocument();
      expect(
        await screen.findByText(/HRT - Hellenic Rescue Team/i),
      ).toBeInTheDocument();
      expect(
        await screen.findByText(
          /HMOD - Hellenic Republic Ministry of National Defence/i,
        ),
      ).toBeInTheDocument();
    });
  });
});
