/* eslint-disable init-declarations */
import React from 'react';

import { NOTIFICATION_DATA } from 'mock-data/notifications';
import { render, screen, waitFor } from 'test-utils';

import Notifications from '../index';

xdescribe('Test Events Screen', () => {
  const renderApp = (props = {}) => {
    render(<Notifications {...props} />);
  };

  describe('displays notifications list', () => {
    beforeEach(() => {
      renderApp();
    });

    it('lists notifications list when loaded', async () => {
      const notificationsPage1 = NOTIFICATION_DATA.slice(0, 3);

      await waitFor(() =>
        expect(
          screen.getAllByText(`${NOTIFICATION_DATA[0].description}`, {
            exact: false,
          }).length,
        ).toBeGreaterThan(0),
      );

      //verify other elements
      notificationsPage1.map(async notification => {
        expect(
          screen.getAllByText(`${notification.status}`, { exact: false })
            .length,
        ).toBeGreaterThan(0);
        expect(
          screen.getAllByText(`${notification.source}`, { exact: false })
            .length,
        ).toBeGreaterThan(0);
        expect(
          screen.getAllByText(`${notification.description}`, { exact: false })
            .length,
        ).toBeGreaterThan(0);
      });
    });
  });
});
