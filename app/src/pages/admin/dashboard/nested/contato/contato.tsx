import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  const [contatosObj, setContatosObj] = useState<Record<string, Contato[]>>({});
  const [userIds, setUserIds] = useState<string[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  // Estado para controlar qual contato está selecionado e se o diálogo está aberto
  const [selectedContato, setSelectedContato] = useState<Contato | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Estado que guarda a resposta em edição (por ID de contato)
  const [editingResposta, setEditingResposta] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchContatos() {
      try {
        const data = await getAllAdminContatos();
        const userKeys = Object.keys(data);

        setContatosObj(data);
        setUserIds(userKeys);

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

  const contatos = selectedUserId ? contatosObj[selectedUserId] || [] : [];

  // Abre o diálogo e prepara o estado de edição de resposta
  function handleOpenDialog(contato: Contato) {
    setSelectedContato(contato);
    setEditingResposta({ [contato._id]: contato.resposta || "" });
    setIsDialogOpen(true);
  }

  // Fecha o diálogo e limpa contato selecionado
  function handleCloseDialog() {
    setIsDialogOpen(false);
    setSelectedContato(null);
  }

  // Salvar edição da resposta
  async function handleEditResposta(contatoId: string) {
    const respostaAtual = editingResposta[contatoId];
    if (!respostaAtual) {
      toast.error("Digite uma resposta antes de salvar.");
      return;
    }

    try {
      await editAdminContato(contatoId, { resposta: respostaAtual });
      toast.success("Resposta atualizada com sucesso!");

      // Atualiza a lista de contatos
      const updatedObj = await getAllAdminContatos();
      setContatosObj(updatedObj);

      // Ajusta chaves e usuário selecionado, se necessário
      const userKeys = Object.keys(updatedObj);
      setUserIds(userKeys);
      if (!updatedObj[selectedUserId]) {
        setSelectedUserId(userKeys[0] || "");
      }

      // Limpa a resposta do estado de edição e fecha o diálogo
      setEditingResposta((prev) => ({
        ...prev,
        [contatoId]: "",
      }));
      handleCloseDialog();
    } catch (error) {
      console.error("Erro ao editar contato:", error);
      toast.error("Não foi possível editar a resposta. Tente novamente.");
    }
  }

  // Excluir um contato
  async function handleDeleteContato(contatoId: string) {
    try {
      await deleteAdminContato(contatoId);
      toast.success("Contato deletado com sucesso!");

      // Atualiza a lista de contatos
      const updatedObj = await getAllAdminContatos();
      setContatosObj(updatedObj);

      const userKeys = Object.keys(updatedObj);
      setUserIds(userKeys);

      if (!updatedObj[selectedUserId]) {
        setSelectedUserId(userKeys[0] || "");
      }

      handleCloseDialog();
    } catch (error) {
      console.error("Erro ao deletar contato:", error);
      toast.error("Não foi possível deletar. Tente novamente.");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-[5vh]">
      {/* Título mantido em text-6xl */}
      <h1 className="text-6xl font-bold mb-12">Perguntas do cliente</h1>

      <div className="mb-8">
        <label className="block text-3xl font-bold mb-2">
          Selecione o cliente:
        </label>
        <select
          className="border-2 border-gray-300 rounded-md p-3 text-3xl"
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
        <div className="col-span-2 space-y-6">
          {contatos.slice(0, 5).length === 0 ? (
            <p className="text-3xl text-gray-600">
              Nenhuma pergunta para esse usuário.
            </p>
          ) : (
            contatos.slice(0, 5).map((contato) => (
              <div
                key={contato._id}
                className="transition-all duration-300 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6 flex items-center justify-between"
              >
                <div className="flex-1 text-3xl">
                  <p className="font-bold mb-2">{contato.mensagem}</p>
                  <p className="text-gray-600">
                    {contato.resposta
                      ? `Resposta: ${contato.resposta}`
                      : "Sem resposta no momento"}
                  </p>
                </div>
                <Button
                  className="flex items-center gap-2 ml-4 bg-blue-500 text-white text-3xl px-6 py-4"
                  onClick={() => handleOpenDialog(contato)}
                >
                  <Plus size={28} />
                  Detalhes
                </Button>
              </div>
            ))
          )}
        </div>

        <div
          className="bg-white shadow-lg border-2 border-gray-300 rounded-lg p-8 flex flex-col items-center text-center"
          style={{ maxHeight: "20vh" }}
        >
          <Chat className="text-6xl text-black w-20 h-20 mb-4" />
          <p className="text-3xl text-gray-700">
            Responda as perguntas feitas aqui nessa página
          </p>
        </div>
      </div>

      {/* Dialog para exibir/editar/excluir o contato selecionado */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl p-8 bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-5xl">
              {selectedContato?.mensagem || "Detalhes da Pergunta"}
            </DialogTitle>
          </DialogHeader>

          {selectedContato && (
            <div className="mt-6 text-3xl">
              <p className="mb-4">
                <strong>Email do usuário:</strong> {selectedContato.email}
              </p>

              <p className="mb-4">
                <strong>Resposta:</strong>
              </p>
              <textarea
                className="w-full mt-1 rounded-lg border-2 border-gray-300 px-4 py-3 text-3xl focus:border-blue-300 focus:ring-blue-300"
                rows={3}
                value={editingResposta[selectedContato._id] || ""}
                onChange={(e) =>
                  setEditingResposta((prev) => ({
                    ...prev,
                    [selectedContato._id]: e.target.value,
                  }))
                }
              />
              <div className="flex gap-4 mt-8">
                <Button
                  className="bg-blue-500 text-white flex items-center gap-2 text-3xl px-6 py-3"
                  onClick={() => handleEditResposta(selectedContato._id)}
                >
                  <PaperPlaneRight size={30} />
                  Salvar Resposta
                </Button>

                <Button
                  className="bg-red-500 text-white flex items-center gap-2 text-3xl px-6 py-3"
                  onClick={() => handleDeleteContato(selectedContato._id)}
                >
                  <Trash size={30} />
                  Deletar
                </Button>

              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
