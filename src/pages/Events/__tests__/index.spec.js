/* eslint-disable init-declarations */
import React from 'react';

import { act, fireEvent, render, screen, waitFor, userEvent } from 'test-utils';

import { EVENT_ALERTS } from '../../../../__mocks__/event-alerts';
import EventAlerts from '../index';

xdescribe('Test Events Screen', () => {
  const renderApp = (props = {}, state = {}) => {
    render(<EventAlerts {...props} />, { state });
  };

  describe('displays events list', () => {
    beforeEach(() => {
      renderApp();
    });

    it('lists events list when loaded', async () => {
      const eventAlertsPage1 = EVENT_ALERTS.slice(0, 3);

      await waitFor(() =>
        expect(
          screen.getAllByText(`${EVENT_ALERTS[0].title}`, { exact: false })
            .length,
        ).toBeGreaterThan(0),
      );

      //verify other elements
      eventAlertsPage1.map(async event => {
        expect(
          screen.getAllByText(`${event.title}`, { exact: false }).length,
        ).toBeGreaterThan(0);
        expect(
          screen.getAllByText(`${event.description}`, { exact: false }).length,
        ).toBeGreaterThan(0);
        expect(
          screen.getAllByText(`${event.status}`, { exact: false }).length,
        ).toBeGreaterThan(0);

        event.source.forEach(eventSource => {
          expect(
            screen.getAllByText(`${eventSource}`, { exact: false }).length,
          ).toBeGreaterThan(0);
        });
      });
    });

    it('sorts by ongoing when ongoing selected', async () => {
      //wait for data to be displayed
      act(() => {
        fireEvent.click(screen.getByTestId('onGoing'));
      });

      await waitFor(() =>
        expect(screen.queryAllByText('ONGOING').length).toEqual(4),
      );
      //reset
    });

    it('sorts by closed when closed selected', async () => {
      //wait for data to be displayed
      act(() => {
        userEvent.click(screen.getByTestId('closedEvents'));
      });

      await waitFor(() =>
        expect(screen.getByTestId('results-section')).toHaveTextContent(
          /Results 2/i,
        ),
      );
      expect(screen.findByText('Ongoing (0)')).not.toBeNull();
      expect(screen.queryAllByText('CLOSED').length).toEqual(2);
    });
  });

  describe('displays events list', () => {
    beforeEach(() => {
      renderApp();
    });

    it('sorts by event source', async () => {
      act(() => {
        userEvent.selectOptions(
          screen.getByTestId('eventAlertSource'),
          'satellite',
        );
      });

      await (() => {
        //only one item rendered
        expect(
          screen.getAllByText(/EMSR192: Fires in Athens, Greece/i).length,
        ).toEqual(1);
      });
    });
  });
});
