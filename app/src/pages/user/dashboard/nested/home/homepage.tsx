import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { getMyAcordos, deleteAcordo, getPacoteAcordoDetail } from "./api/acordos";

export const Home = () => {
  const [acordos, setAcordos] = useState<any[]>([]); // Lista de contratos
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Controle do Dialog de exclusão
  const [selectedAcordo, setSelectedAcordo] = useState<any | null>(null); // Contrato selecionado
  const [pacoteDetalhes, setPacoteDetalhes] = useState<Record<string, any>>({}); // Cache dos pacotes

  // Carrega os contratos do cliente ao montar o componente
  useEffect(() => {
    async function fetchAcordos() {
      try {
        const response = await getMyAcordos();
        setAcordos(response);

        // Busca detalhes de cada pacote
        const detalhesPromises = response.map((acordo: any) =>
          getPacoteAcordoDetail(acordo.pacote_id)
        );
        const detalhes = await Promise.all(detalhesPromises);

        // Mapeia os detalhes no estado
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

  // Abre o dialog de confirmação para cancelar
  const handleCancelClick = (acordo: any) => {
    setSelectedAcordo(acordo);
    setIsDialogOpen(true);
  };

  // Confirma cancelamento
  const handleConfirmCancel = async () => {
    if (!selectedAcordo?._id) return;

    try {
      await deleteAcordo(selectedAcordo._id);
      toast.success("Contrato cancelado com sucesso!");

      // Atualiza lista
      setAcordos((prev) => prev.filter((a) => a._id !== selectedAcordo._id));

      // Remove do cache de detalhes
      setPacoteDetalhes((prev) => {
        const updated = { ...prev };
        delete updated[selectedAcordo.pacote_id];
        return updated;
      });

      // Fecha dialog
      setIsDialogOpen(false);
      setSelectedAcordo(null);
    } catch (error) {
      console.error("Erro ao cancelar contrato:", error);
      toast.error("Erro ao cancelar contrato. Tente novamente.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8 sm:py-12 md:py-20">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-10 md:mb-12 text-center">
        Seus Contratos
      </h1>

      {/* Lista de contratos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
        {acordos.length === 0 ? (
          <p className="text-lg sm:text-xl md:text-2xl text-center text-gray-600 col-span-full">
            Você ainda não possui contratos.
          </p>
        ) : (
          acordos.map((acordo) => {
            const pacote = pacoteDetalhes[acordo.pacote_id];
            return (
              <Card
                key={acordo._id}
                className="p-8 sm:p-12 shadow-lg border rounded-xl bg-white flex flex-col w-[40vh] sm:w-full"
              >
                {pacote ? (
                  <>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                      {pacote.nome}
                    </h3>
                    <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mt-3">
                      <strong>Preço:</strong> R$ {pacote.preco}
                    </p>
                  </>
                ) : (
                  <p className="text-lg sm:text-xl md:text-2xl text-gray-700">
                    Carregando detalhes do pacote...
                  </p>
                )}
                <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mt-3">
                  <strong>Status:</strong> {acordo.status || "Ativo"}
                </p>
                <div className="mt-4 sm:mt-6">
                  <Button
                    className="bg-red-600 text-white hover:bg-red-700 text-base sm:text-lg md:text-xl py-2 sm:py-3 w-full"
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
        {/* 
          w-[90%]: ocupa 90% da tela em mobile
          max-w-xs: ~20rem 
          sm:max-w-md: ~28rem
          md:max-w-lg ou sm:max-w-xl/2xl se preferir maior
          max-h-[70vh]: não passa de 70% da altura total
          overflow-auto: se precisar rolar no mobile
        */}
        <DialogContent
          className="
            mx-auto
            w-[90%]
            max-w-xs
            sm:max-w-md 
            md:max-w-lg
            h-auto
            max-h-[70vh]
            p-4 sm:p-8
            bg-white
            rounded-lg
            shadow-lg
            overflow-auto
          "
        >
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-center">
              Cancelar Contrato
            </DialogTitle>
          </DialogHeader>

          {selectedAcordo && (
            <div className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg leading-relaxed">
              <p className="mb-4 sm:mb-6">
                Tem certeza de que deseja cancelar o contrato do pacote{" "}
                <strong>
                  {pacoteDetalhes[selectedAcordo.pacote_id]?.nome || "Desconhecido"}
                </strong>
                ?
              </p>
              <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row">
                <Button
                  className="bg-gray-300 text-gray-800 hover:bg-gray-400 text-base sm:text-lg md:text-xl py-2 sm:py-3 w-full"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Voltar
                </Button>
                <Button
                  className="bg-red-600 text-white hover:bg-red-700 text-base sm:text-lg md:text-xl py-2 sm:py-3 w-full"
                  onClick={handleConfirmCancel}
                >
                  Confirmar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
