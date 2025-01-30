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
} from "@phosphor-icons/react";
import { Header } from "../../components/header";
import { useState, useEffect } from "react";
import { Footer } from "../../components/footer";
import { getAllPacotes } from "./api/getPacotes"; // Ajuste o path se necessário
import { CellSignalFull } from "@phosphor-icons/react";

// Importa apenas o check de user e a função para obter userData
import { checkUserToken } from "../../components/api/token";
import { getUserData } from "@/pages/user/dashboard/nested/profile/api/profile";

type UserType = "Pessoa" | "Empresa" | undefined;

export const Home = () => {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<UserType>(undefined);

  // Pacotes para Empresa e Pessoa (carregados da API)
  const [companyPlans, setCompanyPlans] = useState<any[]>([]);
  const [clientPlans, setClientPlans] = useState<any[]>([]);

  // Se o usuário não estiver logado, deixamos ele escolher “empresas” ou “clientes”
  const [selectedType, setSelectedType] = useState<"empresas" | "clientes">("empresas");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Carrossel
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  // ----------------------------------------------------------------
  // 1) Verifica se é um usuário logado (Pessoa ou Empresa)
  // ----------------------------------------------------------------
  useEffect(() => {
    async function verifyUser() {
      try {
        // Se o usuário estiver logado, checkUserToken retorna sucesso
        await checkUserToken();
        setIsLoggedIn(true);

        // Agora buscamos o tipo (Pessoa ou Empresa)
        const response = await getUserData();
        // Se o JSON tem { data: { tipo: "Pessoa" } }, acessamos response.data.tipo
        const tipo = response?.data?.tipo;

        if (tipo === "Pessoa" || tipo === "Empresa") {
          setUserType(tipo);
        } else {
          // Se vier algo inesperado, considera não logado
          setIsLoggedIn(false);
          setUserType(undefined);
        }
      } catch (errorUser) {
        // Se cair aqui, não está logado
        setIsLoggedIn(false);
        setUserType(undefined);
      } finally {
        setIsAuthChecked(true);
      }
    }

    verifyUser();
  }, []);

  // ----------------------------------------------------------------
  // 2) Busca todos os pacotes (Empresa e Pessoa) da API
  // ----------------------------------------------------------------
  useEffect(() => {
    async function fetchPacotes() {
      try {
        const pacotes = await getAllPacotes();

        // Filtra Empresa
        const newCompanyPlans = pacotes
          .filter((p: any) => p.cliente === "Empresa")
          .map((p: any) => {
            let service = p.tipo.join(", ");
            if (p.detalhes?.Residencial && p.tipo.includes("Residencial")) {
              const { velocidade, tipo } = p.detalhes.Residencial;
              service = `${velocidade} (${tipo})`;
            }
            return {
              name: p.nome,
              service,
              price: `R$ ${p.preco}/mês`,
            };
          });

        // Filtra Pessoa
        const newClientPlans = pacotes
          .filter((p: any) => p.cliente === "Pessoa")
          .map((p: any) => {
            let service = p.tipo.join(", ");
            if (p.detalhes?.Residencial && p.tipo.includes("Residencial")) {
              const { velocidade, tipo } = p.detalhes.Residencial;
              service = `${velocidade} (${tipo})`;
            }
            return {
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

  // ----------------------------------------------------------------
  // 3) Define quais planos serão exibidos
  // ----------------------------------------------------------------
  let displayedPlans: any[] = [];

  if (!isLoggedIn) {
    // Usuário não logado => deixa ele escolher “empresas” ou “clientes”
    displayedPlans = selectedType === "empresas" ? companyPlans : clientPlans;
  } else {
    // Usuário logado (Pessoa ou Empresa)
    if (userType === "Empresa") {
      displayedPlans = companyPlans;
    } else if (userType === "Pessoa") {
      displayedPlans = clientPlans;
    }
  }

  // Lógica do carrossel
  const totalPages = Math.ceil(displayedPlans.length / itemsPerPage);
  const planPages = Array.from({ length: totalPages }, (_, i) =>
    displayedPlans.slice(i * itemsPerPage, i * itemsPerPage + itemsPerPage)
  );

  // Quando trocar de "empresas" para "clientes" no toggle (usuário não logado)
  useEffect(() => {
    setCurrentPage(0);
    setSelectedPlan(null);
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

  // Enquanto não terminamos de checar a autenticação, mostramos um "loading..."
  if (!isAuthChecked) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center h-screen">
          <p>Carregando...</p>
        </div>
      </>
    );
  }

  // ----------------------------------------------------------------
  // 4) Renderização
  // ----------------------------------------------------------------
  return (
    <>
      <Header />

      {/* Banner de Lançamento */}
      <div className="relative h-[80vh] bg-[#0090dc] flex items-center justify-center border-b-2 border-gray-300 shadow-xl">
        <div className="absolute top-1/3 left-2/3 transform -translate-x-1/2 -translate-y-1/2 text-white text-left mt-[15vh]">
          <h2 className="text-lg font-light text-3xl">Lançamento</h2>
          <h1 className="text-5xl font-bold tracking-wide">
            Chegou o novo <span className="font-extrabold text-6xl">Teleconnect 5G!</span>
          </h1>
          <p className="text-md mt-2 text-3xl">Não perca tempo e assine já.</p>
          <div className="mt-[15vh]">
            <Button className="bg-[#cb2166] text-white hover:bg-pink-600 px-12 py-6 text-2xl">
              Ver pacotes
            </Button>
          </div>
        </div>
      </div>

      {/* Seção dos Planos */}
      <div className="flex flex-col items-center justify-center h-auto bg-[#f5f5f5] py-10">

        {/* Só mostra o toggle se o usuário NÃO estiver logado */}
        {!isLoggedIn && (
          <div className="flex space-x-4 mb-4">
            <button
              className={`px-12 py-6 rounded-md ${
                selectedType === "empresas"
                  ? "bg-blue-500 text-white text-2xl font-bold"
                  : "bg-gray-200 text-gray-800 text-2xl"
              }`}
              onClick={() => setSelectedType("empresas")}
            >
              Empresas
            </button>
            <button
              className={`px-12 py-6 rounded-md ${
                selectedType === "clientes"
                  ? "bg-blue-500 text-white text-2xl font-bold"
                  : "bg-gray-200 text-gray-800 text-2xl"
              }`}
              onClick={() => setSelectedType("clientes")}
            >
              Clientes
            </button>
          </div>
        )}

        {selectedPlan && (
          <p className="text-sm text-gray-700 mb-4">Plano selecionado: {selectedPlan}</p>
        )}

        {/* Carrossel de planos */}
        {displayedPlans.length > 0 ? (
          <div className="relative w-full px-4 overflow-hidden">
            {/* Setas de navegação */}
            {totalPages > 1 && currentPage > 0 && (
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                onClick={handlePrev}
              >
                <ArrowLeft
                  size={40}
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
                  size={40}
                  className="text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                />
              </button>
            )}

            {/* Container do conteúdo do carrossel */}
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
                    className="w-full flex-none grid grid-cols-4 gap-6 justify-items-center"
                  >
                    {pagePlans.map((plan, i) => (
                      <Card
                        key={i}
                        className="p-6 text-center shadow-xl border border-gray-300 bg-white rounded-2xl cursor-pointer w-72"
                        onClick={() => setSelectedPlan(plan.name)}
                      >
                        <WifiHigh className="mx-auto mb-4 h-[25vh] w-10 text-gray-700" />
                        <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                        <p className="text-xl font-bold text-gray-800">{plan.service}</p>
                        <p className="text-gray-600 text-sm">✅ Serviço premium</p>
                        <p className="text-lg font-semibold text-gray-900 mt-4">
                          {plan.price}
                        </p>
                        <Button className="mt-4 w-full bg-[#cb2166] text-white hover:bg-pink-600">
                          Selecionar plano
                        </Button>
                      </Card>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 text-xl mt-10">Nenhum pacote disponível.</p>
        )}
      </div>

      {/* Seção de Novidades */}
      <div className="bg-white py-20 border-t border-gray-300">
        <h2 className="text-center text-2xl font-semibold mb-6">
          Fique por dentro das novidades:
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          <div className="text-center">
            <Globe className="mx-auto h-16 w-16 text-blue-500" />
            <p className="mt-4">
              Saiba mais sobre o mercado de telecomunicações no site da ANATEL
            </p>
            <a
              href="https://www.gov.br/anatel/pt-br"
              className="text-blue-500 underline"
            >
              https://www.gov.br/anatel/pt-br
            </a>
          </div>
          <div className="text-center">
            <Phone className="mx-auto h-16 w-16 text-pink-500" />
            <p className="mt-4">
              Agora você pode aproveitar o novo 5G da Teleconnect, garanta já!
            </p>
            <Button className="mt-4 bg-[#cb2166] text-white">Fechar agora</Button>
          </div>
          <div className="text-center">
            <EnvelopeOpen className="mx-auto h-16 w-16 text-blue-500" />
            <p className="mt-4">
              Faça o registro para receber os novos descontos da Teleconnect
            </p>
            <Button className="mt-4 bg-[#cb2166] text-white">Cadastre-se</Button>
          </div>
        </div>
      </div>

      {/* Seção de Feedbacks */}
      <div className="py-20 border-t border-gray-300 bg-[#f5f5f5]">
        <h2 className="text-center text-2xl font-semibold mb-6">Feedbacks</h2>
        <div className="flex items-center justify-center gap-6 max-w-6xl mx-auto px-4">
          <ArrowLeft className="h-6 w-6 text-gray-500 cursor-pointer" />
          {[
            {
              name: "Carlos Almeida",
              feedback:
                "Troquei minha telefonia móvel para a Teleconnect e foi a melhor decisão que tomei. O sinal é excelente, até em áreas mais remotas, e o atendimento ao cliente sempre resolve tudo rapidamente.",
              image: "/path-to-image1.jpg",
            },
            {
              name: "Ana Souza",
              feedback:
                "A banda larga da Teleconnect é incrível! A internet é super rápida e nunca cai, mesmo nos horários de pico. É ótimo poder assistir a filmes e trabalhar sem interrupções.",
              image: "/path-to-image2.jpg",
            },
            {
              name: "João Mendes",
              feedback:
                "A banda larga da Teleconnect funciona perfeitamente para toda a minha família. Mesmo com vários aparelhos conectados, não tem travamento. É ótimo para streaming, games e trabalho remoto.",
              image: "/path-to-image3.jpg",
            },
          ].map((item, index) => (
            <Card
              key={index}
              className="p-6 shadow-lg border rounded-2xl bg-white w-80"
            >
              <Quotes className="text-gray-600 h-6 w-6" />
              <p className="mt-4 text-gray-800">{item.feedback}</p>
              <div className="flex items-center mt-4">
                <span className="text-gray-900 font-semibold">{item.name}</span>
              </div>
            </Card>
          ))}
          <ArrowRight className="h-6 w-6 text-gray-500 cursor-pointer" />
        </div>
      </div>

      <Footer />
    </>
  );
};
