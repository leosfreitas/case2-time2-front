import { useState, useEffect, FormEvent } from "react";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Chat } from "@phosphor-icons/react";
import { getAllSacs } from "./api/getAllSacs";
import { createSac } from "./api/createSac";
import toast from "react-hot-toast";

export const Contact = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const [sacs, setSacs] = useState<any[]>([]);

  useEffect(() => {
    async function fetchSacs() {
      try {
        const allSacs = await getAllSacs();
        setSacs(allSacs.slice(0, 5));
      } catch (error) {
        console.error("Erro ao buscar SACs:", error);
        toast.error("Ocorreu um erro ao buscar as perguntas. Tente novamente.");
      }
    }

    fetchSacs();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const nome = formData.get("name") as string;
    const email = formData.get("email") as string;
    const motivo = formData.get("subject") as string;
    const mensagem = formData.get("message") as string;
    const resposta = "";

    try {
      await createSac({ nome, email, motivo, mensagem, resposta });
      toast.success("Pergunta enviada com sucesso!");

      setIsDialogOpen(false);

    } catch (error) {
      console.error("Erro ao criar SAC:", error);
      toast.error("Erro ao enviar pergunta. Tente novamente.");
    }
  }

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-[20vh]">
        <h1 className="text-6xl font-bold mb-12">Perguntas mais frequentes</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="col-span-2 space-y-6">
            {sacs.map((sac, index) => (
              <details
                key={sac._id || index}
                className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6 cursor-pointer text-2xl"
                open={expandedIndex === index}
                onToggle={() => {
                  setExpandedIndex(expandedIndex === index ? null : index);
                }}
              >
                <summary className="font-bold flex justify-between items-center cursor-pointer">
                  {sac.mensagem}
                  <Plus className="text-gray-700 text-3xl" />
                </summary>
                <p className="text-gray-700 mt-4 text-xl">
                  {sac.resposta ? sac.resposta : "Sem resposta no momento"}
                </p>
              </details>
            ))}
          </div>

          <div className="bg-white shadow-lg border-2 border-gray-300 rounded-lg p-8 flex flex-col items-center text-center transition-all duration-300">
            <Chat className="text-4xl text-black w-20 h-20" />
            <h2 className="text-3xl mt-3 font-bold">Você tem mais perguntas?</h2>
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
              <label htmlFor="name" className="block text-xl font-semibold text-gray-800">
                Nome
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full mt-2 rounded-lg border-2 border-gray-300 px-4 py-3 text-xl focus:border-blue-300 focus:ring-blue-300"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xl font-semibold text-gray-800">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full mt-2 rounded-lg border-2 border-gray-300 px-4 py-3 text-xl focus:border-blue-300 focus:ring-blue-300"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-xl font-semibold text-gray-800">
                Motivo de contato
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                className="w-full mt-2 rounded-lg border-2 border-gray-300 px-4 py-3 text-xl focus:border-blue-300 focus:ring-blue-300"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-xl font-semibold text-gray-800">
                Mensagem
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                className="w-full mt-2 rounded-lg border-2 border-gray-300 px-4 py-3 text-xl focus:border-blue-300 focus:ring-blue-300"
              ></textarea>
            </div>
            <div>
              <Button type="submit" className="w-full bg-[#0097e0] text-white text-xl py-3">
                Enviar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Footer />
    </>
  );
};
