/* eslint-disable init-declarations */
import React from 'react';

import { cleanup, render, screen } from 'test-utils';

import Dashboard from '..';
import { inSituMedia } from '../../../../../__mocks__/dashboard';
import { EVENT_ALERTS, TWEETS } from '../../../../../__mocks__/event-alerts';
import store from '../../../../store';

afterEach(cleanup);

xdescribe('Test Dashboard Component', () => {
  const renderApp = (props = {}, state = {}) => {
    render(<Dashboard {...props} />, { state });
  };

  describe('Renders', () => {
    beforeEach(() => {
      renderApp();
    });

    test('Should render correctly', () => {
      expect(screen).not.toBeNull();
    });

    it('displays event info', () => {
      const infoScreen = screen.getByRole('info-container');
      const event = EVENT_ALERTS[0];

      expect(infoScreen).toHaveTextContent(event.location);
      expect(infoScreen).toHaveTextContent(event.title);
      expect(infoScreen).toHaveTextContent(event.damage);
      expect(infoScreen).toHaveTextContent(event.people_affected);
      expect(infoScreen).toHaveTextContent(event.description);
      expect(infoScreen).toHaveTextContent(event.source.join(', '));
    });

    it('displays in situ media', () => {
      const inSituMediaScreen = screen.getByRole('in-situ-container');
      const inSituMediaPage1 = inSituMedia.slice(0, 3);

      inSituMediaPage1.forEach(media => {
        expect(inSituMediaScreen).toHaveTextContent(media.title);
      });
    });

    it('gets tweets from the api', () => {
      expect(store.getState().dashboard.tweets).toEqual(TWEETS);
    });
  });
});
