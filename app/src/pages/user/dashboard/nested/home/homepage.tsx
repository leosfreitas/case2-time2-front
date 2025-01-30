import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { getMyAcordos, deleteAcordo, getPacoteAcordoDetail } from "./api/acordos";

export const Home = () => {
  const [acordos, setAcordos] = useState<any[]>([]); // Lista de contratos
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Controle do Dialog de exclusão
  const [selectedAcordo, setSelectedAcordo] = useState<any | null>(null); // Contrato selecionado para exclusão
  const [pacoteDetalhes, setPacoteDetalhes] = useState<Record<string, any>>({}); // Cache de detalhes dos pacotes

  // Carregar os contratos do cliente ao montar o componente
  useEffect(() => {
    async function fetchAcordos() {
      try {
        const response = await getMyAcordos();
        setAcordos(response);

        // Busca os detalhes de cada pacote
        const detalhesPromises = response.map((acordo: any) =>
          getPacoteAcordoDetail(acordo.pacote_id)
        );
        const detalhes = await Promise.all(detalhesPromises);

        // Salvar os detalhes dos pacotes no estado
        const detalhesMap = detalhes.reduce((acc: any, detalhe: any, index: number) => {
          acc[response[index].pacote_id] = detalhe;
          return acc;
        }, {});
        setPacoteDetalhes(detalhesMap);

      } catch (error) {
        console.error("Erro ao buscar acordos:", error);
        toast.error("Erro ao carregar contratos. Tente novamente.");
      }
    }

    fetchAcordos();
  }, []);

  // Abrir o dialog de confirmação para cancelar um contrato
  const handleCancelClick = (acordo: any) => {
    setSelectedAcordo(acordo);
    setIsDialogOpen(true);
  };

  // Confirmar o cancelamento do contrato
  const handleConfirmCancel = async () => {
    if (!selectedAcordo?._id) return;

    try {
      await deleteAcordo(selectedAcordo._id);
      toast.success("Contrato cancelado com sucesso!");

      // Atualiza a lista de contratos
      setAcordos((prev) => prev.filter((acordo) => acordo._id !== selectedAcordo._id));

      // Remove do cache de detalhes
      setPacoteDetalhes((prev) => {
        const updated = { ...prev };
        delete updated[selectedAcordo.pacote_id];
        return updated;
      });

      // Fecha o dialog
      setIsDialogOpen(false);
      setSelectedAcordo(null);

    } catch (error) {
      console.error("Erro ao cancelar contrato:", error);
      toast.error("Erro ao cancelar contrato. Tente novamente.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-5xl font-bold mb-10 text-center">Seus Contratos</h1>

      {/* Lista de contratos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {acordos.length === 0 ? (
          <p className="text-3xl text-center text-gray-600 col-span-full">
            Você ainda não possui contratos.
          </p>
        ) : (
          acordos.map((acordo) => {
            const pacote = pacoteDetalhes[acordo.pacote_id];
            return (
              <Card
                key={acordo._id}
                className="p-12 shadow-lg border rounded-xl bg-white flex flex-col"
              >
                {pacote ? (
                  <>
                    <h3 className="text-3xl font-bold text-gray-900">{pacote.nome}</h3>
                    <p className="text-3xl text-gray-700 mt-4">
                      <strong>Preço:</strong> R$ {pacote.preco}
                    </p>
                  </>
                ) : (
                  <p className="text-3xl text-gray-700">Carregando detalhes do pacote...</p>
                )}
                <p className="text-3xl text-gray-700 mt-2">
                  <strong>Status:</strong> {acordo.status || "Ativo"}
                </p>
                <div className="mt-6">
                  <Button
                    className="bg-red-600 mt-[4vh] text-white hover:bg-red-700 text-2xl py-3 w-full"
                    onClick={() => handleCancelClick(acordo)}
                  >
                    Cancelar
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Dialog de confirmação de cancelamento */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl p-8 bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-4xl font-bold text-center">
              Cancelar Contrato
            </DialogTitle>
          </DialogHeader>
          {selectedAcordo && (
            <div className="mt-6 text-2xl">
              <p className="mb-6">
                Tem certeza de que deseja cancelar o contrato do pacote{" "}
                <strong>
                  {pacoteDetalhes[selectedAcordo.pacote_id]?.nome || "Desconhecido"}
                </strong>
                ?
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  className="bg-gray-300 text-gray-800 hover:bg-gray-400 text-2xl py-3 w-full"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Voltar
                </Button>
                <Button
                  className="bg-red-600 text-white hover:bg-red-700 text-2xl py-3 w-full"
                  onClick={handleConfirmCancel}
                >
                  Confirmar Cancelamento
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
