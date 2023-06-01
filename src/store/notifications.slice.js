import {
  createAsyncThunk,
  createSlice,
  createSelector,
} from '@reduxjs/toolkit';

import * as api from 'api/base';
import { OK } from 'api/constants';
import { endpoints } from 'api/endpoints';
import { getDefaultDateRange } from 'utility';

const name = 'notifications';

export const fetchNotifications = createAsyncThunk(
  `${name}/fetchNotifications`,
  async (options, { rejectWithValue }) => {
    const response = await api.get(endpoints.notifications.getAll, options);

    if (response.status === OK) {
      return response.data;
    }

    return rejectWithValue({ error: true });
  },
);

export const fetchNotificationSources = createAsyncThunk(
  `${name}/fetchNotificationSources`,
  async (options, { rejectWithValue }) => {
    const response = await api.get(endpoints.notifications.sources, options);

    if (response.status === OK) {
      return response.data;
    }

    return rejectWithValue({ error: true });
  },
);

export const fetchNotificationScopeRestrictions = createAsyncThunk(
  `${name}/fetchNotificationScopeRestrictions`,
  async (options, { rejectWithValue }) => {
    const response = await api.get(
      endpoints.notifications.scopesRestrictions,
      options,
    );

    if (response.status === OK) {
      return response.data;
    }

    return rejectWithValue({ error: true });
  },
);

export const initialState = {
  allNotifications: [],
  sources: [],
  scopesRestrictions: [],
  dateRange: getDefaultDateRange(),
  error: false,
  success: null,
  params: {
    order: '-date',
    default_bbox: true,
    default_date: false,
  },
  isNewNotification: false,
  isPageActive: false,
  newItemsCount: 0,
};

const notificationsSlice = createSlice({
  name,
  initialState,
  reducers: {
    resetNotificationApiParams: state => {
      state.params = initialState.params;
    },
    setNotificationParams: (state, { payload }) => {
      state.params = payload ? payload : initialState.params;
    },
    setNewNotificationState: (state, { payload }) => {
      state.isNewNotification = payload.isNewNotification;
      state.isPageActive = payload.isPageActive;
      state.newItemsCount = payload.newItemsCount;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, { payload }) => {
        state.allNotifications = payload;
        state.error = false;
      })
      .addCase(fetchNotifications.rejected, state => {
        state.error = true;
      })
      .addCase(fetchNotificationSources.fulfilled, (state, { payload }) => {
        state.sources = payload;
        state.error = false;
      })
      .addCase(fetchNotificationSources.rejected, state => {
        state.error = true;
      })
      .addCase(
        fetchNotificationScopeRestrictions.fulfilled,
        (state, { payload }) => {
          state.scopesRestrictions = payload;
          state.error = false;
        },
      )
      .addCase(fetchNotificationScopeRestrictions.rejected, state => {
        state.error = true;
      });
  },
});

export const {
  resetNotificationApiParams,
  setNotificationParams,
  setNewNotificationState,
} = notificationsSlice.actions;

const baseSelector = state => state?.notifications;

export const allNotificationsSelector = createSelector(
  baseSelector,
  notifications => notifications?.allNotifications,
);

export const notificationParamsSelector = createSelector(
  baseSelector,
  notifications => notifications?.params,
);

export const isNewNotificationSelector = createSelector(
  baseSelector,
  notifications => notifications?.isNewNotification,
);

export const newItemsCountNotificationSelector = createSelector(
  baseSelector,
  notifications => notifications?.newItemsCount,
);

export const notificationSourcesSelector = createSelector(
  baseSelector,
  notifications => notifications?.sources,
);

export const notificationScopeRestrictionsSelector = createSelector(
  baseSelector,
  notifications => notifications?.scopesRestrictions,
);

export const notificationIsPageActiveSelector = createSelector(
  baseSelector,
  notifications => notifications?.isPageActive,
);

export default notificationsSlice.reducer;
