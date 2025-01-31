import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { headerItems } from "../constants/header-items";
import { checkAdminToken, checkUserToken } from "./api/token";
import { AdminLogout, UserLogout } from "./api/logout";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<"admin" | "user" | undefined>(undefined);

  // Estado para controlar a abertura do menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function verifyToken() {
      try {
        await checkAdminToken();
        setUserType("admin");
        setIsLoggedIn(true);
      } catch (err) {
        try {
          await checkUserToken();
          setUserType("user");
          setIsLoggedIn(true);
        } catch (err2) {
          setIsLoggedIn(false);
          setUserType(undefined);
        }
      }
    }

    verifyToken();
  }, []);

  const handleLogout = async () => {
    try {
      if (userType === "admin") {
        await AdminLogout();
      } else if (userType === "user") {
        await UserLogout();
      }

      setIsLoggedIn(false);
      setUserType(undefined);

      navigate("/home", { replace: true });

      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const handleNavigateDashboard = () => {
    if (userType === "admin") {
      navigate("/admin/dashboard/home");
    } else if (userType === "user") {
      navigate("/user/dashboard/home");
    }
  };

  return (
    <HeaderStyles>
      <div className="header-container">
        {/* LOGO */}
        <div className="logo">
          <h1 className="logo-title">TELECONNECT</h1>
        </div>

        {/* MENU DESKTOP (nav + auth buttons) */}
        <nav className="nav-desktop">
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

        <div className="auth-buttons-desktop">
          {isLoggedIn ? (
            <>
              <button className="auth-button login" onClick={handleNavigateDashboard}>
                Dashboard
              </button>
              <button className="auth-button register" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="auth-button login"
                onClick={() => navigate("/auth/select")}
              >
                Login
              </button>
              <button
                className="auth-button register"
                onClick={() => navigate("/auth/register")}
              >
                Cadastre-se
              </button>
            </>
          )}
        </div>

        {/* BOTÃO HAMBÚRGUER (somente mobile) */}
        <button
          className="hamburger md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {/* Ícone de 3 barras simples (pode trocar por outro) */}
          <svg
            className="w-7 h-7 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* MENU MOBILE (aparece só quando isMobileMenuOpen for true) */}
      {isMobileMenuOpen && (
        <div className="mobile-menu md:hidden">
          {/* LINKS DE NAVEGAÇÃO */}
          <nav className="mobile-links">
            {headerItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`mobile-nav-link ${
                  location.pathname === item.href ? "active" : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* BOTÕES DE LOGIN/LOGOUT */}
          <div className="mobile-auth">
            {isLoggedIn ? (
              <>
                <button
                  className="mobile-auth-button login"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleNavigateDashboard();
                  }}
                >
                  Dashboard
                </button>
                <button
                  className="mobile-auth-button register"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="mobile-auth-button login"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate("/auth/select");
                  }}
                >
                  Login
                </button>
                <button
                  className="mobile-auth-button register"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate("/auth/register");
                  }}
                >
                  Cadastre-se
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </HeaderStyles>
  );
};

const HeaderStyles = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 99999;

  /* Mantemos um padding vertical para desktop */
  padding: 22px 0;
  background-color: transparent;

  .header-container {
    background-color: #0d2c40;
    border-radius: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 36px;
    width: 90%;
    max-width: 1600px;
    margin: 0 auto;
  }

  .logo {
    .logo-title {
      font-size: 42px;
      font-weight: bold;
      color: white;
    }
  }

  /* NAV DESKTOP */
  .nav-desktop {
    display: flex;
    gap: 56px;

    .nav-link {
      color: white;
      font-size: 30px;
      font-weight: 800;
      text-decoration: none;
      transition: all 0.3s ease;

      &.active {
        color: #4fc3f7;
      }
    }

    /* Oculta o nav-desktop em telas menores */
    @media (max-width: 768px) {
      display: none;
    }
  }

  /* AUTH-BUTTONS DESKTOP */
  .auth-buttons-desktop {
    display: flex;
    gap: 24px;

    .auth-button {
      padding: 12px 28px;
      border-radius: 32px;
      font-size: 24px;
      font-weight: 800;
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

    /* Oculta os botões de autenticação em telas menores */
    @media (max-width: 768px) {
      display: none;
    }
  }

  /* BOTÃO HAMBÚRGUER (somente aparece em telas menores) */
  .hamburger {
    background: transparent;
    border: none;
    cursor: pointer;
    display: none; /* escondido por padrão em desktop */

    @media (max-width: 768px) {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  /* MENU MOBILE */
  .mobile-menu {
    /* Fundo da barra em modo mobile (grudado no topo) */
    background-color: #0d2c40;
    border-radius: 0;
    width: 100%;
    padding: 16px 0;

    display: flex;
    flex-direction: column;
    align-items: center;

    /* A parte do “.mobile-menu” vem logo abaixo do header-container */
  }

  .mobile-links {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    align-items: center;
    margin-bottom: 16px;

    .mobile-nav-link {
      color: white;
      font-size: 24px;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.3s ease;

      &.active {
        color: #4fc3f7;
      }
    }
  }

  .mobile-auth {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    align-items: center;

    .mobile-auth-button {
      width: 80%;
      padding: 12px 20px;
      border-radius: 32px;
      font-size: 20px;
      font-weight: 800;
      cursor: pointer;
      border: none;
      transition: all 0.3s ease;
      text-align: center;
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

  /* Ajustes para telas menores: remove border-radius e padding do container */
  @media (max-width: 768px) {
    padding: 0;

    .header-container {
      border-radius: 0;
      width: 100%;
      margin: 0;
      padding: 16px 16px;
    }

    .logo .logo-title {
      font-size: 28px;
    }
  }
`;
