// AdminContatos.tsx (ou Contato.tsx)
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Chat, Trash, PaperPlaneRight } from "@phosphor-icons/react";
import toast from "react-hot-toast";

import {
  getAllAdminContatos,
  editAdminContato,
  deleteAdminContato,
} from "./api/adminContatosRequests";

type Contato = {
  _id: string;
  user_id: string;
  email: string;
  mensagem: string;
  resposta: string;
};

export const Contato = () => {
  // Guarda o objeto inteiro: { userId: Contato[] }
  const [contatosObj, setContatosObj] = useState<Record<string, Contato[]>>({});
  // Lista de userIds disponíveis (chaves do objeto)
  const [userIds, setUserIds] = useState<string[]>([]);
  // Qual userId está selecionado no dropdown
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  // Mesmo esquema do SAC
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [editingResposta, setEditingResposta] = useState<Record<string, string>>({});

  // 1) Carregamos os contatos
  useEffect(() => {
    async function fetchContatos() {
      try {
        // data é do tipo { userId: Contato[] }
        const data = await getAllAdminContatos();

        // Pegamos todas as chaves (userIds)
        const userKeys = Object.keys(data);

        setContatosObj(data);
        setUserIds(userKeys);

        // Se quiser, seleciona automaticamente o primeiro userId
        if (userKeys.length > 0) {
          setSelectedUserId(userKeys[0]);
        }
      } catch (error) {
        console.error("Erro ao buscar contatos:", error);
        toast.error("Ocorreu um erro ao buscar as perguntas. Tente novamente.");
      }
    }

    fetchContatos();
  }, []);

  // 2) Array de contatos do usuário selecionado
  const contatos = selectedUserId ? contatosObj[selectedUserId] || [] : [];

  // 3) Editar (responder) um contato
  async function handleEditResposta(contatoId: string) {
    if (!editingResposta[contatoId]) {
      toast.error("Digite uma resposta antes de salvar.");
      return;
    }

    try {
      // Envia a resposta
      await editAdminContato(contatoId, { resposta: editingResposta[contatoId] });
      toast.success("Resposta atualizada com sucesso!");

      // Recarrega objeto de contatos
      const updatedObj = await getAllAdminContatos();
      setContatosObj(updatedObj);

      // Atualiza a lista de userIds
      const userKeys = Object.keys(updatedObj);
      setUserIds(userKeys);

      // Se o userId selecionado ainda existir, permanece nele
      // Caso contrário, pode mudar para ""
      if (!updatedObj[selectedUserId]) {
        setSelectedUserId(userKeys[0] || "");
      }

      // Limpa o campo de resposta no state
      setEditingResposta((prev) => ({
        ...prev,
        [contatoId]: "",
      }));
    } catch (error) {
      console.error("Erro ao editar contato:", error);
      toast.error("Não foi possível editar a resposta. Tente novamente.");
    }
  }

  // 4) Deletar contato
  async function handleDeleteContato(contatoId: string, index: number) {
    try {
      await deleteAdminContato(contatoId);
      toast.success("Contato deletado com sucesso!");
  
      // Fecha o contato se ele estiver aberto
      if (expandedIndex === index) {
        setExpandedIndex(null);
      }
  
      // Recarrega objeto de contatos
      const updatedObj = await getAllAdminContatos();
      setContatosObj(updatedObj);
  
      const userKeys = Object.keys(updatedObj);
      setUserIds(userKeys);
  
      if (!updatedObj[selectedUserId]) {
        setSelectedUserId(userKeys[0] || "");
      }
    } catch (error) {
      console.error("Erro ao deletar contato:", error);
      toast.error("Não foi possível deletar. Tente novamente.");
    }
  }
  

  return (
    <div className="max-w-6xl mx-auto px-6 py-[20vh]">
      <h1 className="text-6xl font-bold mb-12">Perguntas do cliente</h1>

      {/* DROPDOWN para selecionar o userId */}
      <div className="mb-8">
        <label className="block text-xl font-bold mb-2">Selecione o cliente:</label>
        <select
          className="border-2 border-gray-300 rounded-md p-2 text-xl"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
        >
          {userIds.length === 0 && (
            <option value="">Nenhum usuário encontrado</option>
          )}
          {userIds.map((userId) => (
            <option key={userId} value={userId}>
              {userId}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Lista de Contatos */}
        <div className="col-span-2 space-y-6">
          {contatos.length === 0 ? (
            <p className="text-xl text-gray-600">
              Nenhuma pergunta para esse usuário.
            </p>
          ) : (
            contatos.map((contato, index) => (
                <details
                  key={contato._id}
                  className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6 cursor-pointer text-2xl"
                  open={expandedIndex === index}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).tagName === "TEXTAREA" || (e.target as HTMLElement).tagName === "BUTTON") {
                      e.stopPropagation(); // Impede que o evento de clique atinja o <details>
                      return;
                    }
                    setExpandedIndex(expandedIndex === index ? null : index);
                  }}
                >
                  <summary
                    className="font-bold flex justify-between items-center cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault(); // Impede o scroll automático
                      setExpandedIndex(expandedIndex === index ? null : index);
                    }}
                  >
                    {contato.mensagem}
                    <Plus className="text-gray-700 text-3xl" />
                  </summary>

                  <div className="mt-4 text-xl text-gray-700">
                    <p>
                      <strong>Pergunta:</strong> {contato.mensagem}
                    </p>
                    <p className="mt-2">
                      <strong>Resposta:</strong>{" "}
                      {contato.resposta ? contato.resposta : "Sem resposta no momento"}
                    </p>
                  </div>

                  {/* Área para editar/adicionar resposta */}
                  <div className="mt-4">
                    <label className="block text-gray-700 font-semibold">
                      Editar/Adicionar Resposta:
                    </label>
                    <textarea
                      className="w-full mt-2 rounded-lg border-2 border-gray-300 px-4 py-3 text-xl focus:border-blue-300 focus:ring-blue-300"
                      rows={3}
                      value={editingResposta[contato._id] || ""}
                      onChange={(e) =>
                        setEditingResposta((prev) => ({
                          ...prev,
                          [contato._id]: e.target.value,
                        }))
                      }
                    />
                    <div className="flex gap-2 mt-2">
                      <Button
                        className="bg-blue-500 text-white flex items-center gap-2"
                        onClick={() => handleEditResposta(contato._id)}
                      >
                        <PaperPlaneRight size={24} />
                        Salvar Resposta
                      </Button>

                      <Button
                        className="bg-red-500 text-white flex items-center gap-2"
                        onClick={() => handleDeleteContato(contato._id, index)}
                      >
                        <Trash size={24} />
                        Deletar
                      </Button>
                    </div>
                  </div>
                </details>

            ))
          )}
        </div>

        {/* Lado direito: mensagem e ícone */}
        <div className="bg-white shadow-lg border-2 border-gray-300 rounded-lg p-8 flex flex-col items-center text-center transition-all duration-300">
          <Chat className="text-4xl text-black w-20 h-20 mb-4" />
          <p className="text-lg text-gray-700">
            Responda as perguntas feitas aqui nessa página
          </p>
        </div>
      </div>
    </div>
  );
};
