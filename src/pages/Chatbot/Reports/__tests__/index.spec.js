/* eslint-disable init-declarations */
import React from 'react';

import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { AOIS } from '../../../../__mocks__/aoi';
import axiosMock from '../../../../__mocks__/axios';
import { REPORTS } from '../../../../__mocks__/reports';
import { endpoints } from '../../../api/endpoints';
import store from '../../../store';
import { setAoiSuccess } from '../../../store/appAction';
import { baseURL } from '../../../TestUtils';
import Reports from '../index';

describe('Test Events Screen', () => {
  function renderApp(props = {}) {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <Reports {...props} />
        </BrowserRouter>
      </Provider>,
    );
  }

  let mock;
  //mock all requests on page
  beforeAll(() => {
    mock = axiosMock;
    mock.onGet(`${baseURL}${endpoints.reports.getReports}`).reply(() => {
      return [200, REPORTS];
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
  describe('displays events list', () => {
    beforeEach(() => {
      renderApp(store);
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
