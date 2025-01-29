import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerRequest } from "./api/register";

export const UserRegister = () => {
  const [formData, setFormData] = useState({
    tipo: "Pessoa", // Valor inicial
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    cpf: "",
    cnpj: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const toggleTipo = () => {
    setFormData((prevData) => ({
      ...prevData,
      tipo: prevData.tipo === "Pessoa" ? "Empresa" : "Pessoa",
      cpf: "",
      cnpj: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (formData.tipo === "Pessoa" && !formData.cpf) {
      setError("O campo CPF é obrigatório para usuários do tipo Pessoa.");
      return;
    }

    if (formData.tipo === "Empresa" && !formData.cnpj) {
      setError("O campo CNPJ é obrigatório para usuários do tipo Empresa.");
      return;
    }

    setError("");

    try {
      const registerData = {
        tipo: formData.tipo,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        ...(formData.tipo === "Pessoa" && { cpf: formData.cpf }),
        ...(formData.tipo === "Empresa" && { cnpj: formData.cnpj }),
      };

      await registerRequest(registerData);

      toast.success("Cadastro realizado com sucesso!");
      setTimeout(() => navigate("/auth/user"), 2000);
    } catch (error) {
      toast.error("Erro ao realizar o cadastro. Tente novamente.");
    }
  };

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-2xl p-10 w-[70vh] h-auto space-y-8">
      <h2 className="text-4xl font-extrabold text-center text-white">Cadastro</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
        {/* Tipo (Alternável) */}
        <div className="col-span-2 text-center">
          <span className="text-lg font-semibold text-white">
            Cadastro:
            <button
              type="button"
              onClick={toggleTipo}
              className="text-blue-400 underline ml-2 hover:text-blue-600 transition duration-300"
            >
              {formData.tipo}
            </button>
          </span>
        </div>

        {/* Campo Nome */}
        <div>
          <label htmlFor="name" className="block text-lg font-bold text-white">
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
          <label htmlFor="email" className="block text-lg font-bold text-white">
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

        {/* Campo CPF ou CNPJ */}
        <div>
          <label
            htmlFor={formData.tipo === "Pessoa" ? "cpf" : "cnpj"}
            className="block text-lg font-bold text-white"
          >
            {formData.tipo === "Pessoa" ? "CPF" : "CNPJ"}
          </label>
          <input
            id={formData.tipo === "Pessoa" ? "cpf" : "cnpj"}
            name={formData.tipo === "Pessoa" ? "cpf" : "cnpj"}
            type="text"
            value={formData.tipo === "Pessoa" ? formData.cpf : formData.cnpj}
            onChange={handleChange}
            required
            placeholder={`Digite seu ${formData.tipo === "Pessoa" ? "CPF" : "CNPJ"}`}
            className="w-full mt-3 rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Campo Telefone */}
        <div>
          <label htmlFor="phone" className="block text-lg font-bold text-white">
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
          <label htmlFor="password" className="block text-lg font-bold text-white">
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
          <label htmlFor="confirmPassword" className="block text-lg font-bold text-white">
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

        {/* Erro */}
        {error && <p className="text-lg text-red-600 text-center col-span-2">{error}</p>}

        <div className="col-span-2 mt-6">
          <button
            type="submit"
            className="w-full bg-[#0D2C40] text-white py-4 text-xl font-bold rounded-lg hover:bg-[#1D4A7C] transition duration-300 ease-in-out"
          >
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
};
