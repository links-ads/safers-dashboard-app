/* eslint-disable init-declarations */
import React from 'react';

import userEvent from '@testing-library/user-event';

import { ALL_ALERTS } from 'mockData/alerts';
import { server, rest } from 'mocks/server';
import { act, render, screen, waitFor, within } from 'test-utils';

import FireAlerts from '../index';

const DEFAULT_STATE = {
  user: {
    defaultAoi: {
      features: [
        {
          properties: {
            midPoint: [1, 1],
            zoomLevel: 20,
          },
        },
      ],
    },
  },
  alerts: {
    allAlerts: [],
    filteredAlerts: ALL_ALERTS,
    sources: [],
    success: null,
    error: null,
  },
  common: {
    dateRange: [new Date(), new Date()],
  },
};

describe('Test Events Screen', () => {
  function renderApp(testState = {}, props = {}) {
    const state = { ...DEFAULT_STATE, ...testState };
    return render(<FireAlerts {...props} />, { state });
  }

  describe('displays events list', () => {
    it('lists alerts list when loaded', async () => {
      server.use(
        rest.get('*/alerts/sources', async (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(['DSS', 'IN SITU CAMERAS']));
        }),
        rest.get('*/alerts/*', async (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(ALL_ALERTS));
        }),
      );

      renderApp();

      await waitFor(() =>
        expect(screen.getByText(ALL_ALERTS[0].title)).toBeInTheDocument(),
      );

      const cards = screen.getAllByRole('card');

      cards.forEach((card, i) => {
        expect(within(card).getByText(ALL_ALERTS[i].title)).toBeInTheDocument();
        expect(
          within(card).getByText(ALL_ALERTS[i].description),
        ).toBeInTheDocument();
        expect(within(card).getByText(ALL_ALERTS[i].type)).toBeInTheDocument();
        expect(
          within(card).getByText(ALL_ALERTS[i].source),
        ).toBeInTheDocument();
      });
    });
  });

  xdescribe('alerts list sort', () => {
    beforeEach(() => {
      renderApp();
    });
    it('sorts by alert source', async () => {
      await waitFor(() => screen.getByTestId('fireAlertSource'));
      act(() => {
        userEvent.selectOptions(
          screen.getByTestId('fireAlertSource'),
          'satellite',
        );
      });
      await waitFor(() =>
        expect(screen.getByTestId('results-section')).toHaveTextContent(
          /Results 1/i,
        ),
      );
    });
  });
});
