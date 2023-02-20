/* eslint-disable init-declarations */
import React from 'react';

import { render, screen, waitFor } from 'test-utils';

import { REPORTS } from '../../../../../__mocks__/reports';
import Reports from '../index';

xdescribe('Test Events Screen', () => {
  const renderApp = (props = {}, state = {}) => {
    render(<Reports {...props} />, { state });
  };

  describe('displays events list', () => {
    beforeEach(() => {
      renderApp();
    });
    it('lists reports list when loaded', async () => {
      const reportsPage1 = REPORTS.slice(0, 3);

      await waitFor(() =>
        expect(
          screen.getAllByText(`${REPORTS[0].name}`, { exact: false }).length,
        ).toBeGreaterThan(0),
      );

      //verify other elements
      reportsPage1.map(async report => {
        expect(
          screen.getAllByText(`${report.name}`, { exact: false }).length,
        ).toBeGreaterThan(0);
        expect(
          screen.getAllByText(`${report.description}`, { exact: false }).length,
        ).toBeGreaterThan(0);
        expect(
          screen.getAllByText(`${report.location}`, { exact: false }).length,
        ).toBeGreaterThan(0);
        expect(
          screen.getAllByText(`${report.source.join(', ')}`, { exact: false })
            .length,
        ).toBeGreaterThan(0);
      });
    });
  });
});
