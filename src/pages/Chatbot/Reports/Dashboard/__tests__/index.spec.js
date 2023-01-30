/* eslint-disable init-declarations */
import React from 'react';

import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { AOIS } from '../../../../../__mocks__/aoi';
import axiosMock from '../../../../../__mocks__/axios';
import { REPORTINFO } from '../../../../../__mocks__/reports';
import { endpoints } from '../../../../api/endpoints';
import store from '../../../../store';
import { setAoiSuccess } from '../../../../store/appAction';
import { baseURL } from '../../../../TestUtils';
import ReportsDashboard from '../index';

describe('Test Events Screen', () => {
  function renderApp(props = {}) {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <ReportsDashboard {...props} />
        </BrowserRouter>
      </Provider>,
    );
  }

  let mock;
  //mock all requests on page
  beforeAll(() => {
    mock = axiosMock;
    mock
      .onGet(`${baseURL}${endpoints.reports.getReportInfo}/1234`)
      .reply(() => {
        return [200, REPORTINFO];
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
