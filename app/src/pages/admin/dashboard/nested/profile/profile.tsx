import React, { useState, useEffect } from "react";
import { getAdminData, updateAdminData, requestPasswordReset } from "./api/profile";
import toast from "react-hot-toast";

export const Profile = () => {
  const [adminData, setAdminData] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const data = await getAdminData();
      setAdminData(data);
      setName(data.name);
      setEmail(data.email);
      setResetEmail(data.email);
      setCpf(data.cpf);
      setPhone(data.phone);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar os dados do perfil.");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateAdminData(name, email, cpf, phone);
      toast.success("Dados atualizados com sucesso!");
      fetchAdminData();
      setIsEditing(false);
    } catch (error) {
      toast.error("Erro ao atualizar os dados.");
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await requestPasswordReset(resetEmail);
      toast.success("Link de redefinição de senha enviado com sucesso.");
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Erro ao solicitar redefinição de senha.");
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen py-12 px-4">
      <div className="w-full max-w-3xl bg-white p-10 shadow-xl rounded-lg">
        <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Dados do Perfil</h2>
        {adminData ? (
          isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-8">
              <div>
                <label className="block text-2xl font-medium text-gray-700">Nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-2 border border-gray-300 rounded-lg px-5 py-4 text-2xl"
                />
              </div>
              <div>
                <label className="block text-2xl font-medium text-gray-700">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-2 border border-gray-300 rounded-lg px-5 py-4 text-2xl"
                />
              </div>
              <div>
                <label className="block text-2xl font-medium text-gray-700">CPF</label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  className="w-full mt-2 border border-gray-300 rounded-lg px-5 py-4 text-2xl"
                />
              </div>
              <div>
                <label className="block text-2xl font-medium text-gray-700">Telefone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full mt-2 border border-gray-300 rounded-lg px-5 py-4 text-2xl"
                />
              </div>
              <div className="flex justify-end space-x-6 mt-8">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-8 py-4 bg-gray-400 text-gray-900 rounded-lg hover:bg-gray-500 text-2xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-2xl"
                >
                  Salvar
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-8">
              <div>
                <label className="block text-2xl font-medium text-gray-700">Nome</label>
                <p className="mt-2 px-5 py-4 bg-gray-100 rounded-lg text-2xl">{name}</p>
              </div>
              <div>
                <label className="block text-2xl font-medium text-gray-700">E-mail</label>
                <p className="mt-2 px-5 py-4 bg-gray-100 rounded-lg text-2xl">{email}</p>
              </div>
              <div>
                <label className="block text-2xl font-medium text-gray-700">CPF</label>
                <p className="mt-2 px-5 py-4 bg-gray-100 rounded-lg text-2xl">{cpf}</p>
              </div>
              <div>
                <label className="block text-2xl font-medium text-gray-700">Telefone</label>
                <p className="mt-2 px-5 py-4 bg-gray-100 rounded-lg text-2xl">{phone}</p>
              </div>
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-2xl"
                >
                  Editar
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 text-2xl"
                >
                  Redefinir Senha
                </button>
              </div>
            </div>
          )
        ) : (
          <p className="text-center text-gray-500 text-2xl">Carregando...</p>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-10 rounded-lg shadow-xl w-full max-w-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Redefinir Senha</h2>
            <form onSubmit={handlePasswordReset} className="space-y-6">
              <div>
                <label className="block text-2xl font-medium text-gray-700">E-mail</label>
                <input
                  type="email"
                  value={resetEmail}
                  readOnly
                  className="w-full mt-2 border border-gray-300 rounded-lg px-5 py-4 text-2xl bg-gray-100 cursor-not-allowed"
                  required
                />
              </div>
              <div className="flex justify-center space-x-6 mt-8">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-4 bg-gray-400 text-gray-900 rounded-lg hover:bg-gray-500 text-2xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-2xl"
                >
                  Enviar Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};