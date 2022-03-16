const realEndpoints = {
  authentication: {
    signIn: '/auth/login/',
    signUp: '/auth/register/',
    signOut: '/auth/logout/',
    forgotPswReset: '/auth/password/reset/',
    resetPsw: '/auth/password/reset/confirm/',
    refreshToken: '/auth/token/refresh/',
  },
  aoi: {
    getAll: '/aois/',
  },
  user: {
    setDefaultAoi: '/user/set-default-aoi',
    profile: '/users/'
  },
  myprofile: {
    getInfo: '/my-profile.json',
    updateInfo: '/my-profile.json',
  },
  common: {
    organizations:'/organizations/',
    roles: '/roles/'
  }
};

const mockEndpoints = {
  authentication: {
    signIn: '/mock-api-sign-in.json',
    signUp: '/mock-api-sign-in.json',
    forgotPassword: '/res-success.json',
    refreshToken: '/res-success.json'
  },
  aoi: {
    getAll: '/mock-api-aoi-all.json',
  },
  user: {
    setDefaultAoi: '/res-success.json',
    updateProfile: '/user/update-profile'
  },
  myprofile: {
    getInfo: '/my-profile.json',
    updateInfo: '/my-profile.json',
  },
  common: {
    // organizations: '/organizations/'
    organizations: '/res-success.json'
  }
};

// eslint-disable-next-line no-constant-condition
export const endpoints = false ? mockEndpoints : realEndpoints;

