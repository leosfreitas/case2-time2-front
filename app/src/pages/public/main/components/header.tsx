import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { headerItems } from "../constants/header-items";
import { useNavigate } from "react-router-dom";

export const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <HeaderStyles>
            <div className="header-container">
                <div className="logo">
                    <h1 className="logo-title">TELECONNECT</h1>
                </div>
                <nav>
                    {headerItems.map((item) => (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={`nav-link ${location.pathname === item.href ? "active" : ""}`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="auth-buttons">
                    <button
                        className="auth-button login"
                        onClick={() => navigate('/auth/select')}
                    >
                        Login
                    </button>
                    <button
                        className="auth-button register"
                        onClick={() => navigate('/auth/register')}
                    >
                        Cadastre-se
                    </button>
                </div>
            </div>
        </HeaderStyles>
    );
};

const HeaderStyles = styled.header`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 99999;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px 0;
    background-color: transparent;

    .header-container {
        background-color: #0d2c40;
        border-radius: 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 32px; /* Aumentado o espaçamento */
        width: 90%;
        max-width: 1400px;
    }

    .logo {
        .logo-title {
            font-size: 32px; /* Aumentado para 32px */
            font-weight: bold;
            color: white;
        }
    }

    nav {
        display: flex;
        gap: 48px; /* Aumentado o espaço entre os itens */

        .nav-link {
            color: white;
            font-size: 24px; /* Aumentado para 24px */
            font-weight: 700; /* Aumentado para negrito */
            text-decoration: none;
            transition: all 0.3s ease;

            &.active {
                color: #4fc3f7; /* Azul claro para o item ativo */
            }
        }
    }

    .auth-buttons {
        display: flex;
        gap: 20px; /* Aumentado o espaço entre os botões */

        .auth-button {
            padding: 10px 24px; /* Aumentado o padding para refletir os textos maiores */
            border-radius: 28px;
            font-size: 18px; /* Aumentado para 18px */
            font-weight: 700; /* Aumentado para negrito */
            cursor: pointer;
            border: none;
            transition: all 0.3s ease;
        }

        .login {
            background-color: #0d2c40;
            color: white;
            border: 2px solid white;

            &:hover {
                background-color: #1d4a7c;
                color: white;
            }
        }

        .register {
            background-color: white;
            color: #0d2c40;

            &:hover {
                background-color: #e0e0e0;
                color: #0d2c40;
            }
        }
    }
`;
