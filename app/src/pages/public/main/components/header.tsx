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
          {isLoggedIn ? (
            <>
              <button
                className="auth-button login"
                onClick={handleNavigateDashboard}
              >
                Dashboard
              </button>
              <button
                className="auth-button register"
                onClick={handleLogout}
              >
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
  }

  .logo {
    .logo-title {
      font-size: 42px;
      font-weight: bold;
      color: white;
    }
  }

  nav {
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
  }

  .auth-buttons {
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
  }
`;
