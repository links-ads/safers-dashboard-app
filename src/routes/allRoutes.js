
//Pages
import Authentication from '../pages/Authentication';
import ForgotPassword from '../pages/Authentication/ForgotPassword';
import PageOne from '../pages/PageOne';
import PageTwo from '../pages/PageTwo';

const publicRoutes = [
  { path: 'auth/:activeTab', component: Authentication },
  { path: 'auth/forgot-password', component: ForgotPassword },
  { path: '/', component: Authentication },
]
const privateRoutes = [
  { path: '/dashboard', component: PageOne },
  { path: '/fire-alerts', component: PageTwo },
]

export { publicRoutes, privateRoutes }
