import { redirect, RouteObject } from 'react-router-dom';
import { Home } from './home/home';
import { About } from './about/about';
import { Clients } from './clients/clients';
import { Company } from './company/company';
import { Contact } from './contact/contact';

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
  }
];

export default routes;
