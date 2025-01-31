import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
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
      setTimeout(() => navigate('/auth/select'), 2000);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao redefinir a senha.');
    }
  };

  return (
    <div
      className="
        bg-white bg-opacity-10
        backdrop-blur-md
        rounded-xl
        shadow-lg

        p-4
        sm:p-6
        md:p-8

        w-full
        max-w-[300px]
        sm:max-w-[400px]
        md:max-w-[500px]

        h-auto

        flex
        flex-col
        items-center
        space-y-6
      "
    >
      <h2
        className="
          text-2xl
          sm:text-3xl
          md:text-5xl
          font-extrabold
          text-center
          text-white
        "
      >
        Redefinir Senha
      </h2>

      {/* Formulário ocupando toda a largura do container */}
      <form
        onSubmit={handleSubmit}
        className="
          w-full
          flex
          flex-col
          space-y-4
          sm:space-y-6
          md:space-y-8
        "
      >
        <div>
          <label
            htmlFor="password"
            className="
              block
              text-lg
              sm:text-xl
              md:text-2xl
              font-semibold
              text-white
            "
          >
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
            className="
              w-full
              mt-2
              rounded-lg
              border border-gray-300
              px-4
              py-2 sm:py-3 md:py-3
              text-base sm:text-lg md:text-lg
              text-gray-800
              placeholder-gray-500
              focus:border-blue-500
              focus:ring
              focus:ring-blue-200
            "
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="
              block
              text-lg
              sm:text-xl
              md:text-2xl
              font-semibold
              text-white
            "
          >
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
            className="
              w-full
              mt-2
              rounded-lg
              border border-gray-300
              px-4
              py-2 sm:py-3 md:py-3
              text-base sm:text-lg md:text-lg
              text-gray-800
              placeholder-gray-500
              focus:border-blue-500
              focus:ring
              focus:ring-blue-200
            "
          />
        </div>

        <button
          type="submit"
          className="
            w-full
            bg-[#0D2C40]
            text-white
            py-2 sm:py-3 md:py-4
            text-lg sm:text-xl md:text-2xl
            font-bold
            rounded-lg
            hover:bg-[#1D4A7C]
            transition
            duration-300
            ease-in-out
          "
        >
          Redefinir Senha
        </button>
      </form>
    </div>
  );
};
