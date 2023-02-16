import {
  createAsyncThunk,
  createSlice,
  createSelector,
} from '@reduxjs/toolkit';

import * as api from 'api/base';
import { endpoints } from 'api/endpoints';
import { getFilteredRec } from 'pages/Chatbot/filter';

const name = 'missions';

export const fetchMissions = createAsyncThunk(
  `${name}/fetchMissions`,
  async (
    { options, feFilters = null, isPolling = false },
    { rejectWithValue },
  ) => {
    const response = await api.get(
      endpoints.chatbot.missions.getMissions,
      options,
    );

    if (response.status === 200) {
      return {
        isPolling,
        feFilters,
        data: response.data,
      };
    }

    return rejectWithValue({ error: true });
  },
);

export const fetchMissionDetail = createAsyncThunk(
  `${name}/fetchMissionDetail`,
  async (id, { rejectWithValue }) => {
    const response = await api.get(
      endpoints.chatbot.missions.getMissionInfo.replace(':mission_id', id),
    );

    if (response.status === 200) {
      return {
        data: response.data,
      };
    }

    return rejectWithValue({ error: true });
  },
);

export const createMission = createAsyncThunk(
  `${name}/createMission`,
  async (mission, { rejectWithValue }) => {
    const response = await api.post(
      endpoints.chatbot.missions.createMission,
      mission,
    );

    if (response.status === 200) {
      return response.data;
    } else {
      return rejectWithValue({ error: true });
    }
  },
);

export const setMissionFavorite = createAsyncThunk(
  `${name}/setMissionFavorite`,
  async ({ alertId, isFavorite }, { rejectWithValue }) => {
    const response = await api.post(endpoints.eventAlerts.setFavorite, {
      alert_id: alertId,
      is_favorite: isFavorite,
    });

    if (response.status === 200) {
      return {
        msg: response.data,
      };
    }

    return rejectWithValue({ error: true });
  },
);

export const initialState = {
  allMissions: [],
  pollingData: [],
  sortByDate: 'desc',
  alertSource: 'all',
  error: false,
  success: null,
  filteredMissions: null,
  missionDetail: null,
  missionCreated: null,
};

const missionsSlice = createSlice({
  name,
  initialState,
  reducers: {
    resetMissionResponseState: state => {
      state.error = false;
      state.missionCreated = null;
      state.success = null;
    },
    refreshMissions: (state, { payload }) => {
      state.allMissions = payload;
      state.filteredMissions = null;
      state.error = false;
    },
    setFilteredMissions: (state, { payload }) => {
      state.filteredMissions = payload;
      state.error = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchMissions.fulfilled, (state, { payload }) => {
        if (payload.isPolling) {
          state.pollingData = payload.data;
          state.error = false;
        } else {
          const { order, status } = payload.feFilters ?? {};
          const filters = { status };
          const sort = { fieldName: 'start', order };
          const filteredMissions = getFilteredRec(payload.data, filters, sort);

          state.filteredMissions = filteredMissions;
          state.allMissions = payload.data;
          state.error = false;
        }
      })
      .addCase(fetchMissions.rejected, state => {
        state.error = true;
      })
      .addCase(fetchMissionDetail.fulfilled, (state, { payload }) => {
        state.missionDetail = payload.data;
        state.error = false;
      })
      .addCase(fetchMissionDetail.rejected, state => {
        state.error = true;
      })
      .addCase(createMission.fulfilled, (state, { payload }) => {
        state.missionCreated = payload;
        state.error = false;
      })
      .addCase(createMission.rejected, state => {
        state.error = true;
      })
      .addCase(setMissionFavorite.fulfilled, (state, { payload }) => {
        state.success = payload.msg;
        state.error = false;
      })
      .addCase(setMissionFavorite.rejected, state => {
        state.error = true;
      });
  },
});

export const {
  resetMissionResponseState,
  refreshMissions,
  setFilteredMissions,
} = missionsSlice.actions;

const baseSelector = state => state?.missions;

export const allMissionsSelector = createSelector(
  baseSelector,
  missions => missions?.allMissions,
);

export const filteredMissionsSelector = createSelector(
  baseSelector,
  missions => missions?.filteredMissions,
);

export const missionsPollingDataSelector = createSelector(
  baseSelector,
  missions => missions?.pollingData,
);

export const missionsSuccessSelector = createSelector(
  baseSelector,
  missions => missions?.success,
);

export const missionCreatedSelector = createSelector(
  baseSelector,
  missions => missions?.missionCreated,
);

export default missionsSlice.reducer;
