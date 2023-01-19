
//Pages
import Authentication from '../pages/Authentication';
import SelectArea from '../pages/Authentication/SelectArea';
import MyProfile from '../pages/MyProfile';
import FireAlerts from '../pages/FireAlerts';
import DataLayerDashboard from '../pages/DataLayer';
import Dashboard from '../pages/Dashboard';
import EventAlerts from '../pages/Events';
import EventDashboard from '../pages/Events/Dashboard';
import SocialMonitoring from '../pages/SocialMonitoring';
import Notifications from '../pages/Notifications';
import InSituAlerts from '../pages/In-situ';
import Chatbot from '../pages/Chatbot';
import ReportsDashboard from '../pages/Chatbot/Reports/Dashboard';
import Pages404 from '../Utility/pages-404';
import Pages500 from '../Utility/pages-500';
import NewDashboard from '../pages/Dashboard';

const publicRoutes = [
  { path: 'auth/:currentPage', component: Authentication },
  { path: 'auth/:currentPage/:operation/:otp/:uid', component: Authentication },
  { path: 'user/select-aoi', component: SelectArea },
  { path: '/pages-404', component: Pages404 },
  { path: '/pages-500', component: Pages500 },
]

const privateRoutes = [
  { path: '/', component: NewDashboard },
  { path: '/my-profile/:operation', component: MyProfile },
  { path: '/fire-alerts', component: FireAlerts },
  { path: '/data-layer', component: DataLayerDashboard },
  { path: '/event-alerts', component: EventAlerts },
  { path: '/event-dashboard/:id', component: EventDashboard },
  { path: '/dashboard', component: Dashboard },
  { path: '/social-monitoring', component: SocialMonitoring },
  { path: '/notifications', component: Notifications },
  { path: '/insitu-alerts', component: InSituAlerts },
  { path: '/reports-dashboard/:id', component: ReportsDashboard },
  { path: '/chatbot', component: Chatbot },
]

export { publicRoutes, privateRoutes }
