import {
  createAsyncThunk,
  createSlice,
  createSelector,
} from '@reduxjs/toolkit';
import queryString from 'query-string';

import * as api from 'api/base';
import { endpoints } from 'api/endpoints';
import { setLoading } from 'store/common/common.slice';

const name = 'events';

export const fetchEvents = createAsyncThunk(
  `${name}/fetchEvents`,
  async (
    { options, fromPage, isLoading = false },
    { dispatch, rejectWithValue },
  ) => {
    if (isLoading) {
      dispatch(setLoading({ status: true, message: 'Loading..' }));
    }

    const response = await api.get(
      endpoints.eventAlerts.getAll.concat('?', queryString.stringify(options)),
    );

    if (isLoading) {
      dispatch(setLoading({ status: false }));
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

export const fetchEventDetail = createAsyncThunk(
  `${name}/fetchEventDetail`,
  async (id, { dispatch, rejectWithValue }) => {
    dispatch(setLoading({ status: true, message: 'Loading..' }));

    const response = await api.get(
      endpoints.eventAlerts.getEvent.replace(':event_id', id),
    );

    dispatch(setLoading({ status: false }));

    if (response.status === 200) {
      return response.data;
    }

    return rejectWithValue({ error: true });
  },
);

export const fetchEventCameraMedia = createAsyncThunk(
  `${name}/fetchEventCameraMedia`,
  async (params, { rejectWithValue }) => {
    const response = await api.get(endpoints.eventAlerts.getInSitu, params);

    if (response.status === 200) {
      return response.data;
    }

    return rejectWithValue({ error: true });
  },
);

export const fetchEventTweets = createAsyncThunk(
  `${name}/fetchEventTweets`,
  async (params, { rejectWithValue }) => {
    const response = await api.get(endpoints.eventAlerts.getTweets, params);

    if (response.status === 200) {
      return response.data;
    }

    return rejectWithValue({ error: true });
  },
);

export const setEventFavorite = createAsyncThunk(
  `${name}/setEventFavorite`,
  async ({ eventId, isFavorite }, { rejectWithValue }) => {
    const response = await api.post(
      endpoints.eventAlerts.setFavorite.replace(':event_id', eventId),
      { is_favorite: isFavorite },
    );

    if (response.status === 200) {
      return {
        msg: `Successfully ${
          isFavorite ? 'added to' : 'removed from'
        } the favorite list`,
      };
    }

    return rejectWithValue({ error: response.data?.[0] });
  },
);

export const validateEvent = createAsyncThunk(
  `${name}/validateEvent`,
  async (eventId, { rejectWithValue }) => {
    const response = await api.post(endpoints.eventAlerts.validate, {
      alert_id: eventId,
    });

    if (response.status === 200) {
      return response.data;
    }

    return rejectWithValue({ error: response.error });
  },
);

export const editEventInfo = createAsyncThunk(
  `${name}/editEventInfo`,
  async ({ eventId, editInfo }, { dispatch, rejectWithValue }) => {
    dispatch(setLoading({ status: true, message: 'Loading..' }));

    const response = await api.patch(
      endpoints.eventAlerts.edit.replace(':event_id', eventId),
      editInfo,
    );

    dispatch(setLoading({ status: false }));

    if (response.status === 200) {
      return response.data;
    }

    return rejectWithValue({ error: response.data });
  },
);

export const initialState = {
  allEvents: [],
  event: {},
  paginatedAlerts: [],
  filteredEvents: [],
  midPoint: [],
  zoomLevel: undefined,
  iconLayer: undefined,
  alertId: null,
  hoverInfo: undefined,
  currentPage: 1,
  error: false,
  updateError: null,
  success: null,
  params: {
    order: '-date',
    default_bbox: true,
    default_date: false,
  },
  isNewEvent: false,
  isPageActive: false,
  newItemsCount: 0,
  inSituMedia: [],
  tweets: [],
};

const eventsSlice = createSlice({
  name,
  initialState,
  reducers: {
    setFilteredEvents: (state, { payload }) => {
      state.filteredEvents = payload;
    },
    resetEventResponseState: state => {
      state.error = false;
      state.success = null;
    },
    setEventParams: (state, { payload }) => {
      state.params = payload ? payload : initialState.params;
    },
    setNewEventState: (state, { payload }) => {
      const { isNewEvent, isPageActive, newItemsCount } = payload;

      state.isNewEvent = isNewEvent;
      state.isPageActive = isPageActive;
      state.newItemsCount = newItemsCount;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchEvents.fulfilled, (state, { payload }) => {
        if (payload.fromPage) {
          state.filteredEvents = payload.data;
        } else {
          state.allEvents = payload.data;
          state.error = false;
        }
      })
      .addCase(fetchEvents.rejected, state => {
        state.error = true;
      })
      .addCase(fetchEventDetail.fulfilled, (state, { payload }) => {
        state.event = payload;
        state.error = false;
      })
      .addCase(fetchEventDetail.rejected, state => {
        state.error = true;
      })
      .addCase(fetchEventCameraMedia.fulfilled, (state, { payload }) => {
        state.inSituMedia = payload;
        state.error = false;
      })
      .addCase(fetchEventCameraMedia.rejected, state => {
        state.error = true;
      })
      .addCase(fetchEventTweets.fulfilled, (state, { payload }) => {
        state.tweets = payload;
        state.error = false;
      })
      .addCase(fetchEventTweets.rejected, state => {
        state.error = true;
      })
      .addCase(setEventFavorite.fulfilled, (state, { payload }) => {
        state.success = payload.msg;
        state.error = false;
      })
      .addCase(setEventFavorite.rejected, (state, { payload }) => {
        state.error = payload.error;
      })
      .addCase(validateEvent.fulfilled, (state, { payload }) => {
        state.success = payload;
        state.error = false;
      })
      .addCase(validateEvent.rejected, state => {
        state.error = true;
      })
      .addCase(editEventInfo.fulfilled, (state, { payload }) => {
        state.event = payload;
        state.success = 'Successfully updated the information';
        state.error = false;
      })
      .addCase(editEventInfo.rejected, (state, { payload }) => {
        state.updateError = payload.error ?? 'Information update failed';
        state.error = true;
      });
  },
});

export const {
  setFilteredEvents,
  resetEventResponseState,
  setEventParams,
  setNewEventState,
} = eventsSlice.actions;

const baseSelector = state => state?.eventAlerts;

export const allEventsSelector = createSelector(
  baseSelector,
  events => events?.allEvents,
);

export const filteredEventsSelector = createSelector(
  baseSelector,
  events => events?.filteredEvents,
);

export const eventParamsSelector = createSelector(
  baseSelector,
  events => events?.params,
);

export const eventSelector = createSelector(
  baseSelector,
  events => events?.event,
);

export const eventInSituMediaSelector = createSelector(
  baseSelector,
  events => events?.inSituMedia,
);

export const isEventPageActiveSelector = createSelector(
  baseSelector,
  events => events?.isPageActive,
);

export const newEventCountSelector = createSelector(
  baseSelector,
  events => events?.newEventCount,
);

export const eventsSuccessSelector = createSelector(
  baseSelector,
  events => events?.success,
);

export const eventsErrorSelector = createSelector(
  baseSelector,
  events => events?.error,
);

export const eventsUpdateErrorSelector = createSelector(
  baseSelector,
  events => events?.updateError,
);

export const eventTweetsSelector = createSelector(
  baseSelector,
  events => events?.tweets,
);

export default eventsSlice.reducer;
