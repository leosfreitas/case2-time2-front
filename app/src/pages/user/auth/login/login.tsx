import React, { useState } from 'react';
import { login } from './api/Login'; 
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'; 
import { TrendUp } from "@phosphor-icons/react";

export const Login = () => {
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
    <div className="flex min-h-screen items-center justify-center bg-[#eff3f7]">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <div className="flex justify-center mb-8">
        <TrendUp
            weight="bold"
            className="icon"
            style={{
              fontSize: "5rem", 
              color: "#3c50e0",
              borderRadius: "15%",
              marginTop: "3px",
              padding: "2px", 
              display: "inline-flex", 
              alignItems: "center", 
              justifyContent: "center",
            }}
          />
        </div>

        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Faça login na sua conta
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
            <div className="flex justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <a href="/user/auth/pwd/recovery/email" className="font-medium text-[#3c50e0] hover:underline">
                Esqueceu sua senha?
              </a>
            </div>
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
          <a href="/user/auth/register" className="font-medium text-[#3c50e0] hover:underline">
            Cadastre-se
          </a>
        </p>
      </div>
    </div>
  );
}
