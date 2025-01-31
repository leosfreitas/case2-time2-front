import { useNavigate } from "react-router-dom";

export const SelectLogin = () => {
    const navigate = useNavigate();

    return (
        <div
            className="
                bg-white bg-opacity-10
                backdrop-blur-md
                rounded-xl
                shadow-lg
                
                /* Para ficar menor em celulares, vamos usar p-4 e aumentar em telas maiores */
                p-4
                sm:p-6
                md:p-8

                /* Largura máxima menor em celulares, maior em telas médias */
                w-full
                max-w-[300px] /* celular */
                sm:max-w-[400px] /* tablet */
                md:max-w-[500px] /* desktop */
                
                /* Altura auto para adaptar ao conteúdo */
                h-auto
                
                flex
                flex-col
                items-center
            "
        >
            {/* Título fica menor em celulares, maior em telas médias ou grandes */}
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-center text-white mb-4 sm:mb-6">
                Selecione o Login
            </h2>

            <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8 w-full mt-2 sm:mt-4">
                <button
                    className="
                        w-full
                        bg-[#0D2C40]
                        text-white
                        py-2
                        sm:py-3
                        md:py-4
                        text-lg
                        sm:text-xl
                        md:text-2xl
                        font-bold
                        rounded-lg
                        hover:bg-[#1D4A7C]
                        transition
                        duration-400
                        ease-in-out
                    "
                    onClick={() => navigate('/auth/user')}
                >
                    PARA CLIENTES
                </button>

                <button
                    className="
                        w-full
                        bg-[#0D2C40]
                        text-white
                        py-2
                        sm:py-3
                        md:py-4
                        text-lg
                        sm:text-xl
                        md:text-2xl
                        font-bold
                        rounded-lg
                        hover:bg-[#1D4A7C]
                        transition
                        duration-400
                        ease-in-out
                    "
                    onClick={() => navigate('/auth/admin')}
                >
                    PARA FUNCIONÁRIOS
                </button>
            </div>
        </div>
    );
};
