import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login } from './api/Login';

export const UserLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password); 
            navigate('/user/dashboard'); 
        } catch (error) {
            toast.error('Erro no login. Por favor, verifique suas credenciais.');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 w-[40vh] h-[45vh] ml-[15vh] -mb-[5vh]">
            <h2 className="text-lg font-bold mb-4 text-black">
                Login para clientes
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

            <p className="mt-6 text-center text-sm text-gray-600">
                Não tem uma conta?{' '}
                <a
                    href="/user/auth/register"
                    className="font-medium text-[#3c50e0] hover:underline"
                >
                    Cadastre-se
                </a>
            </p>
        </div>
    );
};
