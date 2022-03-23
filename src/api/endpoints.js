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
    roles: '/roles/',
    termsNconditions: '/api/documents/terms-current',
    privacyPolicy: '/api/documents/privacy-current'
  }
};

