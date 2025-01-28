import { redirect, RouteObject } from 'react-router-dom';
import { Home } from './main/nested/home/home';
import { About } from './main/nested/about/about';
import { Services } from './main/nested/clients/services';
import { Contact } from './main/nested/contact/contact';
import { Auth } from './auth/auth';
import { AdminLogin } from './auth/nested/adminLogin/login';
import { UserLogin } from './auth/nested/userLogin/login';
import { SelectLogin } from './auth/nested/selectLogin/select';
import { UserRegister } from './auth/nested/userRegister/register';

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
    path: "/auth",
    element: <Auth />,
    children: [
      {
        path: "select",
        element: <SelectLogin />,
      },
      {
        path: "admin",
        element: <AdminLogin />,
      },
      {
        path: "user",
        element: <UserLogin />,
      },
      {
        path: "register",
        element: <UserRegister />,
      },
    ],
  },
];

export default routes;
