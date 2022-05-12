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
    setFavorite: '/alerts/alert_id/favorite/',
    validate: '/alerts/alert_id/validate/',
    edit: '/alerts/alert_id/',
    source: '/alerts/sources',
  },
  dataLayers: {
    getAll: '/data/layers',
  },
  eventAlerts: {
    getAll: '/event-alerts/',
    setFavorite: '/event-alerts/favorite',
    validate: '/event-alerts/validate',
    edit: '/event-alerts/id-goes-here',
    getInSitu: '/event-alerts/inSitu',
    getTweets: '/event-alerts/tweets'
  },
  user: {
    profile: '/users/',
    resetPsw: '/auth/password/change/',
  },
  common: {
    config: '/config',
    organizations: '/organizations/',
    roles: '/roles/',
    termsNconditions: '/api/documents/terms-current',
    privacyPolicy: '/api/documents/privacy-current',
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
  },
  reports: {
    getReports: '/reports',
    getReportInfo: '/reportinfo',
  }
};

