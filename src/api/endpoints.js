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
    profile: '/users/'
  },
  myprofile: {
    getInfo: '/myprofile/view/',
    updateInfo: '/myprofile/update',
    uploadProfImg: '/myprofile/update',
  },
  common: {
    organizations:'/organizations/',
    roles: '/roles/',
    termsNconditions: '/api/documents/terms-current',
    privacyPolicy: '/api/documents/privacy-current'
  },
  dashboard: {
    getStats : '/dashboard/stats',
    getWeatherStats : '/dashboard/weatherstats',
    getWeatherVariables : '/dashboard/weathervariables',
    getInSitu : '/dashboard/inSitu',
    getTweets : '/dashboard/tweets'
  }
};

