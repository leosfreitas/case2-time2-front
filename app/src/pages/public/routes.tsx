import { redirect, RouteObject } from 'react-router-dom';
import { Home } from './main/nested/home/home';
import { About } from './main/nested/about/about';
import { Clients } from './main/nested/clients/clients';
import { Company } from './main/nested/company/company';
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
    path: "/clients",
    element: <Clients />,
  },
  {
    path: "/company",
    element: <Company />,
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
