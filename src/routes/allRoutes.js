
//Pages
import Authentication from '../pages/Authentication';
import SelectArea from '../pages/Authentication/SelectArea';
import MyProfile from '../pages/MyProfile';
import FireAlerts from '../pages/FireAlerts';
import PageOne from '../pages/PageOne';

const publicRoutes = [
  { path: 'auth/:currentPage', component: Authentication },
  { path: 'auth/:currentPage/:operation/:otp/:uid', component: Authentication },
  { path: 'user/select-aoi', component: SelectArea },
]

const privateRoutes = [
  { path: '/', component: PageOne },
  { path: '/dashboard', component: PageOne },
  { path: '/fire-alerts', component: FireAlerts },
  { path: '/my-profile/:operation', component: MyProfile },
]

export { publicRoutes, privateRoutes }
