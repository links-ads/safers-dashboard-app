import {
  createAsyncThunk,
  createSlice,
  createSelector,
} from '@reduxjs/toolkit';

import * as api from 'api/base';
import { endpoints } from 'api/endpoints';
import { deleteSession } from 'helpers/authHelper';

const name = 'user';

export const setUserDefaultAoi = createAsyncThunk(
  `${name}/setUserDefaultAoi`,
  async ({ uid, aoi }, { rejectWithValue }) => {
    const response = await api.patch(`${endpoints.user.profile}${uid}`, {
      default_aoi: aoi.features[0].properties.id,
    });

    if (response.status === 200) {
      return {
        aoi,
        msg: response.data,
      };
    }

    return rejectWithValue({ error: true });
  },
);

export const fetchUserProfile = createAsyncThunk(
  `${name}/fetchUserProfile`,
  async (id, { rejectWithValue }) => {
    const response = await api.get(`${endpoints.user.profile}${id}`);

    if (response.status === 200) {
      return response.data;
    }

    return rejectWithValue({ error: true });
  },
);

export const updateUserProfile = createAsyncThunk(
  `${name}/updateUserProfile`,
  async ({ id, userInfo, isCitizen }, { rejectWithValue }) => {
    const response = await api.patch(`${endpoints.user.profile}${id}`, {
      organization: isCitizen ? null : userInfo.organization,
      role: userInfo.role,
      first_name: userInfo.first_name,
      last_name: userInfo.last_name,
      country: userInfo.country,
      city: userInfo.city,
      address: userInfo.address,
    });

    if (response.status === 200) {
      return response.data;
    }

    return rejectWithValue({ error: true });
  },
);

export const deleteUserProfile = createAsyncThunk(
  `${name}/deleteUserProfile`,
  async (id, { rejectWithValue }) => {
    const response = await api.del(`${endpoints.user.profile}${id}`);

    if (response.status === 200) {
      deleteSession();
      return response.data;
    }

    return rejectWithValue({ error: true });
  },
);

export const resetUserPassword = createAsyncThunk(
  `${name}/resetUserPassword`,
  async (params, { rejectWithValue }) => {
    const response = await api.post(endpoints.user.resetPsw, { ...params });

    if (response.status === 200) {
      return response.data;
    }

    return rejectWithValue({ error: true });
  },
);

export const uploadProfileImage = createAsyncThunk(
  `${name}/uploadProfileImage`,
  async (file, { rejectWithValue }) => {
    const response = await api.post(endpoints.myprofile.uploadProfImg, {
      file,
    });

    if (response.status === 200) {
      return response.data;
    }

    return rejectWithValue({ error: true });
  },
);

export const initialState = {
  defaultAoi: null,
  info: null,
  // aoiSetSuccess: null,
  error: false,
  getAOIerror: false,
  updateStatus: null,
  setAoiSuccessMessage: null,
  resetPasswordSuccessMessage: null,
  uploadProfileImage: null,
  deleteAccSuccessRes: null,
  deleteAccFailRes: null,
  uploadProfileImageFailRes: null,
  resetPswFailRes: null,
};

const userSlice = createSlice({
  name,
  initialState,
  reducers: {
    resetStatus: state => {
      state.updateStatus = null;
    },
    setDefaultAoi: (state, { payload }) => {
      state.defaultAoi = payload;
    },
    setUserInfo: (state, { payload }) => {
      state.info = payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(setUserDefaultAoi.fulfilled, (state, { payload }) => {
        state.defaultAoi = payload.aoi;
        state.setAoiSuccessMessage = payload.msg;
        state.error = false;
      })
      .addCase(setUserDefaultAoi.rejected, state => {
        state.error = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, { payload }) => {
        state.info = payload;
        state.error = false;
      })
      .addCase(fetchUserProfile.rejected, state => {
        state.error = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, { payload }) => {
        state.updateStatus = payload;
        state.error = false;
      })
      .addCase(updateUserProfile.rejected, state => {
        state.error = true;
      })
      .addCase(deleteUserProfile.fulfilled, (state, { payload }) => {
        state.deleteAccSuccessRes = payload;
        state.error = false;
      })
      .addCase(deleteUserProfile.rejected, (state, { payload }) => {
        state.deleteAccFailRes = payload;
        state.error = true;
      })
      .addCase(resetUserPassword.fulfilled, (state, { payload }) => {
        state.resetPasswordSuccessMessage = payload;
        state.error = false;
      })
      .addCase(resetUserPassword.rejected, state => {
        state.error = true;
      })
      .addCase(uploadProfileImage.fulfilled, (state, { payload }) => {
        state.uploadProfileImage = payload;
        state.error = false;
      })
      .addCase(uploadProfileImage.rejected, state => {
        state.uploadProfileImageFailRes = true;
        state.error = true;
      });
  },
});

export const { resetStatus, setDefaultAoi, setUserInfo } = userSlice.actions;

const baseSelector = state => state?.user;

export const defaultAoiSelector = createSelector(
  baseSelector,
  user => user?.defaultAoi,
);

export const setAoiSuccessMessageSelector = createSelector(
  baseSelector,
  user => user?.setAoiSuccessMessage,
);

export const userInfoSelector = createSelector(
  baseSelector,
  user => user?.info,
);

export const uploadProfileImageSelector = createSelector(
  baseSelector,
  user => user?.uploadProfileImage,
);

export const deleteAccSuccessResSelector = createSelector(
  baseSelector,
  user => user?.deleteAccSuccessRes,
);

export const deleteAccFailResSelector = createSelector(
  baseSelector,
  user => user?.deleteAccFailRes,
);

export const uploadProfileImageFailResSelector = createSelector(
  baseSelector,
  user => user?.uploadProfileImageFailRes,
);

export const updateStatusSelector = createSelector(
  baseSelector,
  user => user?.updateStatus,
);

export const resetPswFailResSelector = createSelector(
  baseSelector,
  user => user?.resetPswFailRes,
);

export const resetPasswordSuccessMessageSelector = createSelector(
  baseSelector,
  user => user?.resetPasswordSuccessMessage,
);

export default userSlice.reducer;
