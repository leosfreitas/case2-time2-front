import { CaretDoubleLeft } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { Video } from '@/pages/public/main/components/video';

export const PublicLogin = () => {
    const navigate = useNavigate();

    return (
        <div className="relative w-screen h-screen overflow-hidden">
            <Video />
            <button
                className="absolute top-4 left-4 text-white hover:text-gray-300 z-10"
                onClick={() => navigate('/home')}
            >
                <CaretDoubleLeft size={128} />
            </button>

            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-4">
                {/* Caixa de Login */}
                <div className="bg-white rounded-xl shadow-lg p-6 w-[40vh] h-[45vh] ml-[15vh] -mb-[5vh]">
                    <h2 className="text-lg font-bold mb-4 text-black">
                        Selecione o Login
                    </h2>
                    <button
                        className="w-full bg-black text-white py-3 rounded-lg mb-4 hover:bg-gray-800"
                        onClick={() => navigate('/user/auth/login')} // Redireciona para login de clientes
                    >
                        PARA CLIENTES
                    </button>
                    <button
                        className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
                        onClick={() => navigate('/admin/auth/login')} // Redireciona para login de funcionários
                    >
                        PARA FUNCIONÁRIOS
                    </button>

                </div>

                {/* Texto à esquerda */}
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
