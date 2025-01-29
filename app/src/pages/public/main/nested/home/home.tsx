// Home.tsx

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

export const Home = () => {
  // Arrays que começam vazios
  const [companyPlans, setCompanyPlans] = useState<any[]>([]);
  const [clientPlans, setClientPlans] = useState<any[]>([]);

  // Feedbacks estáticos
  const feedbacks = [
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
  ];

  // Chama a API ao montar para buscar os pacotes
  useEffect(() => {
    async function fetchPacotes() {
      try {
        const pacotes = await getAllPacotes();
        // Dividir pacotes em Empresa e Pessoa
        const newCompanyPlans = pacotes
          .filter((p: any) => p.cliente === "Empresa")
          .map((p: any) => {
            let service = p.tipo.join(", ");
            if (p.detalhes && p.detalhes.Residencial && p.tipo.includes("Residencial")) {
              const { velocidade, tipo } = p.detalhes.Residencial;
              service = `${velocidade} (${tipo})`;
            }
            return {
              name: p.nome,
              service,
              price: `R$ ${p.preco}/mês`,
            };
          });

        const newClientPlans = pacotes
          .filter((p: any) => p.cliente === "Pessoa")
          .map((p: any) => {
            let service = p.tipo.join(", ");
            if (p.detalhes && p.detalhes.Residencial && p.tipo.includes("Residencial")) {
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

  // Controla se o usuário quer ver "empresas" ou "clientes"
  const [selectedType, setSelectedType] = useState<"empresas" | "clientes">("empresas");

  // Plano selecionado (só pra exibir o nome)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Monta a lista de planos a ser exibida
  const plans = selectedType === "empresas" ? companyPlans : clientPlans;

  // Cada página terá até 4 itens
  const itemsPerPage = 4;
  const totalPages = Math.ceil(plans.length / itemsPerPage);

  // Divide os planos em páginas
  const planPages = Array.from({ length: totalPages }, (_, i) =>
    plans.slice(i * itemsPerPage, i * itemsPerPage + itemsPerPage)
  );

  // Página atual (0-based)
  const [currentPage, setCurrentPage] = useState(0);

  // Sempre que trocar de tipo (empresas/cliente), zeramos a página atual
  useEffect(() => {
    setCurrentPage(0);
    setSelectedPlan(null);
  }, [selectedType]);

  // Ir para a página anterior
  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Ir para a página seguinte
  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Auto-play a cada 10 segundos
  // Se chegar na última página, volta para a página 0
  useEffect(() => {
    if (totalPages > 1) {
      const interval = setInterval(() => {
        setCurrentPage((prev) => {
          if (prev >= totalPages - 1) {
            return 0;
          }
          return prev + 1;
        });
      }, 10_000);

      return () => clearInterval(interval);
    }
  }, [totalPages]);

  return (
    <>
      <Header />

      {/* Banner de Lançamento */}
      <div className="relative h-[80vh] bg-[#0090dc] flex items-center justify-center border-b-2 border-gray-300 shadow-xl">
        <div className="absolute top-1/3 left-2/3 transform -translate-x-1/2 -translate-y-1/2 text-white text-left mt-20">
          <h2 className="text-lg font-light text-3xl">Lançamento</h2>
          <h1 className="text-5xl font-bold tracking-wide">
            Chegou o novo{" "}
            <span className="font-extrabold text-6xl">Teleconnect 5G!</span>
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
        {/* Botões de Toggle (Empresas | Clientes) */}
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

        {selectedPlan && (
          <p className="text-sm text-gray-700 mb-4">Plano selecionado: {selectedPlan}</p>
        )}

        {/* Container do Carousel */}
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

          {/* Janela visível (overflow-hidden) */}
          <div className="overflow-hidden w-full relative py-6">
            {/* Faixa que se desloca para a esquerda conforme a página atual */}
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentPage * 100}%)`,
              }}
            >
              {/* Renderiza cada “página” (até 4 itens) */}
              {planPages.map((pagePlans, pageIndex) => (
                <div
                  key={pageIndex}
                  // Cada página ocupa 100% da largura do carrossel
                  className="w-full flex-none grid grid-cols-4 gap-6 justify-items-center"
                >
                  {pagePlans.map((plan, i) => (
                    <Card
                      key={i}
                      className="p-6 text-center shadow-xl border border-gray-300 bg-white rounded-2xl cursor-pointer w-72"
                      onClick={() => setSelectedPlan(plan.name)}
                    >
                      <WifiHigh className="mx-auto mb-4 h-[25vh] w-10 text-gray-700" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {plan.name}
                      </h3>
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
          {feedbacks.map((item, index) => (
            <Card
              key={index}
              className="p-6 shadow-lg border rounded-2xl bg-white w-80"
            >
              <Quotes className="text-gray-600 h-6 w-6" />
              <p className="mt-4 text-gray-800">{item.feedback}</p>
              <div className="flex items-center mt-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-10 w-10 rounded-full mr-2"
                />
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
