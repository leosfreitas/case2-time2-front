import { useNavigate } from "react-router-dom";

export const SelectLogin = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-lg p-6 w-[40vh] h-[30vh] flex flex-col">
            <div className="mt-[2vh]">
                <h2 className="text-4xl font-bold text-center text-white mb-4">
                    Selecione o Login
                </h2>
            </div>
            <div className="flex flex-col items-center gap-6 mt-[5vh]">
                <button
                    className="w-full bg-[#0D2C40] text-white py-3 rounded-lg hover:bg-[#1D4A7C] transition duration-400 ease-in-out"
                    onClick={() => navigate('/auth/user')}
                >
                    PARA CLIENTES
                </button>
                <button
                    className="w-full bg-[#0D2C40] text-white py-3 rounded-lg hover:bg-[#1D4A7C] transition duration-400 ease-in-out"
                    onClick={() => navigate('/auth/admin')}
                >
                    PARA FUNCIONÁRIOS
                </button>
            </div>
        </div>
    );
};
