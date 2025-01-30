import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const mensagem = formData.get("mensagem") as string;
    const resposta = "";

    try {
      await createUserContato({ mensagem, resposta });
      toast.success("Pergunta enviada com sucesso!");

      setIsDialogOpen(false);

      const updated = await getAllUserContatos();
      setContatos(updated);
    } catch (error) {
      console.error("Erro ao criar Contato:", error);
      toast.error("Erro ao enviar pergunta. Tente novamente.");
    }
  }

  async function handleDelete(contatoId: string, event: React.MouseEvent) {
    event.stopPropagation();

    try {
      await deleteUserContato(contatoId);
      toast.success("Contato deletado com sucesso!");

      const updated = await getAllUserContatos();
      setContatos(updated);
    } catch (error) {
      console.error("Erro ao deletar contato:", error);
      toast.error("Não foi possível deletar. Tente novamente.");
    }
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 py-[10vh]">
        <h1 className="text-6xl font-bold mb-12">Minhas Perguntas</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="col-span-2 space-y-6">
            {!contatos || contatos.length === 0 ? (
              <p className="text-xl text-gray-600">
                Você ainda não fez perguntas ou ocorreu um erro ao carregá-las.
              </p>
            ) : (
              contatos.map((contato, index) => (
                <details
                  key={contato._id || index}
                  className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6 text-2xl"
                  open={expandedIndex === index}
                  onClick={(e) => {
                    e.preventDefault(); // Evita que o <details> se comporte de forma automática
                    setExpandedIndex(expandedIndex === index ? null : index);
                  }}
                >
                  <summary className="font-bold flex justify-between items-center cursor-pointer">
                    <span className="text-gray-800">{contato.mensagem}</span>

                    <span className="flex items-center gap-4">
                      <Plus
                        className="text-gray-700 text-3xl"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Trash
                        className="text-red-600 text-3xl hover:text-red-800"
                        onClick={(e) => handleDelete(contato._id, e)}
                      />
                    </span>
                  </summary>

                  <div className="mt-4 text-xl text-gray-700">
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

          <div className="bg-white shadow-lg border-2 border-gray-300 rounded-lg p-8 flex flex-col items-center text-center transition-all duration-300">
            <Chat className="text-4xl text-black w-20 h-20" />
            <h2 className="text-3xl mt-3 font-bold">Tem uma nova dúvida?</h2>
            <p className="text-gray-700 mt-6 text-lg">
              Clique no botão abaixo para enviar uma pergunta
            </p>
            <Button
              className="mt-[10vh] bg-[#0097e0] text-white w-full text-2xl py-8"
              onClick={() => setIsDialogOpen(true)}
            >
              Enviar
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg p-8 bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-3xl">Envie sua pergunta</DialogTitle>
          </DialogHeader>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="mensagem" className="block text-xl font-semibold text-gray-800">
                Pergunta
              </label>
              <textarea
                id="mensagem"
                name="mensagem"
                rows={3}
                required
                className="w-full mt-2 rounded-lg border-2 border-gray-300 px-4 py-3 text-xl focus:border-blue-300 focus:ring-blue-300"
              />
            </div>

            <div>
              <Button type="submit" className="w-full bg-[#0097e0] text-white text-xl py-3">
                Enviar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
