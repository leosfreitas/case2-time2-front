import { useState, useEffect } from "react";
import { getAllPacotes } from "./api/getPacotes";
import { getUserData } from "./api/getUserData";
import { createAcordo } from "./api/acordoRequests"; // <-- Nova importação
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import toast from "react-hot-toast";

export const Pacotes = () => {
  const [pacotes, setPacotes] = useState<any[]>([]);
  const [userType, setUserType] = useState<"Pessoa" | "Empresa" | null>(null); // Tipo do usuário
  
  // Diálogos
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Primeiro Dialog (confirma pacote)
  const [isQRCodeDialogOpen, setIsQRCodeDialogOpen] = useState(false); // Segundo Dialog (mostra QR)
  
  // Pacote selecionado
  const [selectedPacote, setSelectedPacote] = useState<any | null>(null);

  // Buscar tipo do usuário e pacotes
  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getUserData();
        setUserType(userData.tipo); // "Pessoa" ou "Empresa"

        const pacotesData = await getAllPacotes();
        setPacotes(pacotesData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }
    fetchData();
  }, []);

  // Filtra os pacotes com base no tipo do usuário
  const filteredPacotes = pacotes.filter((p) => p.cliente === userType);


  // Quando clicar em "Selecionar Plano", abrimos o primeiro diálogo
  const handleSelectPlan = (pacote: any) => {
    setSelectedPacote(pacote);
    setIsDialogOpen(true);
  };

  // Fecha o primeiro diálogo e abre o do QRCode
  const handleContinue = () => {
    setIsDialogOpen(false);
    setIsQRCodeDialogOpen(true);
  };

  // Finaliza a compra -> chama a API para criar o acordo
  const handleFinalizarCompra = async () => {
    if (!selectedPacote?._id) return;

    try {
      await createAcordo(selectedPacote._id);
      toast.success("Compra finalizada com sucesso!");
      setIsQRCodeDialogOpen(false);
      setSelectedPacote(null);
    } catch (error) {
      console.error("Erro ao finalizar a compra:", error);
      toast.error("Não foi possível finalizar a compra. Tente novamente.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-5xl font-bold mb-10 text-center">Pacotes disponíveis para você</h1>

      {/* Verifica se já carregou os dados do usuário */}
      {userType ? (
        <>
          {/* Lista de Pacotes */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPacotes.length === 0 ? (
              <p className="text-center col-span-3 text-xl text-gray-600">Nenhum pacote encontrado.</p>
            ) : (
              filteredPacotes.map((pacote, index) => (
                <Card
                  key={index}
                  className="p-6 shadow-lg border rounded-xl bg-white text-center"
                >
                  <h3 className="text-xl font-bold text-gray-900">{pacote.nome}</h3>
                  <p className="text-lg font-semibold text-gray-800 mt-2">
                    {pacote.tipo.join(", ")}
                  </p>
                  <p className="text-lg font-semibold text-gray-900 mt-2">
                    {`R$ ${pacote.preco}/mês`}
                  </p>
                  <Button
                    className="mt-4 w-full bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => handleSelectPlan(pacote)}
                  >
                    Selecionar Plano
                  </Button>
                </Card>
              ))
            )}
          </div>
        </>
      ) : (
        <p className="text-center text-lg text-gray-600">Carregando informações...</p>
      )}

      {/* Dialog 1: Confirmação do pacote */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg p-8 bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">Confirmação de Pacote</DialogTitle>
          </DialogHeader>
          {selectedPacote && (
            <div className="space-y-4 mt-6">
              <p>
                <strong>Pacote:</strong> {selectedPacote.nome}
              </p>
              <p>
                <strong>Tipo:</strong> {selectedPacote.tipo.join(", ")}
              </p>
              <p>
                <strong>Preço:</strong> R$ {selectedPacote.preco}/mês
              </p>
              <Button
                className="bg-blue-600 text-white w-full mt-6"
                onClick={handleContinue}
              >
                Continuar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog 2: QRCode e Finalização */}
      <Dialog open={isQRCodeDialogOpen} onOpenChange={setIsQRCodeDialogOpen}>
        <DialogContent className="max-w-lg p-8 bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">Pagamento</DialogTitle>
          </DialogHeader>
          <div className="mt-6 text-center">
            <p className="mb-4 text-lg">
              Escaneie o QRCode abaixo para efetuar o pagamento.
            </p>
            {/* QRCode Placeholder */}
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/QR_code_Wikimedia_Commons_%28URL%29.png/300px-QR_code_Wikimedia_Commons_%28URL%29.png"
              alt="QRCode de pagamento"
              className="mx-auto mb-6 h-40 w-40"
            />
            <Button
              className="bg-green-600 text-white w-full"
              onClick={handleFinalizarCompra}
            >
              Finalizar Compra
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
