import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
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
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-2xl p-10 w-[50vh] h-auto space-y-8">
            <h2 className="text-4xl font-extrabold text-center text-white">
                Login para Funcionários
            </h2>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                    <label
                        htmlFor="email"
                        className="block text-lg font-semibold text-white"
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
                        className="w-full mt-2 rounded-lg border border-gray-300 px-4 py-3 text-base text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="block text-lg font-semibold text-white"
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
                        className="w-full mt-2 rounded-lg border border-gray-300 px-4 py-3 text-base text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full bg-[#0D2C40] text-white py-4 text-xl font-bold rounded-lg hover:bg-[#1D4A7C] transition duration-300 ease-in-out"
                    >
                        Entrar
                    </button>
                </div>
            </form>

            <p className="text-2xl mt-6 text-center text-lg text-white">
                Esqueceu sua senha?{' '}
                <a
                    href="/auth/register"
                    className="text-2xl text-[#0D2C40] hover:underline transition duration-300 ease-in-out"
                >
                    Clique Aqui
                </a>
            </p>
        </div>
    );
};
