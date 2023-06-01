import {
  createAsyncThunk,
  createSlice,
  createSelector,
} from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage/session';

import * as api from 'api/base';
import { OK, CREATED } from 'api/constants';
import { endpoints } from 'api/endpoints';
import { setLoading } from 'store/common.slice';
import { setUserInfo } from 'store/user.slice';

import {
  AUTH_BASE_URL,
  AUTH_CLIENT_ID,
  AUTH_TENANT_ID,
  CLIENT_BASE_URL,
  REDIRECT_URL,
} from '../config';
import { setSession, deleteSession, getSession } from '../helpers/authHelper';

const name = 'auth';

const setSessionData = (
  access_token,
  refresh_token,
  user_id,
  rememberMe = false,
  isSSOsession = false,
) => {
  const sessionData = {
    access_token,
    refresh_token,
    userId: user_id,
    isSSOsession,
  };
  setSession(sessionData, rememberMe);
};

export const authenticateOauth2 = createAsyncThunk(
  `${name}/authenticateOauth2`,
  async (authCode, { dispatch, rejectWithValue }) => {
    const response = await api.post(
      endpoints.authentication.oAuth2Authenticate,
      {
        code: authCode,
      },
    );

    dispatch(setLoading({ status: false }));

    if (response.status === OK || response.status === CREATED) {
      const { access_token, expires_in, user_id } = response.data;
      setSessionData(access_token, null, user_id, false, true);

      const userResponse = await api.get(`${endpoints.user.profile}${user_id}`);
      if (userResponse.status === OK) {
        const user = userResponse.data;
        dispatch(setUserInfo(user));
      }
      return {
        user_id,
        expires_in,
      };
    }

    return rejectWithValue({ error: response.data.detail });
  },
);

export const signUpOauth2 = createAsyncThunk(
  `${name}/signUpOauth2`,
  async (userInfo, { rejectWithValue }) => {
    const response = await api.post(
      endpoints.authentication.oAuth2Register,
      userInfo,
    );

    if (response.status === CREATED) {
      window.location = `${CLIENT_BASE_URL}/auth/sign-in`;
      return response.data;
    }

    return rejectWithValue({ error: response.data });
  },
);

export const resetForgottenUserPasswordRequest = createAsyncThunk(
  `${name}/resetForgottenUserPasswordRequest`,
  async (email, { rejectWithValue }) => {
    const response = await api.post(
      endpoints.authentication.forgotPswReset,
      email,
    );

    if (response.status === OK) {
      return response.data;
    }

    return rejectWithValue({ error: response.error });
  },
);

export const resetPassword = createAsyncThunk(
  `${name}/resetPassword`,
  async (data, { rejectWithValue }) => {
    const response = await api.post(endpoints.authentication.resetPsw, {
      ...data,
    });

    if (response.status === OK) {
      return response.data;
    }

    return rejectWithValue({ error: response.data });
  },
);

export const redirectAfterSignOut = () => {
  const params = {
    client_id: AUTH_CLIENT_ID,
    tenant_id: AUTH_TENANT_ID,
    post_logout_redirect_uri: `${CLIENT_BASE_URL}/${REDIRECT_URL}`,
  };
  const urlParams = new URLSearchParams(params).toString();
  window.location = `${AUTH_BASE_URL}/oauth2/logout?${urlParams}`;
};

export const signOut = createAsyncThunk(
  `${name}/signOut`,
  async (_, { rejectWithValue }) => {
    const session = getSession();

    const response = await api.post(endpoints.authentication.oAuth2Logout);

    if (response.status === OK) {
      deleteSession();
      storage.removeItem('persist:root');

      if (session.isSSOsession) {
        redirectAfterSignOut();
      }

      return response.data;
    }

    return rejectWithValue({ error: true });
  },
);

export const refreshOAuthToken = createAsyncThunk(
  `${name}/refreshOAuthToken`,
  async (_, { rejectWithValue }) => {
    const response = await api.post(endpoints.authentication.oAuth2Refresh);

    if (response.status === OK) {
      return response.data;
    }

    return rejectWithValue({ error: response.data });
  },
);

export const initialState = {
  userId: null,
  signUpOauth2Success: false,
  isLoggedIn: false,
  error: false,
  forgotPswresponse: null,
  resetPswRes: null,
  resetPswError: null,
  errorSignIn: false,
  tokenExpiresIn: null,
  tokenLastUpdated: null,
  refreshTokenErr: null,
};

const authenticationSlice = createSlice({
  name,
  initialState,
  reducers: {
    signOutSuccess: state => {
      state = initialState;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(authenticateOauth2.fulfilled, (state, { payload }) => {
        state.userId = payload.user_id;
        state.tokenExpiresIn = payload.expires_in;
        state.isLoggedIn = true;
        state.error = false;
      })
      .addCase(authenticateOauth2.rejected, (state, { payload }) => {
        state.errorSignIn = payload.error;
        state.error = true;
      })
      .addCase(signUpOauth2.fulfilled, state => {
        state.signUpOauth2Success = true;
        state.isLoggedIn = false;
        state.error = false;
      })
      .addCase(signUpOauth2.rejected, (state, { payload }) => {
        state.signUpOauth2Success = false;
        state.error = payload.error;
      })
      .addCase(
        resetForgottenUserPasswordRequest.fulfilled,
        (state, { payload }) => {
          state.forgotPswresponse = payload;
          state.error = false;
        },
      )
      .addCase(
        resetForgottenUserPasswordRequest.rejected,
        (state, { payload }) => {
          state.error = payload.error;
        },
      )
      .addCase(resetPassword.fulfilled, (state, { payload }) => {
        state.resetPswRes = payload;
        state.error = false;
      })
      .addCase(resetPassword.rejected, (state, { payload }) => {
        state.resetPswError = payload.error;
      })
      .addCase(signOut.fulfilled, state => {
        state = initialState;
      })
      .addCase(signOut.rejected, state => {
        state.error = true;
      })
      .addCase(refreshOAuthToken.fulfilled, (state, { payload }) => {
        state.tokenExpiresIn = payload.expires_in;
        state.tokenLastUpdated = Date.now();
        state.error = false;
      })
      .addCase(refreshOAuthToken.rejected, (state, { payload }) => {
        state.refreshTokenErr = payload.error;
      });
  },
});

export const { signOutSuccess } = authenticationSlice.actions;

const baseSelector = state => state?.auth;

export const tokenLastUpdatedSelector = createSelector(
  baseSelector,
  auth => auth?.tokenLastUpdated,
);

export const tokenExpiresInSelector = createSelector(
  baseSelector,
  auth => auth?.tokenExpiresIn,
);

export const isLoggedInSelector = createSelector(
  baseSelector,
  auth => auth?.isLoggedIn,
);

export const errorSelector = createSelector(baseSelector, auth => auth?.error);

export const errorSignInSelector = createSelector(
  baseSelector,
  auth => auth?.errorSignIn,
);

export const resetPasswordResponseSelector = createSelector(
  baseSelector,
  auth => auth?.resetPswRes,
);

export const signUpOauth2SuccessSelector = createSelector(
  baseSelector,
  auth => auth?.signUpOauth2Success,
);

export const forgotPasswordResponseSelector = createSelector(
  baseSelector,
  auth => auth?.forgotPswresponse,
);

export default authenticationSlice.reducer;
