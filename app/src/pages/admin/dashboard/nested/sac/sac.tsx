import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Chat, Trash, PaperPlaneRight } from "@phosphor-icons/react";
import toast from "react-hot-toast";

import {
  getAllSacs,
  editSac,
  deleteSac,
} from "./api/sacRequests";

export const Sac = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [sacs, setSacs] = useState<any[]>([]);
  const [editingResposta, setEditingResposta] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    async function fetchSacs() {
      try {
        const allSacs = await getAllSacs();
        setSacs(allSacs && Array.isArray(allSacs) ? allSacs.slice(0, 5) : []);
      } catch (error) {
        console.error("Erro ao buscar SACs:", error);
        toast.error("Ocorreu um erro ao buscar as perguntas. Tente novamente.");
        setSacs([]); // Garante que a variável não fique undefined
      }
    }
  
    fetchSacs();
  }, []);

  async function handleEditResposta(sacId: string) {
    if (!editingResposta[sacId]) {
      toast.error("Digite uma resposta antes de salvar.");
      return;
    }

    const novaResposta = editingResposta[sacId];

    try {
      await editSac(sacId, { resposta: novaResposta });
      toast.success("Resposta atualizada com sucesso!");

      // Recarrega a lista após edição
      const updatedSacs = await getAllSacs();
      setSacs(updatedSacs);

      // Limpa o campo de resposta do estado
      setEditingResposta((prev) => ({
        ...prev,
        [sacId]: "",
      }));
    } catch (error) {
      console.error("Erro ao editar SAC:", error);
      toast.error("Não foi possível editar a resposta. Tente novamente.");
    }
  }

  // Função para deletar um SAC
  async function handleDeleteSac(sacId: string) {
    try {
      await deleteSac(sacId);
      toast.success("SAC deletado com sucesso!");
  
      // Atualiza a lista removendo o item deletado sem recarregar tudo
      setSacs((prevSacs) => prevSacs.filter((sac) => sac._id !== sacId));
  
      // Se o SAC deletado estava expandido, fecha a caixa
      setExpandedIndex(null);
    } catch (error) {
      console.error("Erro ao deletar SAC:", error);
      toast.error("Não foi possível deletar. Tente novamente.");
    }
  }
  
  
  

  return (
    <div className="max-w-6xl mx-auto px-6 py-[20vh]">
      <h1 className="text-6xl font-bold mb-12">Perguntas mais recentes</h1>
  
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Lista de SACs */}
        <div className="col-span-2 space-y-6">
          {sacs.length === 0 ? (
            <p className="text-2xl text-gray-600">Nenhuma pergunta feita ainda.</p>
          ) : (
            sacs.map((sac, index) => (
              <details
                  key={sac._id || index}
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
                  <summary className="font-bold flex justify-between items-center cursor-pointer">
                    {sac.mensagem}
                    <Plus className="text-gray-700 text-3xl" />
                  </summary>

                  <div className="mt-4 text-xl text-gray-700">
                    <p>
                      <strong>Pergunta:</strong> {sac.mensagem}
                    </p>
                    <p className="mt-2">
                      <strong>Resposta:</strong>{" "}
                      {sac.resposta ? sac.resposta : "Sem resposta no momento"}
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
                      value={editingResposta[sac._id] || ""}
                      onChange={(e) =>
                        setEditingResposta((prev) => ({
                          ...prev,
                          [sac._id]: e.target.value,
                        }))
                      }
                    />
                    <div className="flex gap-2 mt-2">
                      <Button
                        className="bg-blue-500 text-white flex items-center gap-2"
                        onClick={() => handleEditResposta(sac._id)}
                      >
                        <PaperPlaneRight size={24} />
                        Salvar Resposta
                      </Button>

                      <Button
                        className="bg-red-500 text-white flex items-center gap-2"
                        onClick={() => handleDeleteSac(sac._id)}
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
  
        {/* Exemplo de "lado direito" vazio (já que removemos o create) */}
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
