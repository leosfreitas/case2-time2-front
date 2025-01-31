import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  WifiHigh,
  Globe,
  Phone,
  EnvelopeOpen,
  Quotes,
  ArrowLeft,
  ArrowRight,
  CellSignalFull,
} from "@phosphor-icons/react";
import { Header } from "../../components/header";
import { useState, useEffect, useRef } from "react";
import { Footer } from "../../components/footer";
import { getAllPacotes } from "./api/getPacotes";
import { checkUserToken } from "../../components/api/token";
import { getUserData } from "@/pages/user/dashboard/nested/profile/api/profile";
import { createAcordo } from "@/pages/user/dashboard/nested/pacotes/api/acordoRequests";
import toast from "react-hot-toast";

// Imports para fluxo de compra
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

type UserType = "Pessoa" | "Empresa" | undefined;

export const Home = () => {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<UserType>(undefined);

  // Armazena todos os pacotes completos (vindo do backend)
  const [allPacotes, setAllPacotes] = useState<any[]>([]);

  // Pacotes que serão exibidos conforme toggle ou tipo do usuário
  const [companyPlans, setCompanyPlans] = useState<any[]>([]);
  const [clientPlans, setClientPlans] = useState<any[]>([]);

  // Toggle "empresas" ou "Pessoa" (quando NÃO logado)
  const [selectedType, setSelectedType] = useState<"empresas" | "Pessoa">(
    "Pessoa"
  );

  // Scroll
  const packagesRef = useRef<HTMLDivElement>(null);
  const scrollToPackages = () => {
    if (packagesRef.current) {
      packagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Carrossel
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  // ================= FLUXO DE COMPRA =================
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

  // 1) Verifica se o usuário está logado (token) e se é Pessoa/Empresa
  useEffect(() => {
    async function verifyUser() {
      try {
        await checkUserToken(); // se falhar, cai no catch
        setIsLoggedIn(true);

        // Pega tipo do usuário
        const response = await getUserData();
        const tipo = response?.data?.tipo;
        if (tipo === "Pessoa" || tipo === "Empresa") {
          setUserType(tipo);
        } else {
          setIsLoggedIn(false);
          setUserType(undefined);
        }
      } catch (errorUser) {
        setIsLoggedIn(false);
        setUserType(undefined);
      } finally {
        setIsAuthChecked(true);
      }
    }
    verifyUser();
  }, []);

  // 2) Busca todos os pacotes do backend
  useEffect(() => {
    async function fetchPacotes() {
      try {
        const pacotes = await getAllPacotes();
        setAllPacotes(pacotes);

        // Filtra pacotes para "Empresa"
        const newCompanyPlans = pacotes
          .filter((p: any) => p.cliente === "Empresa")
          .map((p: any) => {
            let service = p.tipo.join(", ");
            if (p.detalhes?.Residencial && p.tipo.includes("Residencial")) {
              const { velocidade, tipo } = p.detalhes.Residencial;
              service = `${velocidade} (${tipo})`;
            }
            return {
              ...p,
              name: p.nome,
              service,
              price: `R$ ${p.preco}/mês`,
            };
          });

        // Filtra pacotes para "Pessoa"
        const newClientPlans = pacotes
          .filter((p: any) => p.cliente === "Pessoa")
          .map((p: any) => {
            let service = p.tipo.join(", ");
            if (p.detalhes?.Residencial && p.tipo.includes("Residencial")) {
              const { velocidade, tipo } = p.detalhes.Residencial;
              service = `${velocidade} (${tipo})`;
            }
            return {
              ...p,
              name: p.nome,
              service,
              price: `R$ ${p.preco}/mês`,
            };
          });

        setCompanyPlans(newCompanyPlans);
        setClientPlans(newClientPlans);
      } catch (error) {
        console.error("Erro ao buscar pacotes:", error);
      }
    }
    fetchPacotes();
  }, []);

  // Define quais planos aparecem no carrossel
  let displayedPlans: any[] = [];
  if (!isLoggedIn) {
    // Não logado => toggle entre empresas/cliente
    displayedPlans = selectedType === "empresas" ? companyPlans : clientPlans;
  } else {
    // Logado => mostra só o tipo do usuário
    if (userType === "Empresa") {
      displayedPlans = companyPlans;
    } else if (userType === "Pessoa") {
      displayedPlans = clientPlans;
    }
  }

  // Lógica de carrossel
  const totalPages = Math.ceil(displayedPlans.length / itemsPerPage);
  const planPages = Array.from({ length: totalPages }, (_, i) =>
    displayedPlans.slice(i * itemsPerPage, i * itemsPerPage + itemsPerPage)
  );

  // Se trocar a aba (empresas/Pessoa), reseta página e pacote selecionado
  useEffect(() => {
    setCurrentPage(0);
    setSelectedPacote(null);
  }, [selectedType]);

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Auto-play a cada 10s
  useEffect(() => {
    if (totalPages > 1) {
      const interval = setInterval(() => {
        setCurrentPage((prev) => {
          if (prev >= totalPages - 1) return 0;
          return prev + 1;
        });
      }, 10_000);
      return () => clearInterval(interval);
    }
  }, [totalPages]);

  // ================= HANDLERS DO FLUXO DE COMPRA =================

  // Ao clicar em "Fechar pacote":
  // - Se não logado => toast
  // - Se logado => abrir diálogo de detalhes
  const handleViewDetails = (pacote: any) => {
    if (!isLoggedIn) {
      toast.error("Você precisa estar logado para fechar um plano!");
      return;
    }
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

      // Exemplo: Redireciona para home do dashboard
      // window.location.href = "/user/dashboard";
    } catch (error) {
      console.error("Erro ao finalizar a compra:", error);
      toast.error("Não foi possível finalizar a compra. Tente novamente.");
    }
  };

  // Formata chaves para exibir detalhes
  const formatKey = (key: string) => {
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Formata valores (ex.: "fibra optica" -> "Fibra Óptica")
  const formatValue = (value: any) => {
    if (typeof value === "string") {
      const formatted = value
        .toLowerCase()
        .replace("fibra optica", "Fibra Óptica")
        .replace("5g", "5G")
        .replace("4g", "4G");
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }
    return value;
  };

  // Se ainda não carregou a autenticação, mostra "Carregando"
  if (!isAuthChecked) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center h-screen">
          <p className="text-2xl font-bold">Carregando...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      {/* ====== BANNER AZUL ====== */}
      <div className="relative h-[80vh] bg-[#0090dc] flex items-center justify-center border-b-2 border-gray-300 shadow-xl">
        {/* Ícone grandão à esquerda */}
        <div className="absolute left-[25vh] top-[45vh] -translate-y-1/2 text-white z-0 pointer-events-none">
          <CellSignalFull className="text-[35rem]" />
        </div>

        <div className="absolute top-1/3 left-2/3 transform -translate-x-1/2 -translate-y-1/2 text-white text-left mt-[15vh] z-10">
          <h2 className="text-lg font-light text-3xl">Lançamento</h2>
          <h1 className="text-5xl font-bold tracking-wide">
            Chegou o novo{" "}
            <span className="font-extrabold text-6xl">Teleconnect 5G!</span>
          </h1>
          <p className="text-md mt-2 text-3xl">Não perca tempo e assine já.</p>
          <div className="mt-[15vh]">
            <Button
              className="bg-[#cb2166] text-white hover:bg-pink-600 px-12 py-6 text-2xl"
              onClick={scrollToPackages}
            >
              Ver pacotes
            </Button>
          </div>
        </div>
      </div>

      {/* ====== CONTEÚDO RESTANTE ====== */}
      <div className="text-2xl">
        {/* Seção dos Planos */}
        <div className="flex flex-col items-center justify-center h-auto bg-[#f5f5f5] py-10">
          {/* Toggle (só aparece se não estiver logado) */}
          {!isLoggedIn && (
            <div className="flex space-x-4 mb-4">
              <button
                className={`px-12 py-6 rounded-md ${
                  selectedType === "Pessoa"
                    ? "bg-blue-500 text-white font-bold"
                    : "bg-gray-200 text-gray-800"
                }`}
                style={{ fontSize: "1.5rem" }}
                onClick={() => setSelectedType("Pessoa")}
              >
                Pessoa
              </button>
              <button
                className={`px-12 py-6 rounded-md ${
                  selectedType === "empresas"
                    ? "bg-blue-500 text-white font-bold"
                    : "bg-gray-200 text-gray-800"
                }`}
                style={{ fontSize: "1.5rem" }}
                onClick={() => setSelectedType("empresas")}
              >
                Empresas
              </button>
            </div>
          )}

          <div ref={packagesRef} className="relative w-full px-4 overflow-hidden">
            {/* Setas de navegação */}
            {totalPages > 1 && currentPage > 0 && (
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                onClick={handlePrev}
              >
                <ArrowLeft
                  size={50}
                  className="text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                />
              </button>
            )}
            {totalPages > 1 && currentPage < totalPages - 1 && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
                onClick={handleNext}
              >
                <ArrowRight
                  size={50}
                  className="text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                />
              </button>
            )}

            {/* Carrossel propriamente dito */}
            {displayedPlans.length > 0 ? (
              <div className="overflow-hidden w-full relative py-6">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${currentPage * 100}%)`,
                  }}
                >
                  {planPages.map((pagePlans, pageIndex) => (
                    <div
                      key={pageIndex}
                      className="w-full flex-none grid grid-cols-4 justify-items-center gap-0"
                    >
                      {pagePlans.map((pacote: any, i: number) => (
                        <Card
                          key={i}
                          className="p-4 text-center shadow-md border border-gray-300 bg-white rounded-xl w-[30vh] h-[50vh] cursor-pointer flex flex-col justify-between"
                          onClick={() => handleViewDetails(pacote)}
                        >
                          <h3 className="text-xl font-semibold text-gray-800 mr-auto">
                            {pacote.name}
                          </h3>

                          <WifiHigh className="h-16 w-16 text-black " />

                          <p className="text-3xl font-extrabold text-gray-900 mr-auto">
                            {pacote.service}
                          </p>
                          <div className="flex flex-col items-center space-y-1 text-sm text-gray-500 mb-2 mr-auto">
                            <div className="flex items-center space-x-1 text-2xl">
                              ✅ <span>Assistência grátis</span>
                            </div>
                          </div>
                          <p className="text-2xl font-extrabold text-gray-900 mr-auto">
                            {pacote.cortesia}
                          </p>

                          <p className="text-4xl font-bold text-gray-900 mt-4 mr-auto">
                            {pacote.price}
                          </p>
                          <Button className="mt-4 text-2xl w-full bg-pink-600 text-white font-bold py-6 rounded hover:bg-pink-700">
                            Fechar pacote
                          </Button>
                        </Card>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-700 mt-10 text-2xl">
                Nenhum pacote disponível.
              </p>
            )}
          </div>
        </div>

        {/* Seção de Novidades */}
        <div className="bg-white py-20 border-t border-gray-300">
          <h2
            className="text-center mb-12 font-semibold"
            style={{ fontSize: "2rem" }}
          >
            Fique por dentro das novidades:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
            {/* 1) ANATEL */}
            <div className="text-center">
              <Globe className="mx-auto h-16 w-16 text-blue-500" />
              <p className="mt-4">
                Saiba mais sobre o mercado de telecomunicações no site da ANATEL
              </p>
              <Button
                className="mt-4 bg-[#cb2166] text-white px-12 py-6 text-xl w-64"
                onClick={() =>
                  window.open("https://www.gov.br/anatel/pt-br", "_blank")
                }
              >
                Acessar site
              </Button>
            </div>

            <div className="text-center">
              <Phone className="mx-auto h-16 w-16 text-pink-500" />
              <p className="mt-4">
                Agora você pode aproveitar o novo 5G da Teleconnect, garanta já!
              </p>
              <Button className="mt-4 bg-[#cb2166] text-white px-12 py-6 text-xl w-64">
                Fechar agora
              </Button>
            </div>

            <div className="text-center">
              <EnvelopeOpen className="mx-auto h-16 w-16 text-blue-500" />
              <p className="mt-4">
                Faça o registro para receber os novos descontos da Teleconnect
              </p>
              <Button
                className="mt-4 bg-[#cb2166] text-white px-12 py-6 text-xl w-64"
                onClick={() => {
                  window.location.href = "/auth/register";
                }}
              >
                Cadastre-se
              </Button>
            </div>
          </div>
        </div>

        {/* Seção de Feedbacks */}
        <div className="py-20 border-t border-gray-300 bg-[#f5f5f5]">
          <h2 className="text-center mb-6 font-semibold text-4xl">Feedbacks</h2>
          <div className="flex items-center justify-between gap-6 max-w-6xl mx-auto px-4">
            {/* Botão para navegar à esquerda (exemplo visual) */}
            <ArrowLeft className="h-32 w-32 text-gray-500 cursor-pointer" />

            {/* Cartões de feedback */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Carlos Almeida",
                  feedback:
                    "Troquei minha telefonia móvel para a Teleconnect e foi a melhor decisão que tomei. O sinal é excelente, até em áreas mais remotas, e o atendimento ao cliente sempre resolve tudo rapidamente.",
                },
                {
                  name: "Ana Souza",
                  feedback:
                    "A banda larga da Teleconnect é incrível! A internet é super rápida e nunca cai, mesmo nos horários de pico. É ótimo poder assistir a filmes e trabalhar sem interrupções.",
                },
                {
                  name: "João Mendes",
                  feedback:
                    "A banda larga da Teleconnect funciona perfeitamente para toda a minha família. Mesmo com vários aparelhos conectados, não tem travamento. É ótimo para streaming, games e trabalho remoto.",
                },
              ].map((item, index) => (
                <Card
                  key={index}
                  className="p-6 shadow-lg border rounded-2xl bg-white flex flex-col justify-between min-h-[320px]"
                >
                  <div className="flex-1">
                    <Quotes className="text-gray-600 h-8 w-8" />
                    <p className="mt-4 text-gray-800 text-xl leading-relaxed">
                      {item.feedback}
                    </p>
                  </div>
                  <div className="mt-4 text-right">
                    <span className="text-gray-900 font-bold text-lg">
                      {item.name}
                    </span>
                  </div>
                </Card>
              ))}
            </div>

            {/* Botão para navegar à direita (exemplo visual) */}
            <ArrowRight className="h-32 w-32 text-gray-500 cursor-pointer" />
          </div>
        </div>
      </div>

      <Footer />

      {/* =============== DIALOG 1: DETALHES DO PACOTE =============== */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl p-8 bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-5xl font-bold text-center">
              Detalhes do Pacote
            </DialogTitle>
          </DialogHeader>
          {selectedPacote && (
            <div className="space-y-6 mt-6 text-3xl">
              <p>
                <strong>Pacote:</strong> {selectedPacote.nome}
              </p>
              <p>
                <strong>Tipos:</strong> {selectedPacote.tipo?.join(", ")}
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
                  <strong className="text-3xl">Mais informações:</strong>
                  <div className="mt-4 space-y-4">
                    {Object.entries(selectedPacote.detalhes).map(
                      ([key, value]: any, idx) => (
                        <div key={idx}>
                          <strong className="font-semibold text-3xl">
                            {formatKey(key)}:
                          </strong>
                          {typeof value === "object" && value !== null ? (
                            <ul className="list-disc list-inside ml-4 space-y-2">
                              {Object.entries(value).map(([subKey, subVal]) => (
                                <li key={subKey} className="text-3xl">
                                  <strong className="font-semibold">
                                    {formatKey(subKey)}:{" "}
                                  </strong>
                                  {formatValue(subVal)}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-3xl">
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
                <p className="text-3xl">Sem detalhes adicionais.</p>
              )}

              <Button
                className="bg-blue-600 text-white w-full mt-6 text-4xl py-6"
                onClick={handleContinue}
              >
                Continuar para pagamento
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* =============== DIALOG 2: ENDEREÇO =============== */}
      <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
        <DialogContent className="max-w-2xl p-8 bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-5xl font-bold text-center">
              Endereço de Pagamento
            </DialogTitle>
          </DialogHeader>
          <div className="mt-6 space-y-6 text-3xl">
            <div className="space-y-4">
              <Label className="text-3xl">CEP</Label>
              <Input
                placeholder="CEP"
                value={address.cep}
                onChange={(e) => setAddress({ ...address, cep: e.target.value })}
                className="p-8"
                style={{ fontSize: "1.5rem" }}
              />
            </div>
            <div className="space-y-4">
              <Label className="text-3xl">Rua</Label>
              <Input
                placeholder="Rua"
                value={address.rua}
                onChange={(e) => setAddress({ ...address, rua: e.target.value })}
                className="p-8"
                style={{ fontSize: "1.5rem" }}
              />
            </div>
            <div className="space-y-4">
              <Label className="text-3xl">Número</Label>
              <Input
                placeholder="Número"
                value={address.numero}
                onChange={(e) =>
                  setAddress({ ...address, numero: e.target.value })
                }
                className="p-8"
                style={{ fontSize: "1.5rem" }}
              />
            </div>
            <div className="space-y-4">
              <Label className="text-3xl">Complemento</Label>
              <Input
                placeholder="Complemento"
                value={address.complemento}
                onChange={(e) =>
                  setAddress({ ...address, complemento: e.target.value })
                }
                className="p-8"
                style={{ fontSize: "1.5rem" }}
              />
            </div>
            {addressError && (
              <div className="flex items-center gap-2 text-red-600 text-3xl">
                <AlertCircle className="w-8 h-8" />
                <p>{addressError}</p>
              </div>
            )}
            <Button
              className="bg-blue-600 text-white w-full text-4xl py-6"
              onClick={handleAddressSubmit}
              disabled={!address.cep || !address.rua || !address.numero}
            >
              Continuar para Pagamento
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* =============== DIALOG 3: PAGAMENTO =============== */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-2xl p-8 bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-5xl font-bold text-center">
              Pagamento
            </DialogTitle>
          </DialogHeader>
          <div className="mt-6 space-y-6 text-3xl">
            <Select
              value={paymentMethod}
              onValueChange={(value: "Cartão" | "PIX") => setPaymentMethod(value)}
            >
              <SelectTrigger className="w-full text-3xl p-4 mb-[5vh] bg-white border border-gray-300 rounded-lg">
                <SelectValue placeholder="Selecione a forma de pagamento" />
              </SelectTrigger>
              <SelectContent className="w-full bg-white border border-gray-300 rounded-lg">
                <SelectItem value="Cartão" className="text-3xl">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-8 h-8" />
                    Cartão de Crédito
                  </div>
                </SelectItem>
                <SelectItem value="PIX" className="text-3xl">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-8 h-8" />
                    PIX
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {paymentMethod === "Cartão" && (
              <div className="space-y-4">
                <div className="space-y-4">
                  <Label className="text-3xl">Número do Cartão</Label>
                  <Input
                    placeholder="Número do Cartão"
                    value={cardDetails.numero}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, numero: e.target.value })
                    }
                    className="p-8"
                    style={{ fontSize: "1.5rem" }}
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-3xl">Nome no Cartão</Label>
                  <Input
                    placeholder="Nome no Cartão"
                    value={cardDetails.nome}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, nome: e.target.value })
                    }
                    className="p-8"
                    style={{ fontSize: "1.5rem" }}
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-3xl">Validade (MM/AA)</Label>
                  <Input
                    placeholder="Validade"
                    value={cardDetails.validade}
                    onChange={(e) =>
                      setCardDetails({
                        ...cardDetails,
                        validade: e.target.value,
                      })
                    }
                    className="p-8"
                    style={{ fontSize: "1.5rem" }}
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-3xl">CVV</Label>
                  <Input
                    placeholder="CVV"
                    value={cardDetails.cvv}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, cvv: e.target.value })
                    }
                    className="p-8"
                    style={{ fontSize: "1.5rem" }}
                  />
                </div>
                {cardError && (
                  <div className="flex items-center gap-2 text-red-600 text-3xl">
                    <AlertCircle className="w-8 h-8" />
                    <p>{cardError}</p>
                  </div>
                )}
              </div>
            )}

            {paymentMethod === "PIX" && (
              <div className="text-center">
                <p className="mb-4 text-4xl">
                  Escaneie o QRCode abaixo para efetuar o pagamento.
                </p>
                <img
                  src="/images/qrcode-pix.png"
                  alt="QRCode de pagamento"
                  className="mx-auto mb-6 h-72 w-72"
                />
              </div>
            )}

            <Button
              className="bg-green-600 text-white w-full text-4xl py-6"
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
    </>
  );
};
