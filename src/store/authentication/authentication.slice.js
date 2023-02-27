import {
  createAsyncThunk,
  createSlice,
  createSelector,
} from '@reduxjs/toolkit';
import lodash from 'lodash';
import storage from 'redux-persist/lib/storage/session';

import * as api from 'api/base';
import { endpoints } from 'api/endpoints';
import { setLoading } from 'store/common/common.slice';

import {
  AUTH_BASE_URL,
  AUTH_CLIENT_ID,
  AUTH_TENANT_ID,
  CLIENT_BASE_URL,
  REDIRECT_URL,
} from '../../config';
import {
  setSession,
  deleteSession,
  getSession,
} from '../../helpers/authHelper';

const name = 'auth';

const setSessionData = (
  token,
  refreshToken,
  user,
  rememberMe = false,
  isSSOsession = false,
) => {
  const sessionData = {
    access_token: token,
    refresh_token: refreshToken,
    userId: user.id,
    isSSOsession,
  };
  setSession(sessionData, rememberMe);
};

export const signInOauth2 = createAsyncThunk(
  `${name}/signInOauth2`,
  async (authCode, { dispatch, rejectWithValue }) => {
    const response = await api.post(endpoints.authentication.oAuth2SignIn, {
      code: authCode,
    });

    dispatch(setLoading({ status: false }));

    if (response.status === 200) {
      const { access_token, user } = response.data;
      setSessionData(access_token, null, user, false, true);

      return user;
    }

    return rejectWithValue({ error: response.data.detail });
  },
);

export const signIn = createAsyncThunk(
  `${name}/signIn`,
  async ({ email, password, rememberMe }, { dispatch, rejectWithValue }) => {
    dispatch(setLoading({ status: true, message: 'Please wait...' }));

    const response = await api.post(endpoints.authentication.signIn, {
      email,
      password,
    });

    dispatch(setLoading({ status: false }));

    if (response.status === 200) {
      const { access_token, refresh_token, user } = response.data;
      setSessionData(access_token, refresh_token, user, rememberMe);

      return user;
    }

    return rejectWithValue({ error: response.data });
  },
);

export const isUserRembembered = createAsyncThunk(
  `${name}/isUserRembembered`,
  async (_, { rejectWithValue }) => {
    const session = getSession();

    if (session && !lodash.isEmpty(session)) {
      const response = await api.post(endpoints.authentication.refreshToken, {
        refresh: session.refresh_token,
      });

      if (response.status === 200) {
        const newSession = { ...session, access_token: response.data.access };
        setSession(newSession, true);

        return newSession.user;
      }

      return rejectWithValue({ error: response.data });
    }
  },
);

export const signUpOauth2 = createAsyncThunk(
  `${name}/signUpOauth2`,
  async (userInfo, { rejectWithValue }) => {
    const response = await api.post(
      endpoints.authentication.oAuth2SignUp,
      userInfo,
    );

    if (response.status === 200) {
      return response.data;
    }

    return rejectWithValue({ error: response.data });
  },
);

export const signUp = createAsyncThunk(
  `${name}/signUp`,
  async (userInfo, { rejectWithValue }) => {
    const response = await api.post(endpoints.authentication.signUp, userInfo);

    if (response.status === 200) {
      const { access_token, user } = response.data;
      setSessionData(access_token, null, user);

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

    if (response.status === 200) {
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

    if (response.status === 200) {
      return response.data;
    }

    return rejectWithValue({ error: response.data });
  },
);

const redirectAfterSignOut = () => {
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

    const response = await api.post(endpoints.authentication.signOut);

    if (response.status === 200) {
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
    const response = await api.post(
      endpoints.authentication.oAuth2RefreshToken,
    );

    if (response.status === 200) {
      return response.data;
    }

    return rejectWithValue({ error: response.data });
  },
);

export const initialState = {
  user: {},
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
      .addCase(signInOauth2.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.tokenExpiresIn = payload.oauth2
          ? payload.oauth2.expires_in
          : null;
        state.isLoggedIn = true;
        state.error = false;
      })
      .addCase(signInOauth2.rejected, (state, { payload }) => {
        state.errorSignIn = payload.error;
        state.error = true;
      })
      .addCase(signIn.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.tokenExpiresIn = payload.oauth2
          ? payload.oauth2.expires_in
          : null;
        state.isLoggedIn = true;
        state.error = false;
      })
      .addCase(signIn.rejected, (state, { payload }) => {
        state.errorSignIn = payload.error;
        state.error = true;
      })
      .addCase(isUserRembembered.fulfilled, (state, { payload }) => {
        state.user = payload ? payload : {};
        state.tokenExpiresIn = payload.oauth2
          ? payload.oauth2.expires_in
          : null;
        state.isLoggedIn = true;
        state.error = false;
      })
      .addCase(isUserRembembered.rejected, (state, { payload }) => {
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
      .addCase(signUp.fulfilled, state => {
        state.error = false;
      })
      .addCase(signUp.rejected, (state, { payload }) => {
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

export const userSelector = createSelector(baseSelector, auth => auth?.user);

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
