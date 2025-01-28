import { Header } from "../../components/header";

export const Contact = () => {
    return (
        <>
            <Header />

            <div className="flex flex-col items-center justify-center mt-[25vh] px-4">
                <h1 className="text-5xl font-bold text-center mb-6">
                    Ficou interessado ou tem dúvidas? <br /> Fale conosco!
                </h1>
                <div className="bg-white shadow-md rounded-md p-6 w-[80vh]">
                    <form className="space-y-4">
                        {/* Nome */}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Nome
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Digite seu nome completo"
                                required
                                className="w-full mt-1 rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Digite seu email"
                                required
                                className="w-full mt-1 rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                        {/* Motivo de contato */}
                        <div>
                            <label
                                htmlFor="subject"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Motivo de contato
                            </label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                placeholder="Digite o motivo do contato"
                                required
                                className="w-full mt-1 rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                        {/* Mensagem */}
                        <div>
                            <label
                                htmlFor="message"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Mensagem
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                rows={4}
                                placeholder="Escreva sua mensagem"
                                required
                                className="w-full mt-1 rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                            ></textarea>
                        </div>
                        {/* Botão Enviar */}
                        <div>
                            <button
                                type="submit"
                                className="w-full bg-[#1E3A8A] text-white font-semibold rounded-md px-4 py-2 hover:bg-[#153E75] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                Enviar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};
