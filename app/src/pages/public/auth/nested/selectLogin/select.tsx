import { useNavigate } from "react-router-dom"

export const SelectLogin = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 w-[40vh] h-[45vh] ml-[15vh] -mb-[5vh]">
            <h2 className="text-lg font-bold mb-4 text-black">
                Selecione o Login
            </h2>
            <button
                className="w-full bg-black text-white py-3 rounded-lg mb-4 hover:bg-gray-800"
                onClick={() => navigate('/auth/login/user')} 
            >
                PARA CLIENTES
            </button>
            <button
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
                onClick={() => navigate('/auth/login/admin')}
            >
                PARA FUNCIONÁRIOS
            </button>
        </div>
    );
};