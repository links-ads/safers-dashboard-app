
//Pages
import Authentication from '../pages/Authentication';
import MyProfile from '../pages/MyProfile';
import PageTwo from '../pages/PageTwo';

const publicRoutes = [
  { path: 'auth/:currentPage', component: Authentication },

]
const privateRoutes = [
  { path: '/dashboard', component: PageTwo },
  { path: '/my-profile/:operation', component: MyProfile },
]

export { publicRoutes, privateRoutes }
