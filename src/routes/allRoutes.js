
//Pages
import Authentication from '../pages/Authentication';
import ForgotPassword from '../pages/Authentication/ForgotPassword';
import SelectArea from '../pages/Authentication/SelectArea';
import PageOne from '../pages/PageOne';
import PageTwo from '../pages/PageTwo';

const publicRoutes = [
  { path: 'auth/forgot-password', component: ForgotPassword },
  { path: 'auth/:currentPage', component: Authentication },
  { path: 'user/select-aoi', component: SelectArea },
]

const privateRoutes = [
  { path: '/', component: PageOne },
  { path: '/dashboard', component: PageOne },
  { path: '/fire-alerts', component: PageTwo },
]

export { publicRoutes, privateRoutes }
