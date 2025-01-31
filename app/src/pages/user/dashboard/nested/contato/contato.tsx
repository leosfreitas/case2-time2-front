import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Chat, Trash } from "@phosphor-icons/react";
import toast from "react-hot-toast";

import {
  getAllUserContatos,
  createUserContato,
  deleteUserContato,
} from "./api/contatoUserRequests";

export const Contato = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [contatos, setContatos] = useState<any[] | null>(null);

  // Carrega as perguntas ao montar
  useEffect(() => {
    async function fetchUserContatos() {
      try {
        const userContatos = await getAllUserContatos();
        setContatos(userContatos);
        console.log("Contatos do usuário:", userContatos);
      } catch (error) {
        console.error("Erro ao buscar Contatos do usuário:", error);
        toast.error("Ocorreu um erro ao buscar suas perguntas. Tente novamente.");
        setContatos([]);
      }
    }
    fetchUserContatos();
  }, []);

  // Cria nova pergunta
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const mensagem = formData.get("mensagem") as string;
    const resposta = "";

    try {
      await createUserContato({ mensagem, resposta });
      toast.success("Pergunta enviada com sucesso!");
      setIsDialogOpen(false);

      // Refaz fetch para atualizar lista
      const updated = await getAllUserContatos();
      setContatos(updated);
    } catch (error) {
      console.error("Erro ao criar Contato:", error);
      toast.error("Erro ao enviar pergunta. Tente novamente.");
    }
  }

  // Deleta pergunta e refaz fetch
  async function handleDelete(contatoId: string, event: React.MouseEvent) {
    event.stopPropagation();
    try {
      await deleteUserContato(contatoId);
      toast.success("Contato deletado com sucesso!");

      // Atualiza lista
      const updated = await getAllUserContatos();
      setContatos(updated);
    } catch (error) {
      console.error("Erro ao deletar contato:", error);
      toast.error("Não foi possível deletar. Tente novamente.");
    }
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 text-gray-800">
          Minhas Perguntas
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          {/* Lista de Perguntas */}
          <div className="col-span-2 space-y-4 sm:space-y-6">
            {!contatos || contatos.length === 0 ? (
              <p className="text-base sm:text-lg md:text-xl text-gray-600">
                Você ainda não fez perguntas ou ocorreu um erro ao carregá-las.
              </p>
            ) : (
              contatos.map((contato, index) => (
                <details
                  key={contato._id || index}
                  className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-4 sm:p-6 text-base sm:text-lg md:text-xl"
                  open={expandedIndex === index}
                  onClick={(e) => {
                    e.preventDefault(); // Evita abrir/fechar automaticamente
                    setExpandedIndex(expandedIndex === index ? null : index);
                  }}
                >
                  <summary className="font-bold flex justify-between items-center cursor-pointer">
                    <span className="text-gray-800 leading-relaxed">
                      {contato.mensagem}
                    </span>
                    <span className="flex items-center gap-3">
                      <Plus
                        className="text-gray-700 text-2xl sm:text-3xl"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Trash
                        className="text-red-600 text-2xl sm:text-3xl hover:text-red-800"
                        onClick={(e) => handleDelete(contato._id, e)}
                      />
                    </span>
                  </summary>
                  <div className="mt-4 text-gray-700 leading-relaxed">
                    <p>
                      <strong>Resposta:</strong>{" "}
                      {contato.resposta
                        ? contato.resposta
                        : "Ainda não respondido. Aguarde um momento..."}
                    </p>
                  </div>
                </details>
              ))
            )}
          </div>

          {/* Card lateral (visível somente em telas >= sm) */}
          <div className="hidden sm:flex bg-white shadow-lg border-2 border-gray-300 rounded-lg p-6 sm:p-8 flex-col items-center text-center transition-all duration-300">
            <Chat className="text-black w-12 h-12 sm:w-16 sm:h-16" />
            <h2 className="text-lg sm:text-2xl md:text-3xl mt-3 font-bold text-gray-800">
              Tem uma nova dúvida?
            </h2>
            <p className="text-gray-700 mt-4 sm:mt-6 text-sm sm:text-base md:text-lg">
              Clique no botão abaixo para enviar uma pergunta
            </p>
            <Button
              className="mt-6 sm:mt-10 bg-[#0097e0] text-white w-full text-base sm:text-xl py-3 sm:py-4"
              onClick={() => setIsDialogOpen(true)}
            >
              Enviar
            </Button>
          </div>
        </div>

        {/* Botão único em telas < sm (esconde a box e ícone) */}
        <div className="block sm:hidden mt-8">
          <Button
            className="w-full bg-[#0097e0] text-white text-base py-3"
            onClick={() => setIsDialogOpen(true)}
          >
            Pergunta Nova
          </Button>
        </div>
      </div>

      {/* Dialog de criar pergunta */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {/* Em telas pequenas: w-[90%], max-w-sm; Em telas >= sm: max-w-md */}
        <DialogContent
          className="
            w-[90%]
            max-w-sm
            sm:max-w-md
            bg-white
            rounded-lg
            shadow-lg
            p-4
            sm:p-8
            overflow-auto
          "
        >
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              Envie sua pergunta
            </DialogTitle>
          </DialogHeader>

          <form className="space-y-4 sm:space-y-6 mt-2 sm:mt-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="mensagem"
                className="block text-base sm:text-lg md:text-xl font-semibold text-gray-800"
              >
                Pergunta
              </label>
              <textarea
                id="mensagem"
                name="mensagem"
                rows={3}
                required
                className="w-full mt-2 rounded-lg border-2 border-gray-300 px-3 py-2 text-base sm:text-lg md:text-xl focus:border-blue-300 focus:ring-blue-300"
              />
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-[#0097e0] text-white text-base sm:text-lg md:text-xl py-2 sm:py-3"
              >
                Enviar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
