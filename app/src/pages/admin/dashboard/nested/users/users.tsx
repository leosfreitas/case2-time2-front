import React, { useState, useEffect, useRef } from "react";
import { getAllUsers, deleteUser } from "./api/users";
import { Trash, X } from "@phosphor-icons/react";
import toast from "react-hot-toast";

interface User {
  _id: string; // Alterado para _id
  name?: string;
  email: string;
}

export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const deleteTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getAllUsers();
        console.log("Dados recebidos:", data); // Para depuração

        if (Array.isArray(data)) {
          setUsers(data);
        } else if (data.data && Array.isArray(data.data)) {
          setUsers(data.data);
        } else {
          toast.error("Formato de dados inesperado.");
          setUsers([]);
        }
      } catch (error: any) {
        toast.error("Erro ao buscar usuários: " + error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();

    // Limpar o timeout ao desmontar o componente
    return () => {
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current);
      }
    };
  }, []);

  const handleDelete = async (userId: string) => {
    if (pendingDelete !== userId) {
      toast.error("Confirme a exclusão clicando novamente ou cancele.");
      setPendingDelete(userId);
      // Iniciar o temporizador para resetar após 5 segundos
      deleteTimeoutRef.current = window.setTimeout(() => setPendingDelete(null), 5000);
      return;
    }

    try {
      await deleteUser(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId)); // Alterado para _id
      toast.success("Usuário excluído com sucesso.");
      setPendingDelete(null);
    } catch (error: any) {
      toast.error("Erro ao excluir usuário: " + error.message);
    }
  };

  const handleCancelDelete = () => {
    if (deleteTimeoutRef.current) {
      clearTimeout(deleteTimeoutRef.current);
    }
    setPendingDelete(null);
    toast("Exclusão cancelada.", { icon: "ℹ️" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl sm:text-4xl text-gray-600">Carregando usuários...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center mt-10 text-2xl sm:text-4xl">
        Erro: {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      <h1 className="text-3xl sm:text-6xl font-bold mb-6 sm:mb-12">Lista de usuários</h1>

      {users.length === 0 ? (
        <p className="text-2xl sm:text-4xl text-gray-600 text-center">
          Nenhum usuário encontrado.
        </p>
      ) : (
        <div className="space-y-4 sm:space-y-8">
          {users.map((user) => (
            <div
              key={user._id} // Alterado para _id
              className="w-full lg:w-[100vh] transition-all duration-300 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-4 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-2xl"
            >
              <div className="text-xl sm:text-2xl md:text-3xl mb-4 md:mb-0">
                <p>
                  <strong>Nome:</strong> {user.name || "Nome não informado"}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                {pendingDelete === user._id ? ( // Alterado para _id
                  <>
                    <button
                      className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg sm:text-2xl px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center gap-2"
                      onClick={() => handleDelete(user._id)} // Alterado para _id
                    >
                      <Trash size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
                      Confirmar
                    </button>
                    <button
                      className="bg-gray-500 hover:bg-gray-600 text-white font-bold text-lg sm:text-2xl px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center gap-2"
                      onClick={handleCancelDelete}
                    >
                      <X size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white font-bold text-lg sm:text-2xl px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center gap-2 sm:gap-4"
                    onClick={() => handleDelete(user._id)} // Alterado para _id
                  >
                    <Trash size={24} className="w-6 h-6 sm:w-8 sm:h-8" />
                    Excluir
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};