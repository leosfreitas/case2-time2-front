import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { getMyAcordos } from "./api/acordos";
import { deleteAcordo } from "./api/acordos";

export const Home = () => {
  const [acordos, setAcordos] = useState<any[]>([]); // Lista de contratos
  const [selectedAcordo, setSelectedAcordo] = useState<any | null>(null); // Contrato selecionado para exclusão
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Controle do Dialog de exclusão

  // Carregar os contratos do cliente ao montar o componente
  useEffect(() => {
    async function fetchAcordos() {
      try {
        const response = await getMyAcordos();
        setAcordos(response);
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

      // Atualizar a lista de contratos após cancelamento
      setAcordos((prev) => prev.filter((acordo) => acordo._id !== selectedAcordo._id));

      // Fechar o dialog
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {acordos.length === 0 ? (
          <p className="text-center text-xl text-gray-600 col-span-full">
            Você ainda não possui contratos.
          </p>
        ) : (
          acordos.map((acordo) => (
            <Card
              key={acordo._id}
              className="p-6 shadow-lg border rounded-xl bg-white"
            >
              <h3 className="text-xl font-bold text-gray-900">Pacote ID: {acordo.pacote_id}</h3>
              <p className="text-lg text-gray-700 mt-2">
                <strong>Status:</strong> {acordo.status || "Ativo"}
              </p>
              <div className="mt-4 flex gap-4">
                <Button
                  className="bg-red-600 text-white hover:bg-red-700 w-full"
                  onClick={() => handleCancelClick(acordo)}
                >
                  Cancelar
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Dialog de confirmação de cancelamento */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg p-8 bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">Cancelar Contrato</DialogTitle>
          </DialogHeader>
          {selectedAcordo && (
            <div className="mt-4">
              <p className="text-lg text-gray-800">
                Tem certeza de que deseja cancelar o contrato do pacote com ID{" "}
                <strong>{selectedAcordo.pacote_id}</strong>?
              </p>
              <div className="mt-6 flex gap-4">
                <Button
                  className="bg-gray-300 text-gray-800 hover:bg-gray-400 w-full"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Voltar
                </Button>
                <Button
                  className="bg-red-600 text-white hover:bg-red-700 w-full"
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
