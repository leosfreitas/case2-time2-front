import { redirect, RouteObject } from 'react-router-dom';
import { Dashboard } from './dashboard/dashboard';
import { checkToken } from './auth/token/api/CheckToken';
import { Home } from './dashboard/nested/home/homepage';
import { Profile } from './dashboard/nested/profile/profile';
import { Contato } from './dashboard/nested/contato/contato';
import { Pacotes } from './dashboard/nested/pacotes/pacotes';
import { Sac } from './dashboard/nested/sac/sac';

const routes: RouteObject[] = [
//   {
//     path: "admin/auth/pwd/recovery/email",
//     element: <RequestPasswordReset />,
//     id: "password-recovery-request",
//   },
//   {
//     path: "admin/auth/reset/pwd/:token",
//     element: <PasswordReset />,
//     id: "password-reset",
//   },
  {
    path: "admin/dashboard",
    element: <Dashboard />,
    id: "admin-dashboard",
    loader: async () => {
      try {
        await checkToken();
        return null;
      } catch (error) {
        return redirect('/admin/auth/login');
      }
    },
    children: [
      {
        index: true,
        loader: async () => redirect('/admin/dashboard/home'),
      },
      {
        path: "home",
        element: <Home />,
        id: "admin-home",
      },
      {
        path: "profile",
        element: <Profile />,
        id: "admin-profile",
      },
      {
        path: "contato",
        element: <Contato />,
        id: "admin-contato",
      },
      {
        path: "pacotes",
        element: <Pacotes />,
        id: "admin-pacotes",
      },
      {
        path: "sac",
        element: <Sac />,
        id: "admin-sac",
      },
    ],
  },
];

export default routes;
