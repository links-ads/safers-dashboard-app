/* eslint-disable init-declarations */
import React from 'react';

import { inSituMedia } from 'mockData/dashboard';
import { EVENT_ALERTS, TWEETS } from 'mockData/event-alerts';
import { render, screen } from 'test-utils';

import Dashboard from '../index';

xdescribe('Test Dashboard Component', () => {
  let mockStore = null;

  const renderApp = (props = {}, state = {}) => {
    return render(<Dashboard {...props} />, { state });
  };

  describe('Renders', () => {
    beforeEach(() => {
      const { store } = renderApp();
      mockStore = store;
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
      expect(mockStore.getState().dashboard.tweets).toEqual(TWEETS);
    });
  });
});
