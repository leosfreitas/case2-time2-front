import { useState, useEffect } from "react";
import { getAllPacotes } from "./api/getPacotes";
import { getUserData } from "./api/getUserData";
import { createAcordo } from "./api/acordoRequests";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

export const Pacotes = () => {
  const [pacotes, setPacotes] = useState<any[]>([]);
  const [userType, setUserType] = useState<"Pessoa" | "Empresa" | null>(null);

  // Diálogos
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isQRCodeDialogOpen, setIsQRCodeDialogOpen] = useState(false);

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

  // Quando clicar em "Ver Detalhes", abrimos o primeiro diálogo
  const handleViewDetails = (pacote: any) => {
    setSelectedPacote(pacote);
    setIsDetailsDialogOpen(true);
  };

  // Fecha o primeiro diálogo e abre o do QRCode
  const handleContinue = () => {
    setIsDetailsDialogOpen(false);
    setIsQRCodeDialogOpen(true);
  };

  const formatKey = (key: string) => {
    return key
      .replace(/_/g, " ") // Substitui underscores por espaços
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitaliza a primeira letra de cada palavra
  };
  
  const formatValue = (value: any) => {
    if (typeof value === "string") {
      // Tratamento especial para valores conhecidos
      const formatted = value
        .toLowerCase()
        .replace("fibra optica", "Fibra Óptica")
        .replace("5g", "5G")
        .replace("4g", "4G");
      return formatted.charAt(0).toUpperCase() + formatted.slice(1); // Capitaliza a primeira letra
    }
    return value; // Retorna valores não string sem alterações
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
      <h1 className="text-5xl font-bold mb-10 text-center">
        Pacotes disponíveis para você
      </h1>

      {/* Verifica se já carregou os dados do usuário */}
      {userType ? (
        <div className="flex flex-wrap gap-6 justify-center">
          {filteredPacotes.map((pacote, index) => (
            <Card
              key={index}
              className="p-8 shadow-lg border rounded-xl bg-white flex flex-col items-center w-80"
            >
              <h3 className="text-4xl font-bold text-gray-900">{pacote.nome}</h3>
              <p className="text-2xl font-semibold text-gray-700 mt-4">
                {pacote.tipo.join(", ")}
              </p>
              <p className="text-3xl font-bold text-gray-800 mt-4">
                R$ {pacote.preco}/mês
              </p>
              <Button
                className="mt-[3vh] bg-blue-600 text-white hover:bg-blue-700 text-2xl py-3 w-full"
                onClick={() => handleViewDetails(pacote)}
              >
                Ver Detalhes
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-3xl text-gray-600">
          Carregando informações...
        </p>
      )}

      {/* Dialog 1: Detalhes do pacote */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl p-8 bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-4xl font-bold text-center">
              Detalhes do Pacote
            </DialogTitle>
          </DialogHeader>
          {selectedPacote && (
            <div className="space-y-6 mt-6 text-2xl">
              <p>
                <strong>Pacote:</strong> {selectedPacote.nome}
              </p>
              <p>
                <strong>Tipos:</strong> {selectedPacote.tipo.join(", ")}
              </p>
              <p>
                <strong>Preço:</strong> R$ {selectedPacote.preco}/mês
              </p>
              <p>
                <strong>Cortesia:</strong> {selectedPacote.cortesia || "Nenhuma"}
              </p>
              {selectedPacote.detalhes &&
                Object.keys(selectedPacote.detalhes).length > 0 ? (
                  <div>
                    <strong className="text-2xl">Mais informações:</strong>
                    <div className="mt-4 space-y-4">
                      {Object.entries(selectedPacote.detalhes).map(
                        ([key, value]: any, idx) => (
                          <div key={idx}>
                            <strong className="font-semibold text-2xl">{formatKey(key)}:</strong>
                            {typeof value === "object" && value !== null ? (
                              <ul className="list-disc list-inside ml-4 space-y-2">
                                {Object.entries(value).map(([subKey, subVal]) => (
                                  <li key={subKey} className="text-2xl">
                                    <strong className="font-semibold">{formatKey(subKey)}: </strong>
                                    {formatValue(subVal)}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-2xl">
                                <strong>{formatKey(key)}: </strong>
                                {formatValue(value)}
                              </p>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-2xl">Sem detalhes adicionais.</p>
                )}



              <Button
                className="bg-blue-600 text-white w-full mt-6 text-3xl py-4"
                onClick={handleContinue}
              >
                Continuar para pagamento
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog 2: QRCode e Finalização */}
      <Dialog open={isQRCodeDialogOpen} onOpenChange={setIsQRCodeDialogOpen}>
        <DialogContent className="max-w-2xl p-8 bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-4xl font-bold text-center">
              Pagamento
            </DialogTitle>
          </DialogHeader>
          <div className="mt-6 text-center">
            <p className="mb-4 text-3xl">
              Escaneie o QRCode abaixo para efetuar o pagamento.
            </p>
            <img
              src="/images/qrcode-pix.png"
              alt="QRCode de pagamento"
              className="mx-auto mb-6 h-60 w-60"
            />
            <Button
              className="bg-green-600 text-white w-full text-3xl py-4"
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
