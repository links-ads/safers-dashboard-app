import React from 'react';

/* eslint-disable init-declarations */
import { act, cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import Dashboard from '..';
import { AOIS } from '../../../../../__mocks__/aoi';
import axiosMock from '../../../../../__mocks__/axios';
import { inSituMedia } from '../../../../../__mocks__/dashboard';
import { EVENT_ALERTS, TWEETS } from '../../../../../__mocks__/event-alerts';
import { endpoints } from '../../../../api/endpoints';
import store from '../../../../store';
import { setAoiSuccess } from '../../../../store/appAction';
import { baseURL } from '../../../../TestUtils';

afterEach(cleanup);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    id: '9953b183-5f18-41b1-ac96-23121ac33de7',
  }),
}));

describe('Test Dashboard Component', () => {
  function renderApp(props = {}) {
    return render(
      <Provider store={store}>
        <BrowserRouter path="/event-dashboard/1234444">
          <Dashboard {...props} />
        </BrowserRouter>
      </Provider>,
    );
  }

  let mock;
  //mock all requests on page
  beforeAll(() => {
    mock = axiosMock;
    mock.onGet(`${baseURL}${endpoints.aoi.getAll}`).reply(200, AOIS);
    mock.onPost(`${baseURL}${endpoints.eventAlerts.getAll}`).reply(() => {
      return [200, EVENT_ALERTS];
    });
    mock
      .onGet(`${baseURL}${endpoints.dashboard.getInSitu}`)
      .reply(200, inSituMedia);
    mock.onGet(`${baseURL}${endpoints.dashboard.getTweets}`).reply(200, TWEETS);
    act(() => {
      const objAoi = AOIS[0];
      store.dispatch(setAoiSuccess(objAoi));
    });
  });

  describe('Renders', () => {
    beforeEach(() => {
      renderApp(store);
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
