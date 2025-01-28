import { Link } from "react-router-dom";
import styled from "styled-components";
import { headerItems } from "../constants/header-items";
import { useNavigate } from "react-router-dom";

export const Header = () => {
    const navigate = useNavigate();

    return (
        <HeaderStyles>
            <div className="logo">
                <div className="logo-text">LOGO</div>
                <h1 className="logo-title">TELECONNECT</h1>
            </div>
            <nav>
                {headerItems.map((item) => (
                    <Link key={item.href} to={item.href} className="nav-link">
                        {item.label}
                    </Link>
                ))}
            </nav>
            <button className="login-button" onClick= {() => navigate('/auth/select')}>
                Login
            </button>
        </HeaderStyles>
    );
};

const HeaderStyles = styled.header`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 32px 32px;
    background-color: #0d2c40;
    color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    .logo {
        display: flex;
        align-items: center;
        gap: 8px;

        .logo-text {
            font-size: 20px;
            font-weight: bold;
        }

        .logo-title {
            font-size: 20px;
            font-weight: 600;
        }
    }

    nav {
        display: flex;
        gap: 24px;

        .nav-link {
            color: white;
            font-size: 16px;
            text-decoration: none;
            &:hover {
                text-decoration: underline;
            }
        }
    }

    .login-button {
        color: #1e5aff;
        background-color: #f3f3f3;
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        &:hover {
            background-color: #e0e0e0;
        }
    }
`;
