/* eslint-disable init-declarations */
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { baseURL } from '../../../../TestUtils';
import React from 'react';
import Dashboard from '..';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from '../../../../store';
import axiosMock from '../../../../../__mocks__/axios';
import { endpoints } from '../../../../api/endpoints';
import { inSituMedia, STATS, tweets, weatherVariables, WEATHER_STATS } from '../../../../../__mocks__/dashboard';
import { AOIS } from '../../../../../__mocks__/aoi';
import { getAllAreas, setAoiSuccess } from '../../../../store/appAction';
import { formatNumber } from '../../../../store/utility';

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
    mock.onGet(`${baseURL}${endpoints.aoi.getAll}`).reply(200, AOIS);
    mock.onGet(`${baseURL}${endpoints.dashboard.getStats}`).reply(200, STATS);
    mock.onGet(`${baseURL}${endpoints.dashboard.getWeatherStats}`).reply(200, WEATHER_STATS);
    mock.onGet(`${baseURL}${endpoints.dashboard.getWeatherVariables}`).reply(200, weatherVariables);
    mock.onGet(`${baseURL}${endpoints.dashboard.getInSitu}`).reply(200, inSituMedia);
    mock.onGet(`${baseURL}${endpoints.dashboard.getTweets}`).reply(200, tweets);
    store.dispatch(getAllAreas())
    act(() => {
      const objAoi = AOIS[0]
      store.dispatch(setAoiSuccess(objAoi))
    })
  })
  
  describe('Renders', () => {
    beforeEach(() => {
      renderApp(store);
    })
    test('Should render correctly', () => {
      expect(screen).not.toBeNull();
    })

    it('displays dashboard stats', () => {
      const statsScreen = screen.getByRole('stats')
      expect(statsScreen).toHaveTextContent(formatNumber(STATS.alerts))
      expect(statsScreen).toHaveTextContent(formatNumber(STATS.events))
      expect(statsScreen).toHaveTextContent(formatNumber(STATS.socialEngagement))
      expect(statsScreen).toHaveTextContent(formatNumber(STATS.reports))
    })

    it('displays weather stats', () => {
      const weatherStatsScreen = screen.getByRole('weather-stats')
      expect(weatherStatsScreen).toHaveTextContent(WEATHER_STATS.forecast.temp[0])
      expect(weatherStatsScreen).toHaveTextContent(WEATHER_STATS.forecast.temp[1])
      expect(weatherStatsScreen).toHaveTextContent(WEATHER_STATS.forecast.temp[2])
    })

    it('switches text displayed in weather stats when clicked', async() => {
      const weatherStatsScreen = screen.getByRole('weather-stats')
      act(() => {
        fireEvent.click(screen.getByTestId('show-precipitation'))
      })
      await waitFor(() => {
        expect(weatherStatsScreen).toHaveTextContent(WEATHER_STATS.forecast.precipitation[0])
        expect(weatherStatsScreen).toHaveTextContent(WEATHER_STATS.forecast.precipitation[1])
        expect(weatherStatsScreen).toHaveTextContent(WEATHER_STATS.forecast.precipitation[2])
      })
    })

    it('displays weather variables on an hourly basis', () => {
      const weatherVariablesScreen = screen.getByRole('weather-variables')
      
      weatherVariables.map((weatherVariable) => {
        expect(weatherVariablesScreen).toHaveTextContent(weatherVariable.wind)
        expect(weatherVariablesScreen).toHaveTextContent(weatherVariable.humidity)
        expect(weatherVariablesScreen).toHaveTextContent(weatherVariable.time)
      })
    })
    
    it('displays in situ media', () => {
      const inSituMediaScreen = screen.getByRole('in-situ-media')
      inSituMedia.map((media) => {
        expect(inSituMediaScreen).toHaveTextContent(media.title)
      })
    })
    
  });
})