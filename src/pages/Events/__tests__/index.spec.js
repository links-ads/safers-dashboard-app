/* eslint-disable init-declarations */
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import store from '../../../store'
import { Provider } from 'react-redux';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { endpoints } from '../../../api/endpoints';

import { baseURL } from '../../../TestUtils';
import axiosMock from '../../../../__mocks__/axios';
import EventAlerts from '../index';
import { EVENT_ALERTS } from '../../../../__mocks__/event-alerts';
import { AOIS } from '../../../../__mocks__/aoi';
import { setAoiSuccess } from '../../../store/appAction';

describe('Test Events Screen', () => {
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
    mock.onPost(`${baseURL}${endpoints.eventAlerts.getAll}`).reply(() => {
      return[200, EVENT_ALERTS]
    });
    act(() => {
      const objAoi = AOIS[0]
      store.dispatch(setAoiSuccess(objAoi))
    })
  })
  beforeEach(() => {
    renderApp(store);
  })
  afterEach(() => {
    jest.resetAllMocks();
  });
  afterAll(() => {
    jest.clearAllMocks();
  });
  describe('displays events list', () => {  
    it('lists events list when loaded', async () => {
      const eventAlertsPage1 = EVENT_ALERTS.slice(0, 3)
      eventAlertsPage1.map(async(event) => {
        await waitFor(() => {
          expect(screen.getAllByText(`${event.title}`, { exact :false}).length).toBeGreaterThan(0)
          expect(screen.getAllByText(`${event.description}`, { exact :false}).length).toBeGreaterThan(0)
          expect(screen.getAllByText(`${event.status}`, { exact :false}).length).toBeGreaterThan(0)
          
        })
        event.source.map(async(eventSource) => {
          expect(screen.getAllByText(`${eventSource}`, { exact :false}).length).toBeGreaterThan(0)
        })   
      })
      
    });
    it('sorts by ongoing when ongoing selected', async () => {
      //wait for data to be displayed
      act(() => {
        fireEvent.click(screen.getByTestId('onGoing'))
      })

      await waitFor(() => {
        expect(store.getState().eventAlerts.paginatedAlerts.length == 4)
      })

      await waitFor(()=>expect(screen.queryAllByText('ONGOING').length).toEqual(4))
      //reset
      act(() => {
        fireEvent.click(screen.getByTestId('onGoing'))
      })     
    });
    it('sorts by closed when closed selected', async () => {
      //wait for data to be displayed
      act(() => {
        fireEvent.click(screen.getByTestId('closedEvents'))
      })
  
      await waitFor(() => {
        console.log(store.getState().eventAlerts.paginatedAlerts.length)
        expect(store.getState().eventAlerts.paginatedAlerts.length == 2)
      })
  
      await waitFor(async()=>expect(screen.queryAllByText('CLOSED').length).toEqual(2))
      //reset
      act(() => {
        fireEvent.click(screen.getByTestId('closedEvents'))
      })     
    });
  });
  
})