const realEndpoints = {
  authentication: {
    signIn: '/auth/login/',
    signUp: '/auth/register/',
    forgotPassword: '/auth/password/reset/',
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
    organizations:'/organizations/'
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

