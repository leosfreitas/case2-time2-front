import { CaretDoubleLeft } from '@phosphor-icons/react';
import { useNavigate, useLocation } from "react-router-dom";
import { Video } from '@/pages/public/main/components/video';
import { Route, Routes } from 'react-router-dom';
import { SelectLogin } from './nested/selectLogin/select';
import { AdminLogin } from './nested/adminLogin/login';
import { UserLogin } from './nested/userLogin/login';
import { UserRegister } from './nested/userRegister/register';

export const Auth = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const backRoutes: { [key: string]: string } = {
        "/auth/select": "/home",
        "/auth/admin": "/auth/select",
        "/auth/user": "/auth/select",
        "/auth/register": "/auth/user",
    };

    const handleBack = () => {
        const currentPath: string = location.pathname;
        const backPath = backRoutes[currentPath] || "/home"; 
        navigate(backPath);
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden">
            <Video />
            <button
                className="absolute top-4 left-4 text-white hover:text-gray-300 z-10"
                onClick={handleBack}
            >
                <CaretDoubleLeft size={100} />
            </button>


            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-start p-4">
                <div className="text-white ml-[10vh]">
                <h1 className="text-7xl font-bold leading-tight">
                    Conectando
                </h1>
                <h1 className="text-7xl font-bold leading-tight">
                    pessoas através
                </h1>
                <h1 className="text-7xl font-bold leading-tight">
                    da tecnologia
                </h1> 
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
                <Routes>
                    <Route path="select" element={<SelectLogin />}/>
                    <Route path="admin" element={<AdminLogin />}/>
                    <Route path="user" element={<UserLogin />}/>
                    <Route path="register" element={<UserRegister />}/>
                </Routes>
            </div>

            </div>
        </div>
    );
};
