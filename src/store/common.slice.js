import {
  createAsyncThunk,
  createSlice,
  createSelector,
} from '@reduxjs/toolkit';

import * as api from 'api/base';
import { OK } from 'api/constants';
import { endpoints } from 'api/endpoints';

import { getDefaultDateRange } from '../utility';

const name = 'common';

export const fetchConfig = createAsyncThunk(
  `${name}/fetchConfig`,
  async (_, { rejectWithValue }) => {
    const response = await api.get(endpoints.common.config);

    if (response.status === OK) {
      return response.data;
    }

    return rejectWithValue({ error: true });
  },
);

export const fetchOrganisations = createAsyncThunk(
  `${name}/fetchOrganisations`,
  async (_, { rejectWithValue }) => {
    const response = await api.get(endpoints.common.organizations);

    if (response.status === OK) {
      return response.data;
    }

    return rejectWithValue({ error: true });
  },
);

export const fetchRoles = createAsyncThunk(
  `${name}/fetchRoles`,
  async (_, { rejectWithValue }) => {
    const response = await api.get(endpoints.common.roles);

    if (response.status === OK) {
      return response.data;
    }

    return rejectWithValue({ error: true });
  },
);

export const fetchTeams = createAsyncThunk(
  `${name}/fetchTeams`,
  async (_, { rejectWithValue }) => {
    const response = await api.get(endpoints.common.teams);

    if (response.status === OK) {
      return response.data;
    }

    return rejectWithValue({ error: true });
  },
);

export const fetchAois = createAsyncThunk(
  `${name}/fetchAois`,
  async (_, { rejectWithValue }) => {
    const response = await api.get(endpoints.aoi.getAll);

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
  config: undefined,
  orgList: [],
  roleList: [],
  aois: [],
  selectedAoi: null,
  viewState: undefined,
  polygonLayer: undefined,
  isLoading: false,
  loadingMsg: null,
  dateRange: getDefaultDateRange(),
  isDateRangeDisabled: false,
  error: null,
  teamList: [],
};

const commonSlice = createSlice({
  name,
  initialState,
  reducers: {
    setLoading: (state, { payload }) => {
      state.loadingMsg = payload.message;
      state.isLoading = payload.status;
    },
    setSelectedAoi: (state, { payload }) => {
      state.selectedAoi = payload;
    },
    // setViewState: (state, { payload }) => {
    //   state.selectedAoi = payload;
    //   state.isLoading = true;
    // },
    // viewState: (state, { payload }) => {
    //   state.viewState = payload;
    // },
    setPolygonLayer: (state, { payload }) => {
      state.polygonLayer = payload;
    },
    setDateRange: (state, { payload }) => {
      state.dateRange = payload;
    },
    setDateRangeDisabled: (state, { payload }) => {
      state.isDateRangeDisabled = payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchConfig.fulfilled, (state, { payload }) => {
        state.config = payload;
        state.error = false;
      })
      .addCase(fetchConfig.rejected, state => {
        state.error = true;
      })
      .addCase(fetchOrganisations.fulfilled, (state, { payload }) => {
        state.orgList = payload;
        state.error = false;
      })
      .addCase(fetchOrganisations.rejected, state => {
        state.error = true;
      })
      .addCase(fetchRoles.fulfilled, (state, { payload }) => {
        state.roleList = payload;
        state.error = false;
      })
      .addCase(fetchRoles.rejected, state => {
        state.error = true;
      })
      .addCase(fetchTeams.fulfilled, (state, { payload }) => {
        state.teamList = payload;
        state.error = false;
      })
      .addCase(fetchTeams.rejected, state => {
        state.error = true;
      })
      .addCase(fetchAois.fulfilled, (state, { payload }) => {
        state.aois = payload;
        state.error = false;
      })
      .addCase(fetchAois.rejected, state => {
        state.error = true;
      });
  },
});

export const {
  setLoading,
  setSelectedAoi,
  setPolygonLayer,
  setDateRange,
  setDateRangeDisabled,
} = commonSlice.actions;

const baseSelector = state => state?.common;

export const isLoadingSelector = createSelector(
  baseSelector,
  common => common?.isLoading,
);

export const loadingMessageSelector = createSelector(
  baseSelector,
  common => common?.loadingMsg,
);

export const configSelector = createSelector(
  baseSelector,
  common => common?.config,
);

export const isDateRangeDisabledSelector = createSelector(
  baseSelector,
  common => common?.isDateRangeDisabled,
);

export const dateRangeSelector = createSelector(
  baseSelector,
  common => common?.dateRange,
);

export const aoisSelector = createSelector(
  baseSelector,
  common => common?.aois,
);

export const selectedAoiSelector = createSelector(
  baseSelector,
  common => common?.selectedAoi,
);

export const organisationsSelector = createSelector(
  baseSelector,
  common => common?.orgList,
);

export const rolesSelector = createSelector(
  baseSelector,
  common => common?.roleList,
);

export const teamsSelector = createSelector(
  baseSelector,
  common => common?.teamList,
);

export default commonSlice.reducer;
