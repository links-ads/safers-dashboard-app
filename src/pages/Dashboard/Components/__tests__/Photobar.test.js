/* eslint-disable init-declarations */
import React from 'react';

import { formatDate } from 'store/utility';
import { render, screen, waitFor } from 'test-utils';

import Photobar from '../PhotoBar';

const MOCK_STATE = {
  inSituAlerts: {
    allAlerts: [
      {
        id: '0e4f4cf8-93f4-4083-a1c6-cdcc7d215b8c',
        timestamp: '2023-02-24T17:40:54.315548Z',
        description: null,
        camera_id: 'Camera 1',
        type: 'IMAGE',
        fire_classes: [],
        tags: [],
        direction: 201,
        distance: null,
        geometry: {
          type: 'Point',
          coordinates: [0, 0],
        },
        url: 'url',
        file: 'file',
        favorite: null,
      },
    ],
    cameraSources: ['Camera #1', 'Camera #2'],
  },
};

describe('Test Photobar component', () => {
  const renderApp = (props = { t: word => word }, state = MOCK_STATE) => {
    render(<Photobar {...props} />, { state });
  };

  describe('displays photobar correctly', () => {
    beforeEach(() => {
      renderApp();
    });

    it('shows header', async () => {
      await waitFor(() =>
        expect(
          screen.getAllByText('in-situ-cameras', { exact: false }).length,
        ).toBeGreaterThan(0),
      );
    });

    it('shows image metadata (camera name)', async () => {
      await waitFor(() =>
        expect(
          screen.getAllByText(MOCK_STATE.inSituAlerts.cameraSources[0], {
            exact: false,
          }).length,
        ).toBeGreaterThan(0),
      );
    });

    it('shows image metadata (timestamp)', async () => {
      await waitFor(() =>
        expect(
          screen.getAllByText(
            formatDate(MOCK_STATE.inSituAlerts.allAlerts[0].timestamp),
            {
              exact: false,
            },
          ).length,
        ).toBeGreaterThan(0),
      );
    });
  });
});
