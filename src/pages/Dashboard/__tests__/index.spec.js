/* eslint-disable init-declarations */
import { cleanup, render } from '@testing-library/react';
import { baseURL, mockedDispatch, mockedHref, mockedNavigator, mockedSelector } from '../../../TestUtils';
import React from 'react';
import Dashboard from '..';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from '../../../store';
import axiosMock from '../../../../__mocks__/axios';
import { endpoints } from '../../../api/endpoints';
import { inSituMedia, STATS, tweets, weatherVariables, WEATHER_STATS } from '../../../../__mocks__/dashboard';
import { AOIS } from '../../../../__mocks__/aoi';

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom')), // technically it passes without this too, but I'm not sure if its there for other tests to use the real thing so I left it in
  useNavigate: () => mockedNavigator,
  useHref: () => mockedHref
}));
jest.mock('react-redux', () => ({
  ...(jest.requireActual('react-redux')), // technically it passes without this too, but I'm not sure if its there for other tests to use the real thing so I left it in
  useSelector: () => mockedSelector,
  useDispatch: () => mockedDispatch
}));

afterEach(cleanup);

describe('Test Dashboard Component', () => {
  function renderApp(props = {}) {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <Dashboard {...props} />
        </BrowserRouter>
      </Provider>,
    );
  }
  
  let mock;
  //mock all requests on page
  beforeAll(() => {
    mock = axiosMock;
    mock.onGet(`${baseURL}${endpoints.dashboard.getStats}`).reply(200, STATS);
    mock.onGet(`${baseURL}${endpoints.dashboard.getWeatherStats}`).reply(200, WEATHER_STATS);
    mock.onGet(`${baseURL}${endpoints.dashboard.getWeatherVariables}`).reply(200, weatherVariables);
    mock.onGet(`${baseURL}${endpoints.dashboard.endpoints.dashboard.getInSitu}`).reply(200, inSituMedia);
    mock.onGet(`${baseURL}${endpoints.dashboard.getTweets}`).reply(200, tweets);
    mock.onGet(`${baseURL}${endpoints.aoi.getAll}`).reply(200, AOIS);
  })
  beforeEach(() => {
    renderApp(store);
  })
  describe('Renders', () => {
    
    test('Should render correctly', () => {
      expect(screen).not.toBeNull();
    }) 
    
        
  });
})