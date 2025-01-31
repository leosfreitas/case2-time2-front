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

// Diálogo e inputs (fluxo de compra)
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

  // Armazena todos os pacotes
  const [allPacotes, setAllPacotes] = useState<any[]>([]);

  // Planos filtrados
  const [companyPlans, setCompanyPlans] = useState<any[]>([]);
  const [clientPlans, setClientPlans] = useState<any[]>([]);

  // Toggle (só para usuários não logados)
  const [selectedType, setSelectedType] = useState<"empresas" | "Pessoa">("Pessoa");

  // Para sabermos se é mobile ou não (<= 768px)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    window.addEventListener("resize", handleResize);
    handleResize(); // chama 1x ao montar
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Referência para scroll
  const packagesRef = useRef<HTMLDivElement>(null);
  const scrollToPackages = () => {
    if (packagesRef.current) {
      packagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // ========================= CARROSSEL DE PACOTES =========================
  // Em desktop, queremos 4 pacotes por vez; em mobile, 1.
  const [itemsPerPage, setItemsPerPage] = useState(4);
  useEffect(() => {
    setItemsPerPage(isMobile ? 1 : 4);
  }, [isMobile]);

  const [currentPage, setCurrentPage] = useState(0);

  // Dialogs do fluxo de compra
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  // Pacote selecionado para comprar
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

  // ========================= FEEDBACKS =========================
  const feedbacks = [
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
  ];

  // Índice do feedback atual (mobile)
  const [feedbackIndex, setFeedbackIndex] = useState(0);
  const handlePrevFeedback = () => {
    setFeedbackIndex((prev) => (prev === 0 ? feedbacks.length - 1 : prev - 1));
  };
  const handleNextFeedback = () => {
    setFeedbackIndex((prev) => (prev === feedbacks.length - 1 ? 0 : prev + 1));
  };

  // ========================= VERIFICAÇÃO USER =========================
  // 1) Verifica se usuário está logado
  useEffect(() => {
    async function verifyUser() {
      try {
        await checkUserToken(); // se der erro, cai no catch
        setIsLoggedIn(true);

        // Se logado, pega tipo (Pessoa/Empresa)
        const response = await getUserData();
        const tipo = response?.data?.tipo;
        if (tipo === "Pessoa" || tipo === "Empresa") {
          setUserType(tipo);
        } else {
          setIsLoggedIn(false);
          setUserType(undefined);
        }
      } catch {
        setIsLoggedIn(false);
        setUserType(undefined);
      } finally {
        setIsAuthChecked(true);
      }
    }
    verifyUser();
  }, []);

  // 2) Busca pacotes do backend
  useEffect(() => {
    async function fetchPacotes() {
      try {
        const pacotes = await getAllPacotes();
        setAllPacotes(pacotes);

        // Empresa
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

        // Pessoa
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

  // Mostra só os planos do tipo correspondente
  let displayedPlans: any[] = [];
  if (!isLoggedIn) {
    displayedPlans = selectedType === "empresas" ? companyPlans : clientPlans;
  } else {
    if (userType === "Empresa") {
      displayedPlans = companyPlans;
    } else if (userType === "Pessoa") {
      displayedPlans = clientPlans;
    }
  }

  // Paginação do carrossel de pacotes
  const totalPages = Math.ceil(displayedPlans.length / itemsPerPage);
  const planPages = Array.from({ length: totalPages }, (_, i) =>
    displayedPlans.slice(i * itemsPerPage, i * itemsPerPage + itemsPerPage)
  );

  // Se trocar a aba (empresas/Pessoa), reseta carrossel
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

  // Auto-play a cada 10s (somente se tiver mais de 1 página e não for mobile)
  useEffect(() => {
    if (!isMobile && totalPages > 1) {
      const interval = setInterval(() => {
        setCurrentPage((prev) => (prev >= totalPages - 1 ? 0 : prev + 1));
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [totalPages, isMobile]);

  // ================== Fluxo de compra ==================
  const handleViewDetails = (pacote: any) => {
    if (!isLoggedIn) {
      toast.error("Você precisa estar logado para fechar um plano!");
      return;
    }
    setSelectedPacote(pacote);
    setIsDetailsDialogOpen(true);
  };

  const handleContinue = () => {
    setIsDetailsDialogOpen(false);
    setIsAddressDialogOpen(true);
  };

  const handleAddressSubmit = () => {
    if (!address.cep || !address.rua || !address.numero) {
      setAddressError("Preencha todos os campos obrigatórios.");
      return;
    }
    setAddressError("");
    setIsAddressDialogOpen(false);
    setIsPaymentDialogOpen(true);
  };

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

  // Helpers
  const formatKey = (key: string) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const formatValue = (value: any) => {
    if (typeof value === "string") {
      const f = value
        .toLowerCase()
        .replace("fibra optica", "Fibra Óptica")
        .replace("5g", "5G")
        .replace("4g", "4G");
      return f.charAt(0).toUpperCase() + f.slice(1);
    }
    return value;
  };

  // Se ainda não carregou info de login
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

      {/* Banner - apenas em telas >= md */}
      <div className="hidden md:block relative h-[80vh] bg-[#0090dc] flex items-center justify-center border-b-2 border-gray-300 shadow-xl">
        {/* Ícone grandão à esquerda */}
        <div className="absolute left-[25vh] top-[45vh] -translate-y-1/2 text-white z-0 pointer-events-none">
          <CellSignalFull className="text-[35rem]" />
        </div>

        {/* Texto */}
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

      {/* SEÇÃO DOS PACOTES (em mobile, já aparece sem banner) */}
      <div className="text-2xl">
        <div className="flex flex-col items-center justify-center bg-[#f5f5f5] py-10 min-h-[80vh]">
          {/* TÍTULO "Pacotes" APENAS EM TELAS PEQUENAS E DESLOGADO */}
          {isMobile && (
            <h2 className="text-6xl font-bold text-center mb-4 mt-[10vh]">
              Pacotes
            </h2>
          )}
          {!isMobile && (
            <h2 className="text-6xl font-bold text-center mb-4">Pacotes</h2>
          )}

          {!isLoggedIn && (
            <div
              className="flex space-x-4 mb-4 sm:mt-16"
              style={{ marginTop: isMobile ? "5vh" : 0 }}
            >
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

          <div ref={packagesRef} className="w-full px-4">
            {/* Se não tiver pacotes */}
            {displayedPlans.length === 0 ? (
              <p className="text-gray-700 mt-10 text-2xl text-center">
                Nenhum pacote disponível.
              </p>
            ) : !isMobile ? (
              /* =========== DESKTOP =========== */
              <div className="relative overflow-hidden py-6">
                {/* Setas sempre visíveis */}
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                  onClick={handlePrev}
                >
                  <ArrowLeft className="text-gray-600 hover:text-gray-800 transition-colors cursor-pointer w-6 h-6 md:w-10 md:h-10" />
                </button>

                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
                  onClick={handleNext}
                >
                  <ArrowRight className="text-gray-600 hover:text-gray-800 transition-colors cursor-pointer w-6 h-6 md:w-10 md:h-10" />
                </button>

                {/* Carrossel */}
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
                          className="p-4 text-center shadow-md border border-gray-300 bg-white rounded-xl w-[30vh] h-[50vh] cursor-pointer flex flex-col justify-between m-4"
                          onClick={() => handleViewDetails(pacote)}
                        >
                          <h3 className="text-xl font-semibold text-gray-800 mr-auto">
                            {pacote.name}
                          </h3>

                          <WifiHigh className="text-black h-24 w-24 md:h-16 md:w-16" />

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
              /* =========== MOBILE =========== */
              <div className="flex items-center justify-center w-full relative py-6">
                <ArrowLeft
                  onClick={handlePrev}
                  className="text-gray-600 hover:text-gray-800 transition-colors cursor-pointer w-6 h-6 md:w-10 md:h-10 mr-4"
                />

                {/* Mostra 1 item por vez */}
                {planPages[currentPage]?.map((pacote: any, i: number) => (
                  <Card
                    key={i}
                    className="p-4 text-center shadow-md border border-gray-300 bg-white rounded-xl w-[30vh] h-[50vh] cursor-pointer flex flex-col justify-between"
                    onClick={() => handleViewDetails(pacote)}
                  >
                    <h3 className="text-xl font-semibold text-gray-800 mr-auto">
                      {pacote.name}
                    </h3>

                    <WifiHigh className="text-black h-24 w-24 md:h-16 md:w-16" />

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

                <ArrowRight
                  onClick={handleNext}
                  className="text-gray-600 hover:text-gray-800 transition-colors cursor-pointer w-6 h-6 md:w-10 md:h-10 ml-4"
                />
              </div>
            )}
          </div>
        </div>

        {/* Seção de novidades */}
        <div className="bg-white py-20 border-t border-gray-300">
          <h2
            className="text-center mb-12 font-semibold"
            style={{ fontSize: "2rem" }}
          >
            Fique por dentro das novidades:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
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

          {!isMobile ? (
            /* DESKTOP: 3 feedbacks lado a lado */
            <div className="flex items-center justify-between gap-6 max-w-6xl mx-auto px-4">
              <ArrowLeft className="h-8 w-8 text-gray-500 cursor-pointer" />
              <div className="grid grid-cols-3 gap-8 flex-1">
                {feedbacks.map((item, index) => (
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
              <ArrowRight className="h-8 w-8 text-gray-500 cursor-pointer" />
            </div>
          ) : (
            /* MOBILE: 1 feedback por vez com setas */
            <div className="max-w-xl mx-auto px-4 flex items-center justify-center">
              <ArrowLeft
                className="h-8 w-8 text-gray-500 cursor-pointer mr-4"
                onClick={handlePrevFeedback}
              />
              <Card className="p-6 shadow-lg border rounded-2xl bg-white flex flex-col justify-between min-h-[320px] flex-1">
                <div className="flex-1">
                  <Quotes className="text-gray-600 h-8 w-8" />
                  <p className="mt-4 text-gray-800 text-xl leading-relaxed">
                    {feedbacks[feedbackIndex].feedback}
                  </p>
                </div>
                <div className="mt-4 text-right">
                  <span className="text-gray-900 font-bold text-lg">
                    {feedbacks[feedbackIndex].name}
                  </span>
                </div>
              </Card>
              <ArrowRight
                className="h-8 w-8 text-gray-500 cursor-pointer ml-4"
                onClick={handleNextFeedback}
              />
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* =============== DIALOG 1: DETALHES DO PACOTE =============== */}
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
                <p className="text-base sm:text-lg md:text-xl">
                  Sem detalhes adicionais.
                </p>
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

      {/* =============== DIALOG 2: ENDEREÇO =============== */}
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
                onChange={(e) => setAddress({ ...address, rua: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-base sm:text-lg md:text-xl">Número</Label>
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
            >
              Continuar para Pagamento
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* =============== DIALOG 3: PAGAMENTO =============== */}
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
    </>
  );
};
