import { useState, useEffect } from "react";
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
  const [emailMap, setEmailMap] = useState<Record<string, string>>({});
  const [emails, setEmails] = useState<string[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<string>("");

  const [selectedContato, setSelectedContato] = useState<Contato | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [editingResposta, setEditingResposta] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchContatos() {
      try {
        const data = await getAllAdminContatos();
        const emailKeys: string[] = [];

        const emailMapping: Record<string, string> = {};
        for (const userId in data) {
          const userContatos = data[userId];
          if (userContatos.length > 0) {
            emailMapping[userId] = userContatos[0].email;
            emailKeys.push(userContatos[0].email);
          }
        }

        setContatosObj(data);
        setEmailMap(emailMapping);
        setEmails(emailKeys);

        if (emailKeys.length > 0) {
          setSelectedEmail(emailKeys[0]);
        }
      } catch (error) {
        console.error("Erro ao buscar contatos:", error);
        toast.error("Ocorreu um erro ao buscar as perguntas. Tente novamente.");
      }
    }

    fetchContatos();
  }, []);

  const contatos = selectedEmail
    ? contatosObj[Object.keys(emailMap).find((key) => emailMap[key] === selectedEmail) || ""] || []
    : [];

  function handleOpenDialog(contato: Contato) {
    setSelectedContato(contato);
    setEditingResposta({ [contato._id]: contato.resposta || "" });
    setIsDialogOpen(true);
  }

  function handleCloseDialog() {
    setIsDialogOpen(false);
    setSelectedContato(null);
  }

  async function handleEditResposta(contatoId: string) {
    const respostaAtual = editingResposta[contatoId];
    if (!respostaAtual) {
      toast.error("Digite uma resposta antes de salvar.");
      return;
    }

    try {
      await editAdminContato(contatoId, { resposta: respostaAtual });
      toast.success("Resposta atualizada com sucesso!");

      const updatedObj = await getAllAdminContatos();
      setContatosObj(updatedObj);

      const updatedEmailMap: Record<string, string> = {};
      const updatedEmailKeys: string[] = [];
      for (const userId in updatedObj) {
        const userContatos = updatedObj[userId];
        if (userContatos.length > 0) {
          updatedEmailMap[userId] = userContatos[0].email;
          updatedEmailKeys.push(userContatos[0].email);
        }
      }

      setEmailMap(updatedEmailMap);
      setEmails(updatedEmailKeys);
      if (!updatedEmailMap[selectedEmail]) {
        setSelectedEmail(updatedEmailKeys[0] || "");
      }

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

  async function handleDeleteContato(contatoId: string) {
    try {
      await deleteAdminContato(contatoId);
      toast.success("Contato deletado com sucesso!");

      const updatedObj = await getAllAdminContatos();
      setContatosObj(updatedObj);

      const updatedEmailMap: Record<string, string> = {};
      const updatedEmailKeys: string[] = [];
      for (const userId in updatedObj) {
        const userContatos = updatedObj[userId];
        if (userContatos.length > 0) {
          updatedEmailMap[userId] = userContatos[0].email;
          updatedEmailKeys.push(userContatos[0].email);
        }
      }

      setEmailMap(updatedEmailMap);
      setEmails(updatedEmailKeys);
      if (!updatedEmailMap[selectedEmail]) {
        setSelectedEmail(updatedEmailKeys[0] || "");
      }

      handleCloseDialog();
    } catch (error) {
      console.error("Erro ao deletar contato:", error);
      toast.error("Não foi possível deletar. Tente novamente.");
    }
  }

  return (
    <>
      {/* Ajustes no container: não muda no mobile, mas dá mais padding e tamanho no md: */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        {/* Aumentamos o tamanho no desktop (md:) para 7xl (ou 6xl se quiser um pouco menor) */}
        <h1 className="text-3xl sm:text-4xl md:text-7xl font-bold mb-8 sm:mb-12 text-gray-800">
          Perguntas do cliente
        </h1>

        <div className="mb-8">
          {/* label: md:text-2xl => agora md:text-3xl */}
          <label className="block text-base sm:text-lg md:text-3xl font-bold text-gray-800 mb-2">
            Selecione o cliente:
          </label>
          <select
            className="border-2 border-gray-300 rounded-md p-2 sm:p-3 text-base sm:text-lg md:text-2xl"
            value={selectedEmail}
            onChange={(e) => setSelectedEmail(e.target.value)}
          >
            {emails.length === 0 && (
              <option value="">Nenhum cliente encontrado</option>
            )}
            {emails.map((email) => (
              <option key={email} value={email}>
                {email}
              </option>
            ))}
          </select>
        </div>

        {/* Aumentei o gap em md: (sm:gap-12 -> md:gap-16), se quiser */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 md:gap-16">
          <div className="col-span-2 space-y-4 sm:space-y-6">
            {contatos.length === 0 ? (
              <p className="text-base sm:text-lg md:text-2xl text-gray-600">
                Nenhuma pergunta para esse cliente.
              </p>
            ) : (
              contatos.map((contato) => (
                <div
                  key={contato._id}
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
                  <div className="flex-1 text-base sm:text-lg md:text-2xl text-gray-800">
                    <p className="font-bold mb-2">{contato.mensagem}</p>
                    <p className="text-gray-600">
                      {contato.resposta
                        ? `Resposta: ${contato.resposta}`
                        : "Sem resposta no momento"}
                    </p>
                  </div>

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
                    onClick={() => handleOpenDialog(contato)}
                  >
                    <Plus size={24} />
                    Detalhes
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Card lateral */}
          <div
            className="
              hidden 
              sm:flex 
              flex-col 
              items-center 
              text-center 
              bg-white 
              shadow-lg 
              border-2 
              border-gray-300 
              rounded-lg 
              p-6 
              sm:p-8
            "
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

      {/* Diálogo: aumenta um pouco no desktop (md:max-w-3xl ou algo maior) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="
            w-[90%]
            max-w-sm
            sm:max-w-md
            md:max-w-3xl
            bg-white
            rounded-lg
            shadow-lg
            p-4
            sm:p-8
            overflow-auto
          "
        >
          <DialogHeader>
            {/* Título ainda maior no desktop: md:text-6xl */}
            <DialogTitle className="text-2xl sm:text-3xl md:text-6xl text-gray-900 font-bold">
              {selectedContato?.mensagem || "Detalhes da Pergunta"}
            </DialogTitle>
          </DialogHeader>

          {selectedContato && (
            <div className="mt-4 sm:mt-6 text-base sm:text-lg md:text-2xl">
              <p className="mb-4">
                <strong>Email do usuário:</strong> {selectedContato.email}
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
                  onClick={() => handleEditResposta(selectedContato._id)}
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
                  onClick={() => handleDeleteContato(selectedContato._id)}
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
