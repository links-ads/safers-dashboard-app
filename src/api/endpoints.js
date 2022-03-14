const realEndpoints = {
  authentication: {
    signIn: '/api/auth/login',
    signUp: '/api/auth/register',
    forgotPassword: '/api/auth/password/reset'
  },
  aoi: {
    getAll: '/api/aois',
  },
  user: {
    setDefaultAoi: '/user/set-default-aoi',
    profile: '/api/users/'
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
  common: {
    // organizations: '/api/organizations/'
    organizations: '/res-success.json'
  },
  getFavoriteIngredients: '/ingredients/favorite',
  addToFavoriteIngredients: '/ingredients/add-to/favorite'
};

// eslint-disable-next-line no-constant-condition
export const endpoints = true ? mockEndpoints : realEndpoints;

