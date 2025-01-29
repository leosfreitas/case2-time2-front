import { useNavigate } from "react-router-dom";

export const SelectLogin = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-lg p-8 w-[50vh] h-[40vh] flex flex-col">
            <div className="mt-[3vh]">
                <h2 className="text-5xl font-extrabold text-center text-white mb-6">
                    Selecione o Login
                </h2>
            </div>
            <div className="flex flex-col items-center gap-8 mt-[6vh]">
                <button
                    className="w-full bg-[#0D2C40] text-white py-4 text-2xl font-bold rounded-lg hover:bg-[#1D4A7C] transition duration-400 ease-in-out"
                    onClick={() => navigate('/auth/user')}
                >
                    PARA CLIENTES
                </button>
                <button
                    className="w-full bg-[#0D2C40] text-white py-4 text-2xl font-bold rounded-lg hover:bg-[#1D4A7C] transition duration-400 ease-in-out"
                    onClick={() => navigate('/auth/admin')}
                >
                    PARA FUNCIONÁRIOS
                </button>
            </div>
        </div>
    );
};
