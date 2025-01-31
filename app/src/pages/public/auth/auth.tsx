import { CaretDoubleLeft } from '@phosphor-icons/react';
import { useNavigate, useLocation } from "react-router-dom";
import { Video } from '@/pages/public/main/components/video';
import { Route, Routes } from 'react-router-dom';
import { SelectLogin } from './nested/selectLogin/select';
import { AdminLogin } from './nested/adminLogin/login';
import { UserLogin } from './nested/userLogin/login';
import { UserRegister } from './nested/userRegister/register';
import { RequestPasswordReset } from './nested/resetPass/RequestPasswordReset';
import { PasswordReset } from './nested/resetPass/PasswordReset';

export const Auth = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const backRoutes: { [key: string]: string } = {
        "/auth/select": "/home",
        "/auth/admin": "/auth/select",
        "/auth/user": "/auth/select",
        "/auth/register": "/home",
        "/auth/reset-password": "/auth/select",
        "auth/reset-password/:token": "/auth/select",
    };

    const handleBack = () => {
        const currentPath: string = location.pathname;
        const backPath = backRoutes[currentPath] || "/home"; 
        navigate(backPath);
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden">
            {/* O vídeo sempre no fundo */}
            <Video />

            {/* Botão de voltar por cima de tudo */}
            <button
                className="absolute top-4 left-4 text-white hover:text-gray-300 z-30"
                onClick={handleBack}
            >
                <CaretDoubleLeft size={50} />
            </button>

            {/* 
                Fundo preto fosco SEMPRE presente (não desaparece).
                O texto agora está **garantido** que aparecerá quando a tela for maior que 1700px.
            */}
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-start p-4 z-10">
                    {location.pathname !== "/auth/register" && (
                        <div className="hidden min-[1700px]:block text-white ml-[10vh] z-20">
                        <h1 className="text-8xl font-bold leading-tight">Conectando</h1>
                        <h1 className="text-8xl font-bold leading-tight">pessoas através</h1>
                        <h1 className="text-8xl font-bold leading-tight">da tecnologia</h1> 
                        </div>
                    )}
                    </div>


            {/* Rotas (SelectLogin, AdminLogin etc.) */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
                <Routes>
                    <Route path="select" element={<SelectLogin />} />
                    <Route path="admin" element={<AdminLogin />} />
                    <Route path="user" element={<UserLogin />} />
                    <Route path="register" element={<UserRegister />} />
                    <Route path="reset-password" element={<RequestPasswordReset />} />
                    <Route path="reset-password/:token" element={<PasswordReset />} />
                </Routes>
            </div>
        </div>
    );
};
