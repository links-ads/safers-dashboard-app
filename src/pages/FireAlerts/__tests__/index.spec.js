/* eslint-disable init-declarations */
import React from 'react';

// import '@testing-library/jest-dom/extend-expect';
// import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { server, rest } from 'mocks/server';
import { act, render, screen, waitFor } from 'test-utils';

import { FIRE_ALERTS } from '../../../../__mocks__/alerts';
import { AOIS } from '../../../../__mocks__/aoi';
import { endpoints } from '../../../api/endpoints';
// import store from '../../../store';
import { setAoiSuccess } from '../../../store/appAction';
import { baseURL } from '../../../TestUtils';
import FireAlerts from '../index';

describe('Test Events Screen', () => {
  // function renderApp(props = {}) {
  //   return render(
  //     <Provider store={store}>
  //       <BrowserRouter>
  //         <FireAlerts {...props} />
  //       </BrowserRouter>
  //     </Provider>,
  //   );
  // }

  function renderApp(props = {}, state = {}) {
    return render(<FireAlerts {...props} />, { state });
  }

  // let mock;
  //mock all requests on page
  // beforeAll(() => {
  //   mock = axiosMock;
  //   mock.onPost(`${baseURL}${endpoints.fireAlerts.getAll}`).reply(() => {
  //     return [200, FIRE_ALERTS];
  //   });

  //   const objAoi = AOIS[0];
  //   // store.dispatch(setAoiSuccess(objAoi));
  // });

  // afterEach(() => {
  //   jest.resetAllMocks();
  // });
  // afterAll(() => {
  //   jest.clearAllMocks();
  // });
  describe('displays events list', () => {
    beforeEach(() => {});
    it('lists alerts list when loaded', async () => {
      // server.use(
      //   rest.get('*/alerts/sources', async (req, res, ctx) => {
      //     console.log('CAUGHT REQUEST');
      //     return res(ctx.status(200), ctx.json({ message: 'WOO HOO success' }));
      //   }),
      // );
      const state = {
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
          filteredAlerts: [],
          sources: [],
          success: null,
          error: null,
        },
        common: {
          dateRange: [new Date(), new Date()],
        },
      };
      renderApp({}, state);

      // const alertsPage1 = FIRE_ALERTS.slice(0, 3);
      // await waitFor(() =>
      //   expect(
      //     screen.getAllByText(`${FIRE_ALERTS[0].title}`, { exact: false })
      //       .length,
      //   ).toBeGreaterThan(0),
      // );
      // //verify other elements
      // alertsPage1.map(async alert => {
      //   expect(
      //     screen.getAllByText(`${alert.title}`, { exact: false }).length,
      //   ).toBeGreaterThan(0);
      //   expect(
      //     screen.getAllByText(`${alert.description}`, { exact: false }).length,
      //   ).toBeGreaterThan(0);
      //   expect(
      //     screen.getAllByText(`${alert.status}`, { exact: false }).length,
      //   ).toBeGreaterThan(0);
      //   expect(
      //     screen.getAllByText(`${alert.source}`, { exact: false }).length,
      //   ).toBeGreaterThan(0);
      // });
    });
  });
  // describe('alerts list sort', () => {
  //   beforeEach(() => {
  //     renderApp(store);
  //   });
  //   it('sorts by alert source', async () => {
  //     await waitFor(() => screen.getByTestId('fireAlertSource'));
  //     act(() => {
  //       userEvent.selectOptions(
  //         screen.getByTestId('fireAlertSource'),
  //         'satellite',
  //       );
  //     });
  //     await waitFor(() =>
  //       expect(screen.getByTestId('results-section')).toHaveTextContent(
  //         /Results 1/i,
  //       ),
  //     );
  //   });
  // });
});
