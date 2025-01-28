import { Link } from "react-router-dom";

export const Header = () => {
    return (
        <header className="fixed top-0 left-0 w-full z-10 flex justify-between items-center p-4 bg-black bg-opacity-50 text-white">
        <nav>
            <ul className="flex gap-8 list-none m-0 p-0">
                <li>
                    <Link to="/home" className="text-white text-lg hover:underline">
                        Home
                    </Link>
                </li>
                <li>
                    <Link to="/about" className="text-white text-lg hover:underline">
                        Sobre Nós
                    </Link>
                </li>
                <li>
                    <Link to="/clients" className="text-white text-lg hover:underline">
                        Para Clientes
                    </Link>
                </li>
                <li>
                    <Link to="/company" className="text-white text-lg hover:underline">
                        Para Empresas
                    </Link>
                </li>
                <li>
                    <Link to="/contact" className="text-white text-lg hover:underline">
                        Contato
                    </Link>
                </li>
            </ul>
        </nav>

        <button
            className="text-white text-lg bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => window.location.href = '/login'}
        >
            Login
        </button>
    </header>
    );
};