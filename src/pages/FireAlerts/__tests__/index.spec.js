/* eslint-disable init-declarations */
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import store from '../../../store'
import { Provider } from 'react-redux';
import { act, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { endpoints } from '../../../api/endpoints';

import { baseURL } from '../../../TestUtils';
import axiosMock from '../../../../__mocks__/axios';
import { AOIS } from '../../../../__mocks__/aoi';
import { setAoiSuccess } from '../../../store/appAction';
import userEvent from '@testing-library/user-event';
import FireAlerts from '../index';
import { FIRE_ALERTS } from '../../../../__mocks__/alerts';

describe('Test Events Screen', () => {
  function renderApp(props = {}) {
    return render(
      <Provider store={store}> 
        <BrowserRouter>
          <FireAlerts {...props} />
        </BrowserRouter>
      </Provider>, 
    );
  }

  let mock;
  //mock all requests on page
  beforeAll(() => {
    mock = axiosMock;
    mock.onPost(`${baseURL}${endpoints.fireAlerts.getAll}`).reply(() => {
      return[200, FIRE_ALERTS]
    });
    
    const objAoi = AOIS[0]
    store.dispatch(setAoiSuccess(objAoi))
    
  })
  
  afterEach(() => {
    jest.resetAllMocks();
  });
  afterAll(() => {
    jest.clearAllMocks();
  });
  describe('displays events list', () => {
    beforeEach(() => {
      renderApp(store);
    })  
    it('lists alerts list when loaded', async () => {
      const alertsPage1 = FIRE_ALERTS.slice(0, 3)
      
      await waitFor(() => expect(screen.getAllByText(`${FIRE_ALERTS[0].title}`, { exact :false}).length).toBeGreaterThan(0))
      //verify other elements
      alertsPage1.map(async(alert) => {
        
        expect(screen.getAllByText(`${alert.title}`, { exact :false}).length).toBeGreaterThan(0)
        expect(screen.getAllByText(`${alert.description}`, { exact :false}).length).toBeGreaterThan(0)
        expect(screen.getAllByText(`${alert.status}`, { exact :false}).length).toBeGreaterThan(0)
        expect(screen.getAllByText(`${alert.source}`, { exact :false}).length).toBeGreaterThan(0)
      
      })
      
      
    });
  
  });
  describe('alerts list sort', () => {
    beforeEach(() => {
      renderApp(store);
    })
    it('sorts by alert source', async () => {
      await waitFor(() => screen.getByTestId('fireAlertSource'))
      act(() => {
        userEvent.selectOptions(screen.getByTestId('fireAlertSource'), 'satellite')
      })
      await waitFor(() => expect(screen.getByRole('results-section')).toHaveTextContent(/Results 1/i)) 
    });
  })
  
})
  
