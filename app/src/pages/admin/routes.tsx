import { redirect, RouteObject } from 'react-router-dom';
import { AdminLogin } from './auth/login/login';
import { Dashboard } from './dashboard/dashboard';
import { checkToken } from './auth/token/api/CheckToken';
import { Home } from './dashboard/nested/home/homepage';

const routes: RouteObject[] = [
  {
    path: "admin/auth/login",
    element: <AdminLogin />,
    id: "admin-login",
  },
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
      }
    ],
  },
];

export default routes;
