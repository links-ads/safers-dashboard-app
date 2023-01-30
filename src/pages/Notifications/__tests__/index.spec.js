/* eslint-disable init-declarations */
import React from 'react';

import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { AOIS } from '../../../../__mocks__/aoi';
import axiosMock from '../../../../__mocks__/axios';
import { NOTIFICATION_DATA } from '../../../../__mocks__/notifications';
import { endpoints } from '../../../api/endpoints';
import store from '../../../store';
import { setAoiSuccess } from '../../../store/appAction';
import { baseURL } from '../../../TestUtils';
import Notifications from '../index';

describe('Test Events Screen', () => {
  function renderApp(props = {}) {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <Notifications {...props} />
        </BrowserRouter>
      </Provider>,
    );
  }

  let mock;
  //mock all requests on page
  beforeAll(() => {
    mock = axiosMock;
    mock.onPost(`${baseURL}${endpoints.notifications.getAll}`).reply(() => {
      return [200, NOTIFICATION_DATA];
    });

    const objAoi = AOIS[0];
    store.dispatch(setAoiSuccess(objAoi));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
  afterAll(() => {
    jest.clearAllMocks();
  });
  describe('displays notifications list', () => {
    beforeEach(() => {
      renderApp(store);
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
