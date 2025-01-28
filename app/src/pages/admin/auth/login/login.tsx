import React, { useState } from 'react';
import { CaretDoubleLeft } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Video } from '@/pages/public/main/components/video';
import { login } from './api/login';

export const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password); 
            navigate('/admin/dashboard'); 
        } catch (error) {
            toast.error('Erro no login. Por favor, verifique suas credenciais.');
        }
    };

    return (
      <div className="relative w-screen h-screen overflow-hidden">
          <Video />
          <button
              className="absolute top-4 left-4 text-white hover:text-gray-300 z-10"
              onClick={() => navigate('/login')}
          >
              <CaretDoubleLeft size={128} />
          </button>

            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-4">
                <div className="bg-white rounded-xl shadow-lg p-6 w-[40vh] h-[45vh] ml-[15vh] -mb-[5vh]">
                    <h2 className="text-lg font-bold mb-4 text-black">
                        Login para funcionários
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Digite seu email"
                                className="w-full mt-1 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Senha
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Digite sua senha"
                                className="w-full mt-1 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full rounded-md bg-[#3c50e0] px-4 py-2 text-sm font-semibold text-white shadow-md transition duration-200 ease-in-out hover:bg-[#324abc] focus:outline-none focus:ring-2 focus:ring-[#3c50e0] focus:ring-offset-1"
                            >
                                Entrar
                            </button>
                        </div>
                    </form>
                </div>

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
