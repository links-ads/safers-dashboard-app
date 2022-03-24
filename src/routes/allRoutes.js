
//Pages
import Authentication from '../pages/Authentication';
import SelectArea from '../pages/Authentication/SelectArea';
import MyProfile from '../pages/MyProfile';
import FireAlerts from '../pages/FireAlerts';
import Dashboard from '../pages/Dashboard';

const publicRoutes = [
  { path: 'auth/:currentPage', component: Authentication },
  { path: 'auth/:currentPage/:operation/:otp/:uid', component: Authentication },
  { path: 'user/select-aoi', component: SelectArea },
]

const privateRoutes = [
  { path: '/', component: Dashboard },
  { path: '/dashboard', component: Dashboard },
  { path: '/my-profile/:operation', component: MyProfile },
  { path: '/fire-alerts', component: FireAlerts },
]

export { publicRoutes, privateRoutes }
