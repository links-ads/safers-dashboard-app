/* eslint-disable init-declarations */
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import store from '../../../store'
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { endpoints } from '../../../api/endpoints';

import { baseURL } from '../../../TestUtils';
import axiosMock from '../../../../__mocks__/axios';
import EventAlerts from '../index';
import { EVENT_ALERTS } from '../../../../__mocks__/event-alerts';

describe('Test Authentication Component', () => {
  function renderApp(props = {}) {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <EventAlerts {...props} />
        </BrowserRouter>
      </Provider>,
    );
  }

  let mock;
  //mock all requests on page
  beforeAll(() => {
    mock = axiosMock;
    mock.onGet(`${baseURL}${endpoints.eventAlerts.getAll}`).reply(200, EVENT_ALERTS);
  })
  beforeEach(() => {
    renderApp(store);
  })

  describe('displays events list', () => {  
    it('lists events list when loaded', async () => {
      expect(await screen.findByText(/Organization Manager/i)).toBeInTheDocument();
      expect(await screen.findByText(/Decision Maker/i)).toBeInTheDocument()
      expect(await screen.findByText(/First Responder/i)).toBeInTheDocument()
    });
  });
  
})