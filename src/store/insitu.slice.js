import {
  createAsyncThunk,
  createSlice,
  createSelector,
} from '@reduxjs/toolkit';
import queryString from 'query-string';

import * as api from 'api/base';
import { OK } from 'api/constants';
import { endpoints } from 'api/endpoints';
import { getDefaultDateRange } from 'utility';

const name = 'inSituAlerts';

export const fetchCameras = createAsyncThunk(
  `${name}/fetchCameras`,
  async (options, { rejectWithValue }) => {
    const response = await api.get(
      endpoints.insitu.cameraList.concat('?', queryString.stringify(options)),
    );

    if (response.status === OK) {
      return response.data;
    }

    return rejectWithValue({ error: true });
  },
);

export const fetchCameraSources = createAsyncThunk(
  `${name}/fetchCameraSources`,
  async (_, { rejectWithValue }) => {
    const response = await api.get(endpoints.insitu.getSources);

    if (response.status === OK) {
      return response.data;
    }

    return rejectWithValue({ error: true });
  },
);

export const fetchCameraTags = createAsyncThunk(
  `${name}/fetchCameraTags`,
  async (_, { rejectWithValue }) => {
    const response = await api.get(endpoints.insitu.getTags);

    if (response.status === OK) {
      return response.data;
    }

    return rejectWithValue({ error: true });
  },
);

export const fetchCameraDetail = createAsyncThunk(
  `${name}/fetchCameraDetail`,
  async (id, { rejectWithValue }) => {
    const response = await api.get(`${endpoints.insitu.cameraList}${id}/`);

    if (response.status === OK) {
      return response.data;
    }

    return rejectWithValue({ error: true });
  },
);

export const fetchCameraAlerts = createAsyncThunk(
  `${name}/fetchCameraAlerts`,
  async (options, { rejectWithValue }) => {
    const response = await api.get(endpoints.insitu.getMedia, options);

    if (response.status === OK) {
      return response.data;
    }

    return rejectWithValue({ error: true });
  },
);

export const setCameraFavorite = createAsyncThunk(
  `${name}/setCameraFavorite`,
  async ({ alertId, isFavorite }, { rejectWithValue }) => {
    const response = await api.post(
      endpoints.insitu.setFavorite.replace(':media_id', alertId),
      { is_favorite: isFavorite },
    );

    if (response.status === OK) {
      const result = await response.json();
      console.log('CAMERA FAV RESULT: ', result);
      const successMessage = `sucessfully ${
        isFavorite ? 'added to' : 'removed from'
      } the favorite list`;
      return successMessage;
    }

    return rejectWithValue(response.data?.[0]);
  },
);

export const initialState = {
  allAlerts: [],
  cameraList: [],
  cameraSources: [],
  cameraInfo: null,
  paginatedAlerts: [],
  filteredAlerts: [],
  midPoint: [],
  zoomLevel: undefined,
  iconLayer: undefined,
  alertId: null,
  hoverInfo: undefined,
  sortByDate: '-date',
  alertSource: '',
  dateRange: getDefaultDateRange(),
  currentPage: 1,
  success: null,
  error: false,
};

const camerasSlice = createSlice({
  name,
  initialState,
  reducers: {
    resetCameraAlertsResponseState: state => {
      state.error = false;
      state.success = null;
    },
    setFilteredCameraAlerts: (state, { payload }) => {
      state.filteredAlerts = payload;
    },
    setPaginatedAlerts: (state, { payload }) => {
      state.paginatedAlerts = payload;
    },
    setCurrentPage: (state, { payload }) => {
      state.currentPage = payload;
    },
    setAlertId: (state, { payload }) => {
      state.alertId = payload;
    },
    setHoverInfo: (state, { payload }) => {
      state.hoverInfo = payload;
    },
    setIconLayer: (state, { payload }) => {
      state.iconLayer = payload;
    },
    setMidpoint: (state, { payload }) => {
      state.midPoint = payload;
    },
    setZoomLevel: (state, { payload }) => {
      state.zoomLevel = payload;
    },
    setSortByDate: (state, { payload }) => {
      state.sortByDate = payload;
    },
    setAlertSource: (state, { payload }) => {
      state.alertSource = payload;
    },
    setDateRange: (state, { payload }) => {
      state.dateRange = payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCameras.fulfilled, (state, { payload }) => {
        state.cameraList = payload;
        state.error = false;
      })
      .addCase(fetchCameras.rejected, state => {
        state.error = true;
      })
      .addCase(fetchCameraSources.fulfilled, (state, { payload }) => {
        state.cameraSources = payload;
        state.error = false;
      })
      .addCase(fetchCameraSources.rejected, state => {
        state.error = true;
      })

      .addCase(fetchCameraTags.fulfilled, (state, { payload }) => {
        state.cameraTags = payload;
        state.error = false;
      })
      .addCase(fetchCameraTags.rejected, state => {
        state.error = true;
      })
      .addCase(fetchCameraDetail.fulfilled, (state, { payload }) => {
        state.cameraInfo = payload;
        state.error = false;
      })
      .addCase(fetchCameraDetail.rejected, state => {
        state.error = true;
      })
      .addCase(fetchCameraAlerts.fulfilled, (state, { payload }) => {
        state.allAlerts = payload;
        state.error = false;
      })
      .addCase(fetchCameraAlerts.rejected, state => {
        state.error = true;
      })
      .addCase(setCameraFavorite.fulfilled, (state, { payload }) => {
        state.success = payload;
        state.error = false;
      })
      .addCase(setCameraFavorite.rejected, (state, { payload }) => {
        state.error = payload;
      });
  },
});

export const {
  resetCameraAlertsResponseState,
  setFilteredCameraAlerts,
  setPaginatedAlerts,
  setCurrentPage,
  setAlertId,
  setHoverInfo,
  setIconLayer,
  setMidpoint,
  setZoomLevel,
  setSortByDate,
  setAlertSource,
  setDateRange,
} = camerasSlice.actions;

const baseSelector = state => state?.inSituAlerts;

export const allInSituAlertsSelector = createSelector(
  baseSelector,
  inSituAlerts => inSituAlerts?.allAlerts,
);

export const cameraListSelector = createSelector(
  baseSelector,
  inSituAlerts => inSituAlerts?.cameraList,
);

export const filteredCameraAlertsSelector = createSelector(
  baseSelector,
  inSituAlerts => inSituAlerts?.filteredAlerts,
);

export const paginatedCameraAlertsSelector = createSelector(
  baseSelector,
  inSituAlerts => inSituAlerts?.paginatedAlerts,
);

export const cameraSourcesSelector = createSelector(
  baseSelector,
  inSituAlerts => inSituAlerts?.cameraSources,
);

export const cameraTagsSelector = createSelector(
  baseSelector,
  inSituAlerts => inSituAlerts?.cameraTags,
);

export const cameraAlertsSuccessSelector = createSelector(
  baseSelector,
  inSituAlerts => inSituAlerts?.success,
);

export const cameraAlertsErrorSelector = createSelector(
  baseSelector,
  inSituAlerts => inSituAlerts?.error,
);

export const cameraInfoSelector = createSelector(
  baseSelector,
  inSituAlerts => inSituAlerts?.cameraInfo,
);

export const cameraCurrentPageSelector = createSelector(
  baseSelector,
  inSituAlerts => inSituAlerts?.currentPage,
);

export default camerasSlice.reducer;
