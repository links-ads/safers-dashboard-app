export const endpoints = {
  authentication: {
    oAuth2Login: '/auth/login',
    oAuth2Logout: '/auth/logout',
    oAuth2Register: '/auth/register',
    oAuth2Authenticate: '/auth/authenticate',
    oAuth2Refresh: '/auth/refresh',
  },

  aoi: {
    getAll: '/aois/',
  },
  fireAlerts: {
    getAll: '/alerts/',
    setFavorite: '/alerts/:alert_id/favorite/',
    validate: '/alerts/:alert_id/validate/',
    edit: '/alerts/:alert_id/',
    source: '/alerts/sources',
  },
  dataLayers: {
    getAll: '/data/layers',
    metadata: '/data/layers/metadata/',
    mapRequests: '/data/maprequests/',
  },
  eventAlerts: {
    getAll: '/events/',
    getEvent: '/events/:event_id/',
    setFavorite: '/events/:event_id/favorite/',
    validate: '/event-alerts/validate',
    edit: '/events/:event_id/',
    getInSitu: '/event-alerts/inSitu',
    getTweets: '/event-alerts/tweets',
  },
  user: {
    profile: '/users/',
    resetPsw: '/auth/password/change/',
  },
  common: {
    config: '/config',
    organizations: '/organizations/',
    roles: '/roles/',
    teams: '/teams/',
    termsNconditions: '/api/documents/terms-current',
    privacyPolicy: '/api/documents/privacy-current',
  },
  notifications: {
    getAll: '/notifications/',
    sources: '/notifications/sources',
    scopesRestrictions: '/notifications/scopes-restrictions',
  },
  insitu: {
    cameraList: '/cameras/',
    getMedia: '/cameras/media/',
    setFavorite: '/cameras/media/:media_id/favorite/',
    getSources: '/cameras/media/sources',
    getTags: '/cameras/media/tags',
  },
  chatbot: {
    reports: {
      getReports: '/chatbot/reports',
      getReportInfo: '/chatbot/reports/:report_id',
    },
    comms: {
      getAll: '/chatbot/communications',
      createMsg: '/chatbot/communications',
    },
    missions: {
      getMissions: '/chatbot/missions',
      getMissionInfo: '/chatbot/missions/:mission_id',
      createMission: '/chatbot/missions',
    },
    people: {
      getAll: '/chatbot/people',
    },
  },
};
