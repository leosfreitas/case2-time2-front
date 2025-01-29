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
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-2xl p-10 w-[70vh] h-auto space-y-8">
            <h2 className="text-4xl font-extrabold text-center text-white">
                Cadastro
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
                {/* Campo Nome */}
                <div>
                    <label
                        htmlFor="name"
                        className="block text-lg font-bold text-white"
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
                        className="w-full mt-3 rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                </div>

                {/* Campo Email */}
                <div>
                    <label
                        htmlFor="email"
                        className="block text-lg font-bold text-white"
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
                        className="w-full mt-3 rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                </div>

                {/* Campo CPF */}
                <div>
                    <label
                        htmlFor="cpf"
                        className="block text-lg font-bold text-white"
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
                        className="w-full mt-3 rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                </div>

                {/* Campo Telefone */}
                <div>
                    <label
                        htmlFor="phone"
                        className="block text-lg font-bold text-white"
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
                        className="w-full mt-3 rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                </div>

                {/* Campo Senha */}
                <div>
                    <label
                        htmlFor="password"
                        className="block text-lg font-bold text-white"
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
                        className="w-full mt-3 rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                </div>

                {/* Campo Confirmar Senha */}
                <div>
                    <label
                        htmlFor="confirmPassword"
                        className="block text-lg font-bold text-white"
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
                        className="w-full mt-3 rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                </div>
            </form>

            {error && <p className="text-lg text-red-600 text-center mt-2">{error}</p>}

            <div className="mt-6">
                <button
                    type="submit"
                    className="w-full bg-[#0D2C40] text-white py-4 text-xl font-bold rounded-lg hover:bg-[#1D4A7C] transition duration-300 ease-in-out"
                >
                    Cadastrar
                </button>
            </div>

            <p className="text-2xl mt-6 text-center text-lg text-white">
                Já tem uma conta?{' '}
                <a
                    href="/auth/user"
                    className="text-2xl text-[#0D2C40] hover:underline transition duration-300 ease-in-out"
                >
                    Faça login
                </a>
            </p>
        </div>
    );
};
