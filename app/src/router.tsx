import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import userRoutes from './pages/user/routes';
import publicRoutes from './pages/public/routes';

export const router = createBrowserRouter([
    ...publicRoutes,
    ...userRoutes,
    {
        path: "/",
        element: <App />,
    }
]);

