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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AlertCircle, CreditCard, QrCode } from "lucide-react";
import toast from "react-hot-toast";

export const Pacotes = () => {
  const [pacotes, setPacotes] = useState<any[]>([]);
  const [userType, setUserType] = useState<"Pessoa" | "Empresa" | null>(null);

  // Diálogos
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  // Pacote selecionado
  const [selectedPacote, setSelectedPacote] = useState<any | null>(null);

  // Endereço
  const [address, setAddress] = useState({
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
  });
  const [addressError, setAddressError] = useState("");

  // Pagamento
  const [paymentMethod, setPaymentMethod] = useState<"Cartão" | "PIX">("PIX");
  const [cardDetails, setCardDetails] = useState({
    numero: "",
    nome: "",
    validade: "",
    cvv: "",
  });
  const [cardError, setCardError] = useState("");

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

  // Fecha o primeiro diálogo e abre o do endereço
  const handleContinue = () => {
    setIsDetailsDialogOpen(false);
    setIsAddressDialogOpen(true);
  };

  // Valida o endereço antes de prosseguir
  const handleAddressSubmit = () => {
    if (!address.cep || !address.rua || !address.numero) {
      setAddressError("Preencha todos os campos obrigatórios.");
      return;
    }
    setAddressError("");
    setIsAddressDialogOpen(false);
    setIsPaymentDialogOpen(true);
  };

  // Finaliza a compra -> chama a API para criar o acordo
  const handleFinalizarCompra = async () => {
    if (paymentMethod === "Cartão") {
      if (
        !cardDetails.numero ||
        !cardDetails.nome ||
        !cardDetails.validade ||
        !cardDetails.cvv
      ) {
        setCardError("Preencha todos os dados do cartão.");
        return;
      }
    }

    if (!selectedPacote?._id) return;
    try {
      await createAcordo(selectedPacote._id);
      toast.success("Compra finalizada com sucesso!");
      setIsPaymentDialogOpen(false);
      setSelectedPacote(null);
    } catch (error) {
      console.error("Erro ao finalizar a compra:", error);
      toast.error("Não foi possível finalizar a compra. Tente novamente.");
    }
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
    return value; // Retorna valores não-string sem alterações
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-10 md:mb-12 text-center">
        Pacotes disponíveis para você
      </h1>

      {/* Verifica se já carregou os dados do usuário */}
      {userType ? (
        <div className="flex flex-wrap gap-6 justify-center">
          {filteredPacotes.map((pacote, index) => (
            <Card
              key={index}
              className="p-4 sm:p-6 md:p-8 shadow-lg border rounded-xl bg-white flex flex-col items-center w-full max-w-sm"
            >
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                {pacote.nome}
              </h3>
              <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700 mt-2 sm:mt-4">
                {pacote.tipo.join(", ")}
              </p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mt-2 sm:mt-4">
                R$ {pacote.preco}/mês
              </p>
              <Button
                className="mt-4 sm:mt-6 bg-blue-600 text-white hover:bg-blue-700 text-base sm:text-lg md:text-xl py-2 sm:py-3 w-full"
                onClick={() => handleViewDetails(pacote)}
              >
                Ver Detalhes
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-xl sm:text-2xl md:text-3xl text-gray-600">
          Carregando informações...
        </p>
      )}

      {/* Dialog 1: Detalhes do pacote */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent
          className="
            w-[90%]
            max-w-sm
            sm:max-w-2xl
            max-h-[80vh]
            p-4
            sm:p-8
            bg-white
            rounded-lg
            shadow-lg
            overflow-auto
          "
        >
          <DialogHeader>
            <DialogTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">
              Detalhes do Pacote
            </DialogTitle>
          </DialogHeader>
          {selectedPacote && (
            <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6 text-base sm:text-lg md:text-xl leading-relaxed">
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
                <strong>Cortesia:</strong>{" "}
                {selectedPacote.cortesia || "Nenhuma"}
              </p>
              {selectedPacote.detalhes &&
              Object.keys(selectedPacote.detalhes).length > 0 ? (
                <div>
                  <strong className="block mb-2">Mais informações:</strong>
                  <div className="space-y-2 sm:space-y-4">
                    {Object.entries(selectedPacote.detalhes).map(
                      ([key, value]: any, idx) => (
                        <div key={idx}>
                          {typeof value === "object" && value !== null ? (
                            <>
                              <strong className="font-semibold">
                                {formatKey(key)}:
                              </strong>
                              <ul className="list-disc list-inside ml-4 space-y-1">
                                {Object.entries(value).map(([subKey, subVal]) => (
                                  <li key={subKey}>
                                    <span className="font-semibold">
                                      {formatKey(subKey)}:{" "}
                                    </span>
                                    {formatValue(subVal)}
                                  </li>
                                ))}
                              </ul>
                            </>
                          ) : (
                            <p>
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
                <p>Nenhum detalhe adicional.</p>
              )}

              <Button
                className="bg-blue-600 text-white w-full mt-4 sm:mt-6 text-base sm:text-lg md:text-xl py-2 sm:py-3"
                onClick={handleContinue}
              >
                Continuar para pagamento
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog 2: Endereço */}
      <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
        <DialogContent
          className="
            w-[90%]
            max-w-sm
            sm:max-w-2xl
            max-h-[80vh]
            p-4
            sm:p-8
            bg-white
            rounded-lg
            shadow-lg
            overflow-auto
          "
        >
          <DialogHeader>
            <DialogTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">
              Endereço de Pagamento
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6 text-base sm:text-lg md:text-xl leading-relaxed">
            <div className="space-y-2">
              <Label className="text-base sm:text-lg md:text-xl">CEP</Label>
              <Input
                placeholder="CEP"
                value={address.cep}
                onChange={(e) =>
                  setAddress({ ...address, cep: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="text-base sm:text-lg md:text-xl">Rua</Label>
              <Input
                placeholder="Rua"
                value={address.rua}
                onChange={(e) =>
                  setAddress({ ...address, rua: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="text-base sm:text-lg md:text-xl">
                Número
              </Label>
              <Input
                placeholder="Número"
                value={address.numero}
                onChange={(e) =>
                  setAddress({ ...address, numero: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="text-base sm:text-lg md:text-xl">
                Complemento
              </Label>
              <Input
                placeholder="Complemento"
                value={address.complemento}
                onChange={(e) =>
                  setAddress({ ...address, complemento: e.target.value })
                }
              />
            </div>
            {addressError && (
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                <p>{addressError}</p>
              </div>
            )}
            <Button
              className="bg-blue-600 text-white w-full text-base sm:text-lg md:text-xl py-2 sm:py-3 mt-2"
              onClick={handleAddressSubmit}
              disabled={!address.cep || !address.rua || !address.numero}
            >
              Continuar para Pagamento
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog 3: Pagamento */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent
          className="
            w-[90%]
            max-w-sm
            sm:max-w-2xl
            max-h-[80vh]
            p-4
            sm:p-8
            bg-white
            rounded-lg
            shadow-lg
            overflow-auto
          "
        >
          <DialogHeader>
            <DialogTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">
              Pagamento
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6 text-base sm:text-lg md:text-xl leading-relaxed">
            <Select
              value={paymentMethod}
              onValueChange={(value: "Cartão" | "PIX") =>
                setPaymentMethod(value)
              }
            >
              <SelectTrigger className="w-full text-base sm:text-lg md:text-xl bg-white border border-gray-300 rounded-lg">
                <SelectValue placeholder="Selecione a forma de pagamento" />
              </SelectTrigger>
              <SelectContent className="w-full bg-white border border-gray-300 rounded-lg">
                <SelectItem value="Cartão" className="text-base sm:text-lg">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
                    Cartão de Crédito
                  </div>
                </SelectItem>
                <SelectItem value="PIX" className="text-base sm:text-lg">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 sm:w-6 sm:h-6" />
                    PIX
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {paymentMethod === "Cartão" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base sm:text-lg md:text-xl">
                    Número do Cartão
                  </Label>
                  <Input
                    placeholder="Número do Cartão"
                    value={cardDetails.numero}
                    onChange={(e) =>
                      setCardDetails({
                        ...cardDetails,
                        numero: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base sm:text-lg md:text-xl">
                    Nome no Cartão
                  </Label>
                  <Input
                    placeholder="Nome no Cartão"
                    value={cardDetails.nome}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, nome: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base sm:text-lg md:text-xl">
                    Validade (MM/AA)
                  </Label>
                  <Input
                    placeholder="Validade"
                    value={cardDetails.validade}
                    onChange={(e) =>
                      setCardDetails({
                        ...cardDetails,
                        validade: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base sm:text-lg md:text-xl">CVV</Label>
                  <Input
                    placeholder="CVV"
                    value={cardDetails.cvv}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, cvv: e.target.value })
                    }
                  />
                </div>
                {cardError && (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                    <p>{cardError}</p>
                  </div>
                )}
              </div>
            )}

            {paymentMethod === "PIX" && (
              <div className="text-center">
                <p className="mb-4 text-base sm:text-lg md:text-xl">
                  Escaneie o QRCode abaixo para efetuar o pagamento.
                </p>
                <img
                  src="/images/qrcode-pix.png"
                  alt="QRCode de pagamento"
                  className="mx-auto mb-6 h-48 w-48 sm:h-60 sm:w-60"
                />
              </div>
            )}

            <Button
              className="bg-green-600 text-white w-full text-base sm:text-lg md:text-xl py-2 sm:py-3"
              onClick={handleFinalizarCompra}
              disabled={
                paymentMethod === "Cartão" &&
                (!cardDetails.numero ||
                  !cardDetails.nome ||
                  !cardDetails.validade ||
                  !cardDetails.cvv)
              }
            >
              Finalizar Compra
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
