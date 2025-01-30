import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Chat, Trash, PaperPlaneRight } from "@phosphor-icons/react";
import toast from "react-hot-toast";

import {
  getAllSacs,
  editSac,
  deleteSac,
} from "./api/sacRequests";

// Se quiser tipar melhor, você pode ajustar essa interface
type Sac = {
  _id: string;
  email?: string;
  mensagem: string;
  resposta?: string;
};

export const Sac = () => {
  const [sacs, setSacs] = useState<Sac[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSac, setSelectedSac] = useState<Sac | null>(null);
  const [editingResposta, setEditingResposta] = useState<Record<string, string>>({});

  // Busca inicial dos SACs (apenas 5 mais recentes)
  useEffect(() => {
    async function fetchSacs() {
      try {
        const allSacs = await getAllSacs();
        // Garante que seja array e pega somente 5
        setSacs(Array.isArray(allSacs) ? allSacs.slice(0, 5) : []);
      } catch (error) {
        console.error("Erro ao buscar SACs:", error);
        toast.error("Ocorreu um erro ao buscar as perguntas. Tente novamente.");
        setSacs([]);
      }
    }

    fetchSacs();
  }, []);

  // Abre o diálogo para exibir detalhes/editar/deletar
  function handleOpenDialog(sac: Sac) {
    setSelectedSac(sac);
    setEditingResposta({ [sac._id]: sac.resposta || "" });
    setIsDialogOpen(true);
  }

  // Fecha o diálogo
  function handleCloseDialog() {
    setIsDialogOpen(false);
    setSelectedSac(null);
  }

  // Salvar a resposta editada
  async function handleEditResposta(sacId: string) {
    const respostaAtual = editingResposta[sacId];

    if (!respostaAtual) {
      toast.error("Digite uma resposta antes de salvar.");
      return;
    }

    try {
      await editSac(sacId, { resposta: respostaAtual });
      toast.success("Resposta atualizada com sucesso!");

      // Recarrega a lista após a edição
      const updatedSacs = await getAllSacs();
      setSacs(Array.isArray(updatedSacs) ? updatedSacs.slice(0, 5) : []);

      // Limpa a resposta do estado e fecha o diálogo
      setEditingResposta((prev) => ({
        ...prev,
        [sacId]: "",
      }));
      handleCloseDialog();
    } catch (error) {
      console.error("Erro ao editar SAC:", error);
      toast.error("Não foi possível editar a resposta. Tente novamente.");
    }
  }

  // Deletar um SAC
  async function handleDeleteSac(sacId: string) {
    try {
      await deleteSac(sacId);
      toast.success("SAC deletado com sucesso!");

      // Atualiza a lista removendo o item deletado sem recarregar tudo
      setSacs((prev) => prev.filter((item) => item._id !== sacId));
      handleCloseDialog();
    } catch (error) {
      console.error("Erro ao deletar SAC:", error);
      toast.error("Não foi possível deletar. Tente novamente.");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-[5vh]">
      {/* Título principal, em estilo grande */}
      <h1 className="text-6xl font-bold mb-12">Perguntas mais recentes</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="col-span-2 space-y-6">
          {sacs.length === 0 ? (
            <p className="text-3xl text-gray-600">
              Nenhuma pergunta feita ainda.
            </p>
          ) : (
            sacs.map((sac) => (
              <div
                key={sac._id}
                className="transition-all duration-300 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6 flex items-center justify-between"
              >
                <div className="flex-1 text-3xl">
                  <p className="font-bold mb-2">{sac.mensagem}</p>
                </div>
                <Button
                  className="flex items-center gap-2 ml-4 bg-blue-500 text-white text-3xl px-6 py-4"
                  onClick={() => handleOpenDialog(sac)}
                >
                  <Plus size={28} />
                  Responder
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

      {/* Dialog para exibir e editar/deletar o SAC selecionado */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl p-8 bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-5xl">
              {selectedSac?.mensagem || "Detalhes da Pergunta"}
            </DialogTitle>
          </DialogHeader>

          {selectedSac && (
            <div className="mt-6 text-3xl">
              <p className="mb-4">
                <strong>Email do usuário:</strong>{" "}
                {selectedSac.email || "Não informado"}
              </p>

              <p className="mb-4">
                <strong>Resposta:</strong>
              </p>
              <textarea
                className="w-full mt-1 rounded-lg border-2 border-gray-300 px-4 py-3 text-3xl focus:border-blue-300 focus:ring-blue-300"
                rows={3}
                value={editingResposta[selectedSac._id] || ""}
                onChange={(e) =>
                  setEditingResposta((prev) => ({
                    ...prev,
                    [selectedSac._id]: e.target.value,
                  }))
                }
              />
              <div className="flex gap-4 mt-8">
                <Button
                  className="bg-blue-500 text-white flex items-center gap-2 text-3xl px-6 py-3"
                  onClick={() => handleEditResposta(selectedSac._id)}
                >
                  <PaperPlaneRight size={30} />
                  Salvar Resposta
                </Button>

                <Button
                  className="bg-red-500 text-white flex items-center gap-2 text-3xl px-6 py-3"
                  onClick={() => handleDeleteSac(selectedSac._id)}
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
