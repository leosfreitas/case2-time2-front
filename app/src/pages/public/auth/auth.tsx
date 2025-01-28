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

    return (
        <div className="relative w-screen h-screen overflow-hidden">
            <Video />
        <button
            className="absolute top-4 left-4 text-white hover:text-gray-300 z-10"
            onClick={() => navigate(-1)}
        >
            <CaretDoubleLeft size={128} />
        </button>

            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-4">

                <Routes>
                    <Route path="select" element={<SelectLogin />}/>
                    <Route path="admin" element={<AdminLogin />}/>
                    <Route path="user" element={<UserLogin />}/>
                    <Route path="user/register" element={<UserRegister />}/>
                </Routes>

                <div className="text-white mb-[10vh] ml-[18vh]">
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
            </div>
        </div>
    );
};
