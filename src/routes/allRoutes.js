
//Pages
import SignIn from '../pages/Authentication/SignIn';
import SignUp from '../pages/Authentication/SignUp';
import ForgotPassword from '../pages/Authentication/ForgotPassword';
import PageOne from '../pages/PageOne';
import PageTwo from '../pages/PageTwo';

const publicRoutes = [
  { path: 'auth/sign-in', component: SignIn },
  { path: 'auth/sign-up', component: SignUp },
  { path: 'auth/forgot-password', component: ForgotPassword },

]
const privateRoutes = [
  { path: '/dashboard', component: PageOne },
  { path: '/fire-alerts', component: PageTwo },
]

export { publicRoutes, privateRoutes }
