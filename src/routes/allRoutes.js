
//Pages
import PageOne from '../pages/PageOne';
import PageTwo from '../pages/PageTwo';




const userRoutes = [
  { path: '/page1', component: PageOne },
]

const authRoutes = [
  { path: '/logout', component: PageTwo },
  { path: '/login', component: PageTwo },
  { path: '/forgot-password', component: PageTwo },
  { path: '/register', component: PageTwo }
]

export { userRoutes, authRoutes }
