import {
  createAsyncThunk,
  createSlice,
  createSelector,
} from '@reduxjs/toolkit';
import queryString from 'query-string';

import * as api from 'api/base';
import { endpoints } from 'api/endpoints';

import { InProgress } from '../authentication/action';

const name = 'alerts';

export const fetchAlerts = createAsyncThunk(
  `${name}/fetchAlerts`,
  async (
    { options, fromPage, isLoading = false },
    { dispatch, rejectWithValue },
  ) => {
    if (isLoading) {
      dispatch(InProgress(true, 'Loading..'));
    }

    const response = await api.get(
      endpoints.fireAlerts.getAll.concat('?', queryString.stringify(options)),
    );

    if (isLoading) {
      dispatch(InProgress(false));
    }

    if (response.status === 200) {
      return {
        data: response.data,
        fromPage,
      };
    }

    return rejectWithValue({ error: response.error });
  },
);

export const fetchAlertSource = createAsyncThunk(
  `${name}/fetchAlertSource`,
  async (_, { rejectWithValue }) => {
    const response = await api.get(endpoints.fireAlerts.source);

    if (response.status === 200) {
      return response.data;
    }

    return rejectWithValue({ error: true });
  },
);

export const setAlertFavorite = createAsyncThunk(
  `${name}/setAlertFavorite`,
  async ({ alertId, isFavorite }, { rejectWithValue }) => {
    const response = await api.post(
      endpoints.fireAlerts.setFavorite.replace(':alert_id', alertId),
      { is_favorite: isFavorite },
    );

    if (response.status === 200) {
      return {
        msg: `Successfully ${
          isFavorite ? 'added to' : 'removed from'
        } the favorite list`,
      };
    }

    return rejectWithValue({ error: response.data[0] });
  },
);

export const validateAlert = createAsyncThunk(
  `${name}/validateAlert`,
  async (alertId, { rejectWithValue }) => {
    const response = await api.post(
      endpoints.fireAlerts.validate.replace(':alert_id', alertId),
      { type: 'VALIDATED' },
    );

    if (response.status === 200 || response.status === 201) {
      return response.data['detail'];
    }

    return rejectWithValue({ error: response.data[0] });
  },
);

export const editAlertInfo = createAsyncThunk(
  `${name}/editAlertInfo`,
  async ({ alertId, editInfo }, { dispatch, rejectWithValue }) => {
    console.log('EDIT ALERT INFO: ', { alertId, editInfo });
    const response = await api.patch(
      endpoints.fireAlerts.edit.replace(':alert_id', alertId),
      { information: editInfo },
    );

    if (response.status === 200) {
      return 'Successfully updated the information';
    }

    return rejectWithValue({ error: true });
  },
);

export const initialState = {
  sources: [],
  allAlerts: [],
  filteredAlerts: [],
  params: {
    order: '-date',
    default_bbox: true,
    default_date: true,
  },
  isNewAlert: false,
  isPageActive: false,
  newItemsCount: 0,
  error: null,
  success: null,
};

const alertsSlice = createSlice({
  name,
  initialState,
  reducers: {
    setFilteredAlerts: (state, { payload }) => {
      state.filteredAlerts = payload;
    },
    resetAlertResponseState: state => {
      state.error = false;
      state.success = null;
    },
    setAlertApiParams: (state, { payload }) => {
      state.params = payload ? payload : initialState.params;
    },
    setNewAlertState: (state, { payload }) => {
      const { isNewAlert, isPageActive, newItemsCount } = payload;

      state.isNewAlert = isNewAlert;
      state.isPageActive = isPageActive;
      state.newItemsCount = newItemsCount;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAlerts.fulfilled, (state, { payload }) => {
        if (payload.fromPage) {
          state.filteredAlerts = payload.data;
        } else {
          state.allAlerts = payload.data;
          state.error = false;
        }
      })
      .addCase(fetchAlerts.rejected, state => {
        state.error = true;
      })
      .addCase(fetchAlertSource.fulfilled, (state, { payload }) => {
        state.sources = payload;
        state.error = false;
      })
      .addCase(fetchAlertSource.rejected, state => {
        state.error = true;
      })
      .addCase(setAlertFavorite.fulfilled, (state, { payload }) => {
        state.success = payload.msg;
        state.error = false;
      })
      .addCase(setAlertFavorite.rejected, (state, { payload }) => {
        state.error = payload.error;
      })
      .addCase(validateAlert.fulfilled, (state, { payload }) => {
        state.success = payload;
        state.error = false;
      })
      .addCase(validateAlert.rejected, (state, { payload }) => {
        state.error = payload.error;
      })
      .addCase(editAlertInfo.fulfilled, (state, { payload }) => {
        state.success = payload;
        state.error = false;
      })
      .addCase(editAlertInfo.rejected, (state, { payload }) => {
        state.error = payload.error;
      });
  },
});

export const {
  setFilteredAlerts,
  resetAlertResponseState,
  setAlertApiParams,
  setNewAlertState,
} = alertsSlice.actions;

const baseSelector = state => state?.alerts;

export const allAlertsSelector = createSelector(
  baseSelector,
  events => events?.allAlerts,
);

export const filteredAlertsSelector = createSelector(
  baseSelector,
  events => events?.filteredAlerts,
);

export const alertSourcesSelector = createSelector(
  baseSelector,
  events => events?.sources,
);

export const alertParamsSelector = createSelector(
  baseSelector,
  events => events?.params,
);

export const isAlertPageActiveSelector = createSelector(
  baseSelector,
  events => events?.isPageActive,
);

export const newItemsCountAlertSelector = createSelector(
  baseSelector,
  events => events?.newItemsCount,
);

export const alertSuccessSelector = createSelector(
  baseSelector,
  events => events?.success,
);

export const alertErrorSelector = createSelector(
  baseSelector,
  events => events?.error,
);

export default alertsSlice.reducer;
