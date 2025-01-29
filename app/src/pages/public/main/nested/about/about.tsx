import { Footer } from "../../components/footer";
import { CaretDoubleDown } from "@phosphor-icons/react";
import { Header } from "../../components/header";
import { useRef } from "react";

export const About = () => {


    const scrollToSection = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        scrollToSection.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <>
            <Header />
            <div className="relative h-[90vh] flex flex-col justify-between" id="home">
                <video
                    src="/videos/homepage.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute top-0 left-0 w-full h-full object-cover z-0"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 z-1"></div>
                <div className="relative z-20 flex flex-col items-center justify-center flex-grow px-4 mr-[80vh] mt-[10vh]">
                    <div className="text-white">
                        <h1 className="text-8xl font-bold leading-tight">Conectando</h1>
                        <h1 className="text-8xl font-bold leading-tight">pessoas através</h1>
                        <h1 className="text-8xl font-bold leading-tight">da tecnologia</h1>
                    </div>
                </div>
                <div className="relative z-20 flex justify-center mb-5">
                    <CaretDoubleDown size={64} color="white"
                        onClick={handleScroll}
                    />
                </div>
            </div>

            <div className="bg-[linear-gradient(to_right,#0D2C40,black)] h-[10vh] w-full"></div>

            {/* Seção da história */}
            <section ref={scrollToSection} className="bg-gray-100 py-20 px-12">
                <h2 className="text-5xl font-bold text-center mb-12">Há mais de 15 anos no mercado</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 shadow-lg rounded-lg text-center">
                        <h3 className="text-2xl font-bold mb-6">2010</h3>
                        <p className="text-lg">Há quinze anos, Renato tomou uma decisão corajosa: vendeu sua Veltrac e Mobi para fundar a Teleconnect.</p>
                    </div>
                    <div className="bg-white p-8 shadow-lg rounded-lg text-center">
                        <h3 className="text-2xl font-bold mb-6">2012</h3>
                        <p className="text-lg">Renato, agora junto com seu filho Juninho e seu irmão Reinaldo, conseguiram construir a primeira fábrica no sudeste de São Paulo.</p>
                    </div>
                    <div className="bg-white p-8 shadow-lg rounded-lg text-center">
                        <h3 className="text-2xl font-bold mb-6">2020</h3>
                        <p className="text-lg">A Teleconnect se tornou uma das maiores empresas na área de telecomunicação, expandindo para o resto do sudeste do Brasil.</p>
                    </div>
                </div>
            </section>

            {/* Seção de valores */}
            <section className="bg-white py-20 px-12">
                <h2 className="text-5xl font-bold text-center mb-12">Nossos Valores</h2>
                <p className="text-lg text-center mb-12 max-w-4xl mx-auto">
                    Manter uma cultura forte ancorada em valores claros e frequentemente comunicados está no cerne do que torna a Teleconnect referência no mercado.
                    Estamos comprometidos com os mais altos padrões de ética, conduta empresarial e princípios da empresa.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div>
                        <h3 className="text-2xl font-bold mb-4">Clientes em primeiro lugar</h3>
                        <p className="text-lg">Priorizamos as necessidades e expectativas de nossos clientes em todas as decisões que tomamos.</p>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold mb-4">Excelência</h3>
                        <p className="text-lg">Nos esforçamos para oferecer serviços de qualidade superior e inovação constante.</p>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold mb-4">Ética e Transparência</h3>
                        <p className="text-lg">Agimos com honestidade, clareza e respeito em todas as nossas relações.</p>
                    </div>
                </div>
            </section>

            {/* Seção de missão */}
            <section className="bg-gray-100 py-20 px-12">
                <h2 className="text-5xl font-bold text-center mb-12">Nossa Missão</h2>
                <p className="text-lg text-center max-w-4xl mx-auto">
                    Proporcionar conexão de qualidade para pessoas e empresas, transformando a maneira como se comunicam e interagem com o mundo.
                    Oferecemos soluções inovadoras em banda larga, telefonia fixa e móvel, garantindo tecnologia de ponta e um atendimento eficiente.
                    Nosso compromisso é simplificar e melhorar a vida dos nossos clientes, contribuindo para um futuro mais conectado e acessível.
                </p>
            </section>

            <Footer />
        </>
    );
};
