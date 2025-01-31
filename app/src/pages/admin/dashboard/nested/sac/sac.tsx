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

  useEffect(() => {
    async function fetchSacs() {
      try {
        const allSacs = await getAllSacs();
        // Pega somente os 5 mais recentes, se for o desejado
        setSacs(Array.isArray(allSacs) ? allSacs.slice(0, 5) : []);
      } catch (error) {
        console.error("Erro ao buscar SACs:", error);
        toast.error("Ocorreu um erro ao buscar as perguntas. Tente novamente.");
        setSacs([]);
      }
    }
    fetchSacs();
  }, []);

  function handleOpenDialog(sac: Sac) {
    setSelectedSac(sac);
    setEditingResposta({ [sac._id]: sac.resposta || "" });
    setIsDialogOpen(true);
  }

  function handleCloseDialog() {
    setIsDialogOpen(false);
    setSelectedSac(null);
  }

  async function handleEditResposta(sacId: string) {
    const respostaAtual = editingResposta[sacId];
    if (!respostaAtual) {
      toast.error("Digite uma resposta antes de salvar.");
      return;
    }

    try {
      await editSac(sacId, { resposta: respostaAtual });
      toast.success("Resposta atualizada com sucesso!");
      // Recarrega ou atualiza a lista
      const updatedSacs = await getAllSacs();
      setSacs(Array.isArray(updatedSacs) ? updatedSacs.slice(0, 5) : []);
      setEditingResposta((prev) => ({ ...prev, [sacId]: "" }));
      handleCloseDialog();
    } catch (error) {
      console.error("Erro ao editar SAC:", error);
      toast.error("Não foi possível editar a resposta. Tente novamente.");
    }
  }

  async function handleDeleteSac(sacId: string) {
    try {
      await deleteSac(sacId);
      toast.success("SAC deletado com sucesso!");
      setSacs((prev) => prev.filter((item) => item._id !== sacId));
      handleCloseDialog();
    } catch (error) {
      console.error("Erro ao deletar SAC:", error);
      toast.error("Não foi possível deletar. Tente novamente.");
    }
  }

  return (
    <>
      {/* 
        Container responsivo:
        - Em telas menores (mobile), px-4 e py-8
        - Em sm (tablets), px-6 e py-12
        - Em md (desktops), padding ainda maior
      */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        {/* 
          Título responsivo:
          - text-3xl em telas pequenas,
          - text-4xl em sm,
          - text-6xl em md (mantendo seu original no desktop).
        */}
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-8 sm:mb-12 text-gray-800">
          Perguntas mais recentes
        </h1>

        {/* Grid responsivo:
           - 1 coluna no mobile;
           - 3 colunas a partir de md, sendo col-span-2 e 1 col de destaque. 
        */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          {/* Parte principal: col-span-2 em telas md+ */}
          <div className="col-span-2 space-y-4 sm:space-y-6">
            {sacs.length === 0 ? (
              <p className="text-base sm:text-lg md:text-2xl text-gray-600">
                Nenhuma pergunta feita ainda.
              </p>
            ) : (
              sacs.map((sac) => (
                <div
                  key={sac._id}
                  className="
                    transition-all 
                    duration-300 
                    bg-white 
                    border-2 
                    border-gray-300 
                    rounded-lg 
                    shadow-lg 
                    p-4 
                    sm:p-6 
                    flex 
                    items-center 
                    justify-between
                  "
                >
                  {/* Texto responsivo: base no mobile, lg em tablets, 2xl em desktop */}
                  <div className="flex-1 text-base sm:text-lg md:text-2xl">
                    <p className="font-bold mb-2">{sac.mensagem}</p>
                  </div>
                  {/* Botão responsivo */}
                  <Button
                    className="
                      flex 
                      items-center 
                      gap-2 
                      ml-4 
                      bg-blue-500 
                      text-white 
                      text-base 
                      sm:text-lg 
                      md:text-2xl 
                      px-4 
                      sm:px-6 
                      py-2 
                      sm:py-3
                    "
                    onClick={() => handleOpenDialog(sac)}
                  >
                    <Plus size={24} />
                    Responder
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Card lateral:
              Mantemos a mesma ideia, mas tornamos as fontes menores em mobile e maiores no desktop
          */}
          <div
            className="
              hidden 
              md:flex
              bg-white 
              shadow-lg 
              border-2 
              border-gray-300 
              rounded-lg 
              p-6 
              sm:p-8 
              flex-col 
              items-center 
              text-center
            "
            style={{ maxHeight: "20vh" }}
          >
            <Chat className="text-black w-12 h-12 sm:w-16 sm:h-16 mb-4" />
            <p className="text-base sm:text-lg md:text-2xl text-gray-700">
              Responda as perguntas feitas
              <br />
              aqui nessa página
            </p>
          </div>
        </div>
      </div>

      {/* Dialog de detalhes/edição/deleção */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {/*
          Conteúdo do dialog responsivo:
          - Em telas bem pequenas: w-[90%], max-w-sm
          - Em sm: max-w-md
          - Em md (desktop): max-w-2xl (ou pode aumentar se quiser)
          - overflow-auto garante rolagem caso o conteúdo passe do tamanho da tela
        */}
        <DialogContent
          className="
            w-[90%] 
            max-w-sm
            sm:max-w-md 
            md:max-w-2xl
            p-4
            sm:p-8
            bg-white
            rounded-lg
            shadow-lg
            overflow-auto
          "
        >
          <DialogHeader>
            {/* Título responsivo: 2xl no desktop, menor em mobile */}
            <DialogTitle className="text-2xl sm:text-3xl md:text-5xl text-gray-900 font-bold">
              {selectedSac?.mensagem || "Detalhes da Pergunta"}
            </DialogTitle>
          </DialogHeader>

          {selectedSac && (
            <div className="mt-4 sm:mt-6 text-base sm:text-lg md:text-2xl">
              <p className="mb-4">
                <strong>Email do usuário:</strong>{" "}
                {selectedSac.email || "Não informado"}
              </p>

              <p className="mb-2">
                <strong>Resposta:</strong>
              </p>
              <textarea
                className="
                  w-full 
                  mt-1 
                  rounded-lg 
                  border-2 
                  border-gray-300 
                  px-3 
                  py-2 
                  text-base 
                  sm:text-lg 
                  md:text-2xl 
                  focus:border-blue-300 
                  focus:ring-blue-300
                "
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
                  className="
                    bg-blue-500 
                    text-white 
                    flex 
                    items-center 
                    gap-2 
                    text-base 
                    sm:text-lg 
                    md:text-2xl 
                    px-4 
                    sm:px-6 
                    py-2 
                    sm:py-3
                  "
                  onClick={() => handleEditResposta(selectedSac._id)}
                >
                  <PaperPlaneRight size={24} />
                  Salvar Resposta
                </Button>

                <Button
                  className="
                    bg-red-500 
                    text-white 
                    flex 
                    items-center 
                    gap-2 
                    text-base 
                    sm:text-lg 
                    md:text-2xl 
                    px-4 
                    sm:px-6 
                    py-2 
                    sm:py-3
                  "
                  onClick={() => handleDeleteSac(selectedSac._id)}
                >
                  <Trash size={24} />
                  Deletar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
