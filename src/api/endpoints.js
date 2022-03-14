const realEndpoints = {
  authentication: {
    signIn: '/sign-in',
    signUp: '/sign-up',
    forgotPassword: '/forgot-password'
  },
  aoi: {
    getAll: '/aoi/all',
  },
  user: {
    setDefaultAoi: '/user/set-default-aoi',
    updateProfile: '/user/update-profile'
  },
  myprofile: {
    getInfo: '/my-profile.json',
    updateInfo: '/my-profile.json',
  },
};

const mockEndpoints = {
  authentication: {
    signIn: '/mock-api-sign-in.json',
    signUp: '/mock-api-sign-in.json',
    forgotPassword: '/res-success.json'

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
};

// eslint-disable-next-line no-constant-condition
export const endpoints = true ? mockEndpoints : realEndpoints;

