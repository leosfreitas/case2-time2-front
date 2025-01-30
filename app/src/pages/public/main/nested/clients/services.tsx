import React, { useRef } from 'react';
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { CaretDoubleDown, WifiHigh, Phone, Globe, Cloud } from "@phosphor-icons/react";

export const Services = () => {
    const scrollToSection = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        scrollToSection.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <>
            <Header />
            {/* Banner com imagem de fundo e botão para rolar */}
            <div
                className="relative h-[100vh] flex flex-col justify-between items-center text-center text-white"
                style={{
                    backgroundImage: "url('/images/service-pic.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {/* Fundo preto com opacidade */}
                <div className="absolute inset-0 bg-black bg-opacity-60"></div>

                {/* Conteúdo do banner */}
                <div className="relative z-10 flex flex-col items-center justify-center flex-grow px-4">
                    <h1 className="text-8xl font-bold leading-tight mb-4">
                        A tecnologia dos nossos serviços conectam pessoas
                    </h1>
                    <p className="text-4xl text-gray-200">Conheça mais os serviços que oferecemos</p>
                </div>
                <div className="relative z-10 mb-10">
                    <CaretDoubleDown
                        size={80}
                        color="white"
                        className="cursor-pointer"
                        onClick={handleScroll}
                    />
                </div>
            </div>

            {/* Seção de serviços */}
            <section ref={scrollToSection} className="py-20 bg-gray-100">
                <div className="max-w-7xl mx-auto px-8">
                    <h2 className="text-6xl font-bold text-center mb-12 text-[#0D2C40]">
                        Nossos Serviços
                    </h2>
                    <p className="text-2xl text-center mb-12 text-gray-700">
                        Na Teleconnect, oferecemos os melhores serviços de telecomunicação para você e sua empresa.
                        Contamos com banda larga de alta velocidade, telefonia fixa, telefonia móvel e a inovação do 5G,
                        garantindo sempre qualidade e estabilidade na sua conexão.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Banda Larga */}
                        <div className="bg-white p-8 rounded-lg text-center border border-gray-300 shadow-md hover:shadow-lg transition-shadow">
                            <WifiHigh size={80} className="text-[#0D2C40] mb-6" />
                            <h3 className="text-4xl font-bold mb-4">Banda Larga</h3>
                            <p className="text-2xl text-gray-700">
                                Navegue, trabalhe e se divirta sem interrupções com a Banda Larga Teleconnect!
                                Nossa internet de alta velocidade garante estabilidade para todas as suas necessidades.
                            </p>
                        </div>
                        {/* Telefonia Móvel */}
                        <div className="bg-white p-8 rounded-lg text-center border border-gray-300 shadow-md hover:shadow-lg transition-shadow">
                            <Phone size={80} className="text-[#0D2C40] mb-6" />
                            <h3 className="text-4xl font-bold mb-4">Telefonia Móvel</h3>
                            <p className="text-2xl text-gray-700">
                                Com os planos Teleconnect Móvel, você tem internet rápida, ligações ilimitadas e cobertura confiável para estar sempre conectado!
                            </p>
                        </div>
                        {/* Telefonia Fixa */}
                        <div className="bg-white p-8 rounded-lg text-center border border-gray-300 shadow-md hover:shadow-lg transition-shadow">
                            <Globe size={80} className="text-[#0D2C40] mb-6" />
                            <h3 className="text-4xl font-bold mb-4">Telefonia Fixa</h3>
                            <p className="text-2xl text-gray-700">
                                Fale sem preocupações com a Telefonia Fixa Teleconnect! Nossa linha fixa oferece chamadas nítidas e pacotes acessíveis.
                            </p>
                        </div>
                        {/* 5G */}
                        <div className="bg-white p-8 rounded-lg text-center border border-gray-300 shadow-md hover:shadow-lg transition-shadow">
                            <Cloud size={80} className="text-[#0D2C40] mb-6" />
                            <h3 className="text-4xl font-bold mb-4">5G</h3>
                            <p className="text-2xl text-gray-700">
                                Descubra o 5G da Teleconnect e experimente a internet móvel como nunca antes! Conexões estáveis e velocidades ultra rápidas.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
};
