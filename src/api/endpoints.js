export const endpoints = {
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
    getInfo: '/myprofile/view/',
    updateInfo: '/myprofile/update',
  },
  common: {
    organizations:'/organizations/',
    roles: '/roles/'
  },
  dashboard: {
    getStats : '/dashboard/stats',
    getWeatherStats : '/dashboard/weatherstats',
    getWeatherVariables : '/dashboard/weathervariables',
    getInSitu : '/dashboard/inSitu',
    getTweets : '/dashboard/tweets'
  }
};

