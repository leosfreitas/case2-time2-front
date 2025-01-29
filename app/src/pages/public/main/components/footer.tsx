export const Footer = () => {
    return (
        <footer className="bg-[#0D2C40] text-white py-12 px-16">
                <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                    <div className="mb-10 md:mb-0">
                        <ul className="space-y-4 text-lg">
                            <li><a href="#" className="hover:underline">Privacy policy</a></li>
                            <li><a href="#" className="hover:underline">Condições de Uso</a></li>
                        </ul>
                    </div>

                    <div className="mb-10 md:mb-0">
                        <h3 className="text-2xl font-bold mb-4">Contato</h3>
                        <p className="text-lg">teleconnect@gmail.com</p>
                        <p className="text-lg">11 91234-5677</p>
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold mb-4">Serviços</h3>
                        <ul className="space-y-4 text-lg">
                            <li>Banda Larga</li>
                            <li>Telefonia Móvel</li>
                            <li>5G</li>
                            <li>Telefonia Fixa</li>
                        </ul>
                    </div>
                </div>
            </footer>
    );
};
                        