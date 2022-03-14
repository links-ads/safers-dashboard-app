export const endpoints = {
  authentication: {
    signIn: '/api/auth/login/',//.json for mock response
    signUp: '/api/auth/register/',
    forgotPassword: '/res-success.json'
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
