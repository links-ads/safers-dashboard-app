import {
  createAsyncThunk,
  createSlice,
  createSelector,
} from '@reduxjs/toolkit';

import * as api from 'api/base';
import { OK } from 'api/constants';
import { endpoints } from 'api/endpoints';

const name = 'dashboard';

export const fetchStats = createAsyncThunk(
  `${name}/fetchStats`,
  async (params, { rejectWithValue }) => {
    const response = await api.get(endpoints.dashboard.getStats, params);

    if (response.status === OK) {
      return response.data;
    }

    return rejectWithValue({ error: true });
  },
);

export const fetchWeatherStats = createAsyncThunk(
  `${name}/fetchWeatherStats`,
  async (params, { rejectWithValue }) => {
    const response = await api.get(endpoints.dashboard.getWeatherStats, params);

    if (response.status === OK) {
      return response.data;
    }

    return rejectWithValue({ error: true });
  },
);

export const fetchWeatherVariables = createAsyncThunk(
  `${name}/fetchWeatherVariables`,
  async (params, { rejectWithValue }) => {
    const response = await api.get(
      endpoints.dashboard.getWeatherVariables,
      params,
    );

    if (response.status === OK) {
      return response.data;
    }

    return rejectWithValue({ error: true });
  },
);

export const fetchInSituMedia = createAsyncThunk(
  `${name}/fetchInSituMedia`,
  async (params, { rejectWithValue }) => {
    const response = await api.get(endpoints.dashboard.getInSitu, params);

    if (response.status === OK) {
      return response.data;
    }

    return rejectWithValue({ error: true });
  },
);

export const fetchTweets = createAsyncThunk(
  `${name}/fetchTweets`,
  async (params, { rejectWithValue }) => {
    const response = await api.get(endpoints.dashboard.getInSitu, params);

    if (response.status === OK) {
      return response.data;
    }

    return rejectWithValue({ error: true });
  },
);

export const initialState = {
  stats: {},
  weatherStats: {},
  weatherVariables: [],
  inSituMedia: [],
  tweets: [],
  error: null,
};

const dashboardSlice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchStats.fulfilled, (state, { payload }) => {
        state.stats = payload;
        state.error = false;
      })
      .addCase(fetchStats.rejected, state => {
        state.error = true;
      })
      .addCase(fetchWeatherStats.fulfilled, (state, { payload }) => {
        state.weatherStats = payload;
        state.error = false;
      })
      .addCase(fetchWeatherStats.rejected, state => {
        state.error = true;
      })
      .addCase(fetchWeatherVariables.fulfilled, (state, { payload }) => {
        state.weatherVariables = payload;
        state.error = false;
      })
      .addCase(fetchWeatherVariables.rejected, state => {
        state.error = true;
      })
      .addCase(fetchInSituMedia.fulfilled, (state, { payload }) => {
        state.inSituMedia = payload;
        state.error = false;
      })
      .addCase(fetchInSituMedia.rejected, state => {
        state.error = true;
      })
      .addCase(fetchTweets.fulfilled, (state, { payload }) => {
        state.tweets = payload;
        state.error = false;
      })
      .addCase(fetchTweets.rejected, state => {
        state.error = true;
      });
  },
});

const baseSelector = state => state?.dashboard;

export const tweetsSelector = createSelector(
  baseSelector,
  dashboard => dashboard?.tweets,
);

export const statsSelector = createSelector(
  baseSelector,
  dashboard => dashboard?.stats,
);

export const weatherStatsSelector = createSelector(
  baseSelector,
  dashboard => dashboard?.weatherStats,
);

export default dashboardSlice.reducer;
