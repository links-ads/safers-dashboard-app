const realEndpoints = {
  authentication: {
    signIn: '/sign-in',
    signUp: '/sign-up',
    forgotPassword: 'forgot-password'
  },
  aoi: {
    getAll: '/aoi/all',
  },
  user: {
    setDefaultAoi: '/user/set-default-aoi',
    updateProfile: '/user/update-profile'
  }
};

const mockEndpoints = {
  authentication: {
    signIn: 'mock-api-sign-in.json',
    signUp: '/sign-up',
    forgotPassword: 'forgot-password'
  },
  aoi: {
    getAll: 'mock-api-aoi-all.json',
  },
  user: {
    setDefaultAoi: '/user/set-default-aoi',
    updateProfile: '/user/update-profile'
  }
};

// eslint-disable-next-line no-constant-condition
export const endpoints = true ? mockEndpoints : realEndpoints;

