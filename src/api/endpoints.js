export const endpoints = {
  authentication: {
    signIn: '/auth/login/',
    signUp: '/auth/register/',
    signOut: '/auth/logout/',
    forgotPswReset: '/auth/password/reset/',
    resetPsw: '/auth/password/reset/confirm/',
    refreshToken: '/auth/token/refresh/',
    oAuth2SignIn: '/oauth2/login'
  },
  aoi: {
    getAll: '/aois/',
  },
  fireAlerts: {
    getAll: '/alerts/',
    setFavorite: '/alerts/favorite',
    validate: '/alerts/validate',
    edit: '/alerts/id-goes-here',
  },
  eventAlerts: {
    getAll: '/event-alerts/',
    setFavorite: '/event-alerts/favorite',
    validate: '/event-alerts/validate',
    edit: '/event-alerts/id-goes-here',
  },
  user: {
    profile: '/users/',
    resetPsw: '/auth/password/change/',
  },
  common: {
    organizations: '/organizations/',
    roles: '/roles/',
    termsNconditions: '/api/documents/terms-current',
    privacyPolicy: '/api/documents/privacy-current'
  },
  dashboard: {
    getStats: '/dashboard/stats',
    getWeatherStats: '/dashboard/weatherstats',
    getWeatherVariables: '/dashboard/weathervariables',
    getInSitu: '/dashboard/inSitu',
    getTweets: '/dashboard/tweets'
  },
  notifications: {
    getAll: '/notifications/',
  },
  insitu: {
    getAlerts: '/insitu-alerts/'
  }
};

