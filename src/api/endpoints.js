export const endpoints = {
  authentication: {
    signIn: '/sign-in.json',//.json for mock response
    signUp: '/sign-up',
    forgotPassword: '/res-success.json'
  },
  myprofile: {
    getInfo: '/my-profile.json',
    updateInfo: '/my-profile.json',
  },
  getFavoriteIngredients: '/ingredients/favorite',
  addToFavoriteIngredients: '/ingredients/add-to/favorite'
};
