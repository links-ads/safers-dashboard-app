
//Pages
import Authentication from '../pages/Authentication';
import SelectArea from '../pages/Authentication/SelectArea';
import MyProfile from '../pages/MyProfile';
import FireAlerts from '../pages/FireAlerts';
import DataLayer from '../pages/DataLayer';
import Dashboard from '../pages/Dashboard';
import EventAlerts from '../pages/Events';
import EventDashboard from '../pages/Events/Dashboard';
import SocialMonitoring from '../pages/SocialMonitoring';
import Notifications from '../pages/Notifications';
import InSituAlerts from '../pages/In-situ';
import Reports from '../pages/Reports';
import ReportsDashboard from '../pages/Reports/Dashboard';

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
  { path: '/data-layer', component: DataLayer },
  { path: '/event-alerts', component: EventAlerts },
  { path: '/event-dashboard/:id', component: EventDashboard },
  { path: '/social-monitoring', component: SocialMonitoring },
  { path: '/notifications', component: Notifications },
  { path: '/insitu-alerts', component: InSituAlerts },
  { path: '/reports', component: Reports },
  { path: '/reports-dashboard/:id', component: ReportsDashboard },
]

export { publicRoutes, privateRoutes }
