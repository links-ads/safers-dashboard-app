
//Pages
import SignIn from '../pages/Authentication/SignIn';
import ForgotPassword from '../pages/Authentication/ForgotPassword';
import PageTwo from '../pages/PageTwo';




const publicRoutes = [
  { path: 'auth/sign-in', component: SignIn },
  { path: 'auth/sign-up', component: SignIn },
  { path: 'auth/forgot-password', component: ForgotPassword },

]

const privateRoutes = [
  { path: '/logout', component: PageTwo },
  { path: '/dashboard', component: PageTwo },
  { path: '/register', component: PageTwo }
]

export { publicRoutes, privateRoutes }
