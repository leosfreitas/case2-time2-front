import { redirect, RouteObject } from 'react-router-dom';
import { Dashboard } from './dashboard/dashboard';
import { Home } from './dashboard/nested/home/homepage';
import { Profile } from './dashboard/nested/profile/profile';
import { checkToken } from './auth/token/api/CheckToken';
import { Contato } from './dashboard/nested/contato/contato';
import { Pacotes } from './dashboard/nested/pacotes/pacotes';

const routes: RouteObject[] = [
  {
    path: "user/dashboard",
    element: <Dashboard />,
    id: "dashboard",
    loader: async () => {
      try {
        await checkToken();
        return null;
      } catch (error) {
        return redirect('/auth/select');
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
        path: "contato",
        element: <Contato />,
        id: "contato",
      },
      {
        path: "pacotes",
        element: <Pacotes />,
        id: "pacotes",
      },
    ],
  },
];

export default routes;
