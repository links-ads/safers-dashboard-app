import {
  createAsyncThunk,
  createSlice,
  createSelector,
} from '@reduxjs/toolkit';
import { flattenDeep } from 'lodash';
import queryString from 'query-string';
import toastr from 'toastr';

import * as api from 'api/base';
import { endpoints } from 'api/endpoints';
import { doesItOverlapAoi } from 'helpers/mapHelper';
import { defaultAoiSelector } from 'store/user.slice';

const FIRST_REQUEST = 0;

const name = 'dataLayer';

export const fetchDataLayers = createAsyncThunk(
  `${name}/fetchDataLayers`,
  async (options, { rejectWithValue }) => {
    const response = await api.get(
      endpoints.dataLayers.getAll.concat('?', queryString.stringify(options)),
    );

    if (response.status === 200) {
      return response.data;
    }

    return rejectWithValue({ error: true });
  },
);

export const fetchMetadata = createAsyncThunk(
  `${name}/fetchMetadata`,
  async (endpoint, { rejectWithValue }) => {
    const response = await api.get(endpoint);

    if (response.status === 200) {
      return response.data;
    }

    return rejectWithValue({ error: true });
  },
);

export const fetchFeatureInfo = createAsyncThunk(
  `${name}/fetchFeatureInfo`,
  async (url, { rejectWithValue }) => {
    const response = await api.get(url);

    if (response.status === 200) {
      return response.data;
    }

    return rejectWithValue({ error: true });
  },
);

export const fetchTimeSeriesInfo = createAsyncThunk(
  `${name}/fetchTimeSeriesInfo`,
  async (options, { rejectWithValue }) => {
    let timeSeriesStr = '';
    let error = null;
    for (const [request_index, url] of options.entries()) {
      const response = await api.get(url);

      if (response.status === 200) {
        // Remove longitude / latitude and time entries in followup responses
        if (request_index > FIRST_REQUEST) {
          /*
            Each response contain following 3 lines in CSV format
            # longitude
            # latitude
            # time
            So make sure only first response (from geoserver) has the 3 lines and follow up does not contain as we merge the responses and keep timeseries data together
          */
          const txt = await response.data;
          const tempArr = txt.split('\n');
          tempArr.splice(0, 3);
          timeSeriesStr += tempArr.join('\n');
        } else {
          timeSeriesStr = await response.data;
        }
      } else {
        error = true;
      }
    }

    if (!error) {
      return timeSeriesStr;
    }

    return rejectWithValue({ error: true });
  },
);

export const postMapRequest = createAsyncThunk(
  `${name}/postMapRequest`,
  async (mapRequest, { rejectWithValue }) => {
    const response = await api.post(
      endpoints.dataLayers.mapRequests,
      mapRequest,
    );

    if (response.status === 201) {
      toastr.success(
        `Successfully create a map request called ${response?.data.title}`,
        response.data?.category_info?.group,
      );

      return response.data;
    }

    toastr.error(
      `Failure: ${response.status} - ${response.statusText}`,
      'Post Map Error',
    );

    return rejectWithValue(response.error);
  },
);

export const deleteMapRequest = createAsyncThunk(
  `${name}/deleteMapRequest`,
  async (id, { rejectWithValue }) => {
    const response = await api.del(`${endpoints.dataLayers.mapRequests}${id}`);

    if (response.status === 204) {
      toastr.success(
        `Successfully deleted map request ${id}`,
        'Delete Map Request',
      );
      return response.data;
    }

    toastr.error(
      `Failure: ${response.status} - ${response.statusText}`,
      'Delete Map Request Error',
    );

    return rejectWithValue(response.error);
  },
);

export const fetchMapRequests = createAsyncThunk(
  `${name}/fetchMapRequests`,
  async (options, { rejectWithValue }) => {
    const response = await api.get(
      endpoints.dataLayers.mapRequests.concat(
        '?',
        queryString.stringify(options),
      ),
    );

    if (response.status === 200) {
      return response.data;
    }

    return rejectWithValue(response.error);
  },
);

export const fetchFilteredMapRequests = createAsyncThunk(
  `${name}/fetchFilteredMapRequests`,
  async (options, { rejectWithValue }) => {
    const response = await api.get(
      endpoints.dataLayers.mapRequests.concat(
        '?',
        queryString.stringify(options),
      ),
    );

    if (response.status === 200) {
      return response.data;
    }

    return rejectWithValue(response.error);
  },
);

export const initialState = {
  dataLayers: [],
  currentLayer: {},
  featureInfo: {},
  timeSeries: '',
  error: false,
  success: null,
  metaData: null,
  isMetaDataLoading: null,
  mapRequest: {},
  allMapRequests: [],
  filteredMapRequests: [],
  params: {
    order: '-date',
    default_bbox: true,
    default_date: false,
  },
  isPageActive: false,
  isNewAlert: false,
  newItemsCount: 0,
  selectedFireBreak: null,
};

const reportsSlice = createSlice({
  name,
  initialState,
  reducers: {
    setNewMapRequestState: (state, { payload }) => {
      const { isNewAlert, isPageActive, newItemsCount } = payload;

      state.isNewAlert = isNewAlert;
      state.isPageActive = isPageActive;
      state.newItemsCount = newItemsCount;
    },
    resetDataLayersResponseState: (state, { payload }) => {
      state.metaData = payload;
      state.isMetaDataLoading = false;
      state.error = false;
      state.success = null;
    },
    resetMetaData: state => {
      state.metaData = null;
    },
    setMapRequestParams: (state, { payload }) => {
      state.params = payload;
    },
    setSelectedFireBreak: (state, { payload }) => {
      state.selectedFireBreak = payload;
      state.error = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchDataLayers.fulfilled, (state, { payload }) => {
        state.dataLayers = payload;
        state.error = false;
      })
      .addCase(fetchDataLayers.rejected, state => {
        state.error = true;
      })
      .addCase(fetchMetadata.fulfilled, (state, { payload }) => {
        state.metaData = payload;
        state.isMetaDataLoading = false;
        state.error = false;
      })
      .addCase(fetchMetadata.rejected, state => {
        state.error = true;
        state.isMetaDataLoading = false;
      })
      .addCase(fetchFeatureInfo.fulfilled, (state, { payload }) => {
        state.featureInfo = payload;
        state.error = false;
      })
      .addCase(fetchFeatureInfo.rejected, state => {
        state.error = true;
      })
      .addCase(fetchTimeSeriesInfo.fulfilled, (state, { payload }) => {
        state.timeSeries = payload;
        state.error = false;
      })
      .addCase(fetchTimeSeriesInfo.rejected, state => {
        state.error = true;
      })
      .addCase(postMapRequest.fulfilled, (state, { payload }) => {
        state.mapRequest = payload;
        state.error = false;
      })
      .addCase(postMapRequest.rejected, state => {
        state.error = true;
        state.isMetaDataLoading = false;
      })
      .addCase(deleteMapRequest.fulfilled, () => {})
      .addCase(deleteMapRequest.rejected, state => {
        state.error = true;
        state.isMetaDataLoading = false;
      })
      .addCase(fetchMapRequests.fulfilled, (state, { payload }) => {
        state.allMapRequests = payload;
        state.error = false;
      })
      .addCase(fetchMapRequests.rejected, state => {
        state.error = true;
      })
      .addCase(fetchFilteredMapRequests.fulfilled, (state, { payload }) => {
        state.filteredMapRequests = payload;
        state.error = false;
      })
      .addCase(fetchFilteredMapRequests.rejected, state => {
        state.error = true;
      });
  },
});

export const {
  setNewMapRequestState,
  resetDataLayersResponseState,
  resetMetaData,
  setMapRequestParams,
  setSelectedFireBreak,
} = reportsSlice.actions;

const baseSelector = state => state?.dataLayer;

export const dataLayersSelector = createSelector(
  baseSelector,
  dataLayer => dataLayer?.dataLayers,
);

export const selectedFireBreakSelector = createSelector(
  baseSelector,
  dataLayer => dataLayer?.selectedFireBreak,
);

export const metaDataSelector = createSelector(
  baseSelector,
  dataLayer => dataLayer?.metaData,
);

export const isMetaDataLoadingSelector = createSelector(
  baseSelector,
  dataLayer => dataLayer?.isMetaDataLoading,
);

export const timeSeriesInfoSelector = createSelector(
  baseSelector,
  dataLayer => dataLayer?.timeSeries,
);

export const featureInfoSelector = createSelector(
  baseSelector,
  dataLayer => dataLayer?.featureInfo,
);

export const dataLayerNewItemsCountSelector = createSelector(
  baseSelector,
  dataLayer => dataLayer?.newItemsCount,
);

export const dataLayerIsNewAlertSelector = createSelector(
  baseSelector,
  dataLayer => dataLayer?.isNewAlert,
);

export const dataLayerIsPageActiveSelector = createSelector(
  baseSelector,
  dataLayer => dataLayer?.isPageActive,
);

export const dataLayerParamsSelector = createSelector(
  baseSelector,
  dataLayer => dataLayer?.params,
);

export const dataLayerMapRequestsSelector = createSelector(
  baseSelector,
  dataLayer => dataLayer?.allMapRequests,
);

const nodeVisitor = (node, userAoi, parentInfo = {}) => {
  // node visitor. This is a recursive function called on each node
  // in the tree. We use this to veto certain nodes based on AOI
  // geometry intersection.

  if (node.children) {
    if (node.geometry) {
      // intermediate node, this has a lot of metadata like geometry
      // test that this node intersects the default user AOI
      const overlaps = doesItOverlapAoi(node, userAoi);
      if (overlaps) {
        // we pass these down to the leaf nodes and recurse down to the children
        const passDown = {
          geometry: node.geometry,
          requestId: node.request_id,
          parentTitle: node.title,
          id: node.id,
          bbox: node.bbox,
        };
        return node.children.map(child =>
          nodeVisitor(child, userAoi, passDown),
        );
      } else {
        // prune the tree, these are out of bounds
        return [];
      }
    } else {
      // no geometry, so we're at top level
      return node.children.map(child => nodeVisitor(child, userAoi));
    }
  } else {
    // no children, so a leaf node. If data is avaialble,
    // combine the node and the info passed down from the parent
    if (node.status && node.status === 'AVAILABLE' && node.info_url) {
      return [{ ...node, ...parentInfo }];
    } else {
      return [];
    }
  }
};

export const flattenedMapRequestsSelector = createSelector(
  // returned flattened representation On Demand Map Requests Tree
  [dataLayerMapRequestsSelector, defaultAoiSelector],
  (categories, defaultAoi) => {
    const aoiBbox = defaultAoi?.features[0]?.bbox;
    const leafNodes = flattenDeep(
      categories.map(category => nodeVisitor(category, aoiBbox)),
    );
    return leafNodes;
  },
);

export default reportsSlice.reducer;
