import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { requestPasswordReset } from './api/RequestPasswordReset';

export const RequestPasswordReset = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await requestPasswordReset(email);
      toast.success('Link de redefinição de senha enviado com sucesso.');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao solicitar redefinição de senha.');
    }
  };

  return (
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-2xl p-10 w-[50vh] h-auto space-y-8">
        <h2 className="text-5xl font-extrabold text-center text-white">
          Redefinição de Senha
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label
              htmlFor="email"
              className="block text-xl font-semibold text-white"
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
              className="w-full mt-2 rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-[#0D2C40] text-white py-5 text-2xl font-bold rounded-lg hover:bg-[#1D4A7C] transition duration-300 ease-in-out"
            >
              Enviar Link
            </button>
          </div>
        </form>
        <p className="text-2xl mt-6 text-center text-white">
          Lembrou da senha?{' '}
          <a
            href="/auth/select"
            className="text-2xl text-[#0D2C40] hover:underline transition duration-300 ease-in-out"
          >
            Faça login
          </a>
        </p>
      </div>
  );
};
