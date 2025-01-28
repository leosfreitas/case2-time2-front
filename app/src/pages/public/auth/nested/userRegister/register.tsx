import React, { useState } from 'react';
import { CaretDoubleLeft } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Video } from '@/pages/public/main/components/video';
import { registerRequest } from './api/register';

export const UserRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        cpf: '',
        phone: '',
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        setError('');

        try {
            await registerRequest({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                cpf: formData.cpf,
                phone: formData.phone,
            });

            toast.success('Cadastro realizado com sucesso!');
            setTimeout(() => navigate('/user/auth/login'), 2000);
        } catch (error) {
            toast.error('Erro ao realizar o cadastro. Tente novamente.');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 w-[40vh] h-[65vh] ml-[15vh] -mb-[5vh]">
            <h2 className="text-lg font-bold mb-4 text-black">
                Cadastre-se no TeleConnect
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Nome Completo
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Digite seu nome completo"
                        className="w-full mt-1 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

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
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Digite seu email"
                        className="w-full mt-1 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label
                        htmlFor="cpf"
                        className="block text-sm font-medium text-gray-700"
                    >
                        CPF
                    </label>
                    <input
                        id="cpf"
                        name="cpf"
                        type="text"
                        value={formData.cpf}
                        onChange={handleChange}
                        required
                        placeholder="Digite seu CPF"
                        className="w-full mt-1 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Telefone
                    </label>
                    <input
                        id="phone"
                        name="phone"
                        type="text"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="Digite seu telefone"
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
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Digite sua senha"
                        className="w-full mt-1 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Confirmar Senha
                    </label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder="Digite novamente sua senha"
                        className="w-full mt-1 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

                <div>
                    <button
                        type="submit"
                        className="w-full rounded-md bg-[#3c50e0] px-4 py-2 text-sm font-semibold text-white shadow-md transition duration-200 ease-in-out hover:bg-[#324abc] focus:outline-none focus:ring-2 focus:ring-[#3c50e0] focus:ring-offset-1"
                    >
                        Cadastrar
                    </button>
                </div>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
                Já tem uma conta?{' '}
                <a
                    href="/user/auth/login"
                    className="font-medium text-[#3c50e0] hover:underline"
                >
                    Faça login
                </a>
            </p>
        </div>
    );
};
