import { redirect, RouteObject } from 'react-router-dom';
import { Dashboard } from './dashboard/dashboard';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { RequestPasswordReset } from './auth/reset-password/RequestPasswordReset';
import { PasswordReset } from './auth/reset-password/PasswordReset';
import { Home } from './dashboard/nested/home/homepage';
import { Profile } from './dashboard/nested/profile/profile';
import { Finances } from './dashboard/nested/finances/finances';
import { Budget } from './dashboard/nested/budget/budget';
import { History } from './dashboard/nested/history/history';
import { checkToken } from './auth/token/api/CheckToken';

const routes: RouteObject[] = [
  {
    path: "/",
    loader: async () => {
      try {
        await checkToken(); 
        return redirect('/user/dashboard'); 
      } catch (error) {
        return redirect('/user/auth/login'); 
      }
    },
  },
  {
    path: "user/auth/login",
    element: <Login />,
    id: "login",
  },
  {
    path: "user/auth/register",
    element: <Register />,
    id: "register",
  },
  {
    path: "user/auth/pwd/recovery/email",
    element: <RequestPasswordReset />,
    id: "password-recovery-request",
  },
  {
    path: "user/auth/reset/pwd/:token",
    element: <PasswordReset />,
    id: "password-reset",
  },

  {
    path: "user/dashboard",
    element: <Dashboard />,
    id: "dashboard",
    loader: async () => {
      try {
        await checkToken();
        return null;
      } catch (error) {
        return redirect('/user/auth/login');
      }
    },
    children: [
      {
        index: true,
        loader: async () => redirect('/user/dashboard/home'),
      },
      {
        path: "home",
        element: <Home />,
        id: "home",
      },
      {
        path: "profile",
        element: <Profile />,
        id: "profile",
      },
      {
        path: "finances",
        element: <Finances />,
        id: "finances",
      },
      {
        path: "budget",
        element: <Budget />,
        id: "budget",
      },
      {
        path: "history",
        element: <History />,
        id: "history",
      },
    ],
  },
];

export default routes;
