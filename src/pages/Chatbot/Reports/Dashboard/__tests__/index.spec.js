/* eslint-disable init-declarations */
import React from 'react';

import { REPORTINFO } from '__mocks__/reports';
import { render, screen, waitFor } from 'test-utils';

import ReportsDashboard from '../index';

xdescribe('Test Events Screen', () => {
  const renderApp = (props = {}, state = {}) => {
    render(<ReportsDashboard {...props} />, { state });
  };

  describe('displays events list', () => {
    beforeEach(() => {
      renderApp();
    });

    it('lists reports list when loaded', async () => {
      await waitFor(() =>
        expect(
          screen.getAllByText(`${REPORTINFO.name}`, { exact: false }).length,
        ).toBeGreaterThan(0),
      );

      //verify other elements
      expect(
        screen.getAllByText(`${REPORTINFO.name}`, { exact: false }).length,
      ).toBeGreaterThan(0);
      expect(
        screen.getAllByText(`${REPORTINFO.hazardType}`, { exact: false })
          .length,
      ).toBeGreaterThan(0);
      expect(
        screen.getAllByText(`${REPORTINFO.status}`, { exact: false }).length,
      ).toBeGreaterThan(0);
      expect(
        screen.getAllByText(`${REPORTINFO.description}`, { exact: false })
          .length,
      ).toBeGreaterThan(0);
      expect(
        screen.getAllByText(`${REPORTINFO.userName}`, { exact: false }).length,
      ).toBeGreaterThan(0);
      expect(
        screen.getAllByText(`${REPORTINFO.organization}`, { exact: false })
          .length,
      ).toBeGreaterThan(0);
      expect(
        screen.getAllByText(`${REPORTINFO.location}`, { exact: false }).length,
      ).toBeGreaterThan(0);
      expect(
        screen.getAllByText(`${REPORTINFO.reportPrivacy}`, { exact: false })
          .length,
      ).toBeGreaterThan(0);
      expect(
        screen.getAllByText(`${REPORTINFO.passportID}`, { exact: false })
          .length,
      ).toBeGreaterThan(0);
      expect(
        screen.getAllByText(`${REPORTINFO.missionId}`, { exact: false }).length,
      ).toBeGreaterThan(0);
    });

    it('displays in situ media', () => {
      const inSituMediaScreen = screen.getByRole('in-situ-reports-media');
      const inSituMediaPage1 = REPORTINFO.media.slice(0, 3);

      inSituMediaPage1.forEach(media => {
        expect(inSituMediaScreen).toHaveTextContent(media.title);
      });
    });
  });
});
