export const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center max-h-[70vh] bg-gray-100 px-4 text-center w-full">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Bem-vindo, Admin</h1>
            <p className="text-lg md:text-2xl text-gray-700 max-w-2xl">
                Aqui você pode gerenciar usuários e pacotes e responder perguntas
            </p>
        </div>
    );
};
