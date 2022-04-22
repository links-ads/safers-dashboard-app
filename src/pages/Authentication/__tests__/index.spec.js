/* eslint-disable init-declarations */
import React from 'react';
import Authentication from '../index';
import '@testing-library/jest-dom/extend-expect';
import store from '../../../store'
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { endpoints } from '../../../api/endpoints';

import { baseURL } from '../../../TestUtils';
import { AOIS } from '../../../../__mocks__/aoi';
import { ORGS, ROLES } from '../../../../__mocks__/common';
import axiosMock from '../../../../__mocks__/axios';

describe('Test Authentication Component', () => {
  function renderApp(props = {}) {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <Authentication {...props} />
        </BrowserRouter>
      </Provider>,
    );
  }

 

  let mock;
  //mock all requests on page
  beforeAll(() => {
    mock = axiosMock;
    mock.onGet(`${baseURL}${endpoints.common.organizations}`).reply(200, ORGS);
    mock.onGet(`${baseURL}${endpoints.common.roles}`).reply(200, ROLES);
    mock.onGet(`${baseURL}${endpoints.aoi.getAll}`).reply(200, AOIS);
  })
  beforeEach(() => {
    renderApp(store);
  })


  it('renders text overlay', () => {
    expect(screen.getByText(/structured Approaches for/i)).toBeInTheDocument()
    expect(screen.getByText(/Forest fire Emergencies/i)).toBeInTheDocument()
    expect(screen.getByText(/in Resilient Societies/i)).toBeInTheDocument()
  });

  describe('when API call is successful', () => {  
    it('roles to be fetched', async () => {
      expect(await screen.findByText(/Organization Manager/i)).toBeInTheDocument();
      expect(await screen.findByText(/Decision Maker/i)).toBeInTheDocument()
      expect(await screen.findByText(/First Responder/i)).toBeInTheDocument()
    });
    it('organizations to be fetched', async () => {
      expect(await screen.findByText(/PCF - Pau Costa Foundation/i)).toBeInTheDocument();
      expect(await screen.findByText(/HRT - Hellenic Rescue Team/i)).toBeInTheDocument()
      expect(await screen.findByText(/HMOD - Hellenic Republic Ministry of National Defence/i)).toBeInTheDocument()
    });
  });
  
})