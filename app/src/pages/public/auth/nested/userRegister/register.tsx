import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
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
            setTimeout(() => navigate('/auth/user'), 2000);
        } catch (error) {
            toast.error('Erro ao realizar o cadastro. Tente novamente.');
        }
    };

    return (
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-[40vh] h-auto space-y-6">
            <h2 className="text-3xl font-bold text-center text-white">
                Cadastro de Cliente
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-white"
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
                        className="w-full mt-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-white"
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
                        className="w-full mt-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                </div>

                <div>
                    <label
                        htmlFor="cpf"
                        className="block text-sm font-medium text-white"
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
                        className="w-full mt-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                </div>

                <div>
                    <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-white"
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
                        className="w-full mt-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-white"
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
                        className="w-full mt-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                </div>

                <div>
                    <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-white"
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
                        className="w-full mt-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                </div>

                {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

                <div>
                    <button
                        type="submit"
                        className="w-full bg-[#0D2C40] text-white py-3 rounded-lg hover:bg-[#1D4A7C] transition duration-300 ease-in-out"
                    >
                        Cadastrar
                    </button>
                </div>
            </form>

            <p className="mt-4 text-center text-base text-white">
                Já tem uma conta?{' '}
                <a
                    href="/auth/user"
                    className="font-medium text-[#1D4A7C] hover:underline transition duration-300 ease-in-out"
                >
                    Faça login
                </a>
            </p>
        </div>
    );
};
