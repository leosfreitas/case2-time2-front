import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import { TrendUp } from '@phosphor-icons/react';
import { resetPassword } from './api/PasswordReset';

export const PasswordReset = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }

    try {
      await resetPassword(token!, formData.password);
      toast.success('Senha redefinida com sucesso.');
      setTimeout(() => navigate('/user/auth/login'), 2000);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao redefinir a senha.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eff3f7]">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <div className="flex justify-center mb-8">
          <TrendUp
            weight="bold"
            className="icon"
            style={{
              fontSize: '5rem',
              color: '#3c50e0',
              borderRadius: '15%',
              marginTop: '3px',
              padding: '2px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        </div>
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Redefinir Senha
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Nova Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Digite sua nova senha"
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirmar Nova Senha
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirme sua nova senha"
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-[#3c50e0] px-4 py-2 text-sm font-semibold text-white shadow-md transition duration-200 ease-in-out hover:bg-[#324abc] focus:outline-none focus:ring-2 focus:ring-[#3c50e0] focus:ring-offset-1"
            >
            Redefinir Senha
          </button>
        </form>
      </div>
    </div>
  );
};
