import { useState, useEffect, FormEvent } from "react";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Chat } from "@phosphor-icons/react";
import { getAllSacs } from "./api/getAllSacs";
import { createSac } from "./api/createSac";
import toast from "react-hot-toast";

export const Contact = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [sacs, setSacs] = useState<any[]>([]);

  async function fetchSacs() {
    try {
      const allSacs = await getAllSacs();
      setSacs(allSacs && Array.isArray(allSacs) ? allSacs.slice(0, 5) : []);
    } catch (error) {
      console.error("Erro ao buscar SACs:", error);
      toast.error("Ocorreu um erro ao buscar as perguntas. Tente novamente.");
      setSacs([]);
    }
  }

  useEffect(() => {
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
      fetchSacs();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Erro ao criar SAC:", error);
      toast.error("Erro ao enviar pergunta. Tente novamente.");
    }
  }

  return (
    <>
      <Header />

      <div className="max-w-6xl mx-auto px-6 md:pt-[25vh] pt-[15vh] pb-[20vh] md:pb-[20vh]">
        <h1 className="text-4xl md:text-6xl font-bold mb-12 text-center sm:text-left">
          Perguntas mais recentes
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* FAQ Column */}
          <div className="col-span-2 space-y-6">
            {sacs.map((sac, index) => (
              <details
                key={sac._id || index}
                className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-6 cursor-pointer text-lg md:text-2xl"
                open={expandedIndex === index}
                onClick={(e) => {
                  e.preventDefault();
                  setExpandedIndex(expandedIndex === index ? null : index);
                }}
              >
                <summary className="font-bold flex justify-between items-center cursor-pointer">
                  {sac.mensagem}
                  <Plus className="text-gray-700 text-2xl md:text-3xl" />
                </summary>
                <p className="text-gray-700 mt-4 text-base md:text-xl">
                  {sac.resposta ? sac.resposta : "Sem resposta no momento"}
                </p>
              </details>
            ))}
          </div>

          {/* Questions box - hidden on mobile */}
          <div className="hidden md:flex col-span-1 justify-center">
            <div className="bg-white shadow-lg border-2 border-gray-300 rounded-lg p-8 flex flex-col items-center text-center transition-all duration-300 w-full max-w-sm">
              <Chat className="text-4xl text-black w-16 h-16 md:w-20 md:h-20" />
              <h2 className="text-2xl md:text-3xl mt-3 font-bold">
                Você tem mais perguntas?
              </h2>
              <p className="text-gray-700 mt-6 text-sm md:text-lg">
                Clique no botão abaixo para enviar uma pergunta
              </p>
              <Button
                className="mt-10 bg-[#0097e0] text-white w-full text-base md:text-2xl py-4 md:py-8"
                onClick={() => setIsDialogOpen(true)}
              >
                Enviar
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile button */}
        <div className="md:hidden mt-8">
          <Button
            className="w-full bg-[#0097e0] text-white text-base py-3"
            onClick={() => setIsDialogOpen(true)}
          >
            Perguntar
          </Button>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[90%] max-w-[95%] sm:max-w-md p-4 sm:p-6 bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl md:text-3xl">
              Envie sua pergunta
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm sm:text-base md:text-xl font-semibold text-gray-800"
              >
                Nome
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full mt-1 sm:mt-2 rounded-lg border-2 border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base md:text-xl focus:border-blue-300 focus:ring-blue-300"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm sm:text-base md:text-xl font-semibold text-gray-800"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full mt-1 sm:mt-2 rounded-lg border-2 border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base md:text-xl focus:border-blue-300 focus:ring-blue-300"
              />
            </div>
            <div>
              <label
                htmlFor="subject"
                className="block text-sm sm:text-base md:text-xl font-semibold text-gray-800"
              >
                Motivo de contato
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                className="w-full mt-1 sm:mt-2 rounded-lg border-2 border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base md:text-xl focus:border-blue-300 focus:ring-blue-300"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm sm:text-base md:text-xl font-semibold text-gray-800"
              >
                Mensagem
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                className="w-full mt-1 sm:mt-2 rounded-lg border-2 border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base md:text-xl focus:border-blue-300 focus:ring-blue-300"
              ></textarea>
            </div>
            <div>
              <Button
                type="submit"
                className="w-full bg-[#0097e0] text-white text-sm sm:text-base md:text-xl py-2 sm:py-3"
              >
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