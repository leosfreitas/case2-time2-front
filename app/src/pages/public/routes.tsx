import { redirect, RouteObject } from 'react-router-dom';
import { Home } from './main/nested/home/home';
import { About } from './main/nested/about/about';
import { Services } from './main/nested/clients/services';
import { Contact } from './main/nested/contact/contact';
import { PublicLogin } from './auth/publicLogin';

const routes: RouteObject[] = [
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/services",
    element: <Services />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/login",
    element: <PublicLogin />,
  },



];

export default routes;
