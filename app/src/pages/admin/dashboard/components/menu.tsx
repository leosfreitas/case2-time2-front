import { menuItems } from "../constants/menu-items";
import styled from "styled-components";
import { logout } from "../../auth/logout/api/logout";
import { SignOut } from '@phosphor-icons/react';
import { toast } from "react-hot-toast";
import { CardsThree } from "@phosphor-icons/react";

// Tipagem para receber se o menu está aberto ou não
interface MenuProps {
  isMobileMenuOpen?: boolean;
}

export const Menu = ({ isMobileMenuOpen }: MenuProps) => {
  const handleLogout = async () => {
    try {
      toast.loading("Realizando logout...");
      await logout();
      toast.dismiss();
      toast.success("Logout realizado com sucesso!");
      window.location.href = '/auth/select';
    } catch (error) {
      toast.dismiss();
      toast.error("Não foi possível realizar o logout. Tente novamente.");
      console.error('Erro ao fazer logout:', error);
    }
  };

  const goToHome = () => {
    window.location.href = "/home"; // Redireciona para a home sem deslogar
  };

  return (
    <MenuStyles isOpen={isMobileMenuOpen}>
      <h1>
        <span>TeleConnect</span>
      </h1>

      {/* Links de Menu */}
      {menuItems.map((item, index) => (
        <a key={index} href={item.href}>
          {item.icon}
          {item.label}
        </a>
      ))}

      <div className="spacer"></div> {/* Espaçador para empurrar os botões para o final */}

      {/* Ir para o site (Apenas Redireciona) */}
      <button onClick={goToHome} className="logout-btn">
        <CardsThree />
        Ir para o site
      </button>

      {/* Sair da Conta (Faz Logout) */}
      <button onClick={handleLogout} className="logout-btn">
        <SignOut />
        Sair da conta
      </button>
    </MenuStyles>
  );
};

const MenuStyles = styled.div<{ isOpen?: boolean }>`
  grid-column: 1;
  grid-row: 1 / span 2;
  background-color: #0d2c40;
  padding: 20px 30px;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 100vh;
  max-height: 100vh;
  transition: all 0.3s ease;
  overflow-y: auto; /* Permite rolagem caso tenha muitas páginas */

  h1 {
    font-size: 4rem;
    margin-top: 2vh;
    margin-bottom: 4vh;
    margin-left: 2vh;
    font-weight: 650;
    color: #ffffff;
    display: flex;
    align-items: center;

    @media (max-width: 768px) {
      font-size: 2rem; /* Reduz no mobile */
    }
  }

  a {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 1.5rem;
    font-weight: 700;
    color: #ffffff;
    text-decoration: none;
    background: none;
    transition: background-color 0.3s ease, color 0.3s ease;

    svg {
      font-size: 1.5rem;
      @media (max-width: 768px) {
        font-size: 1.2rem; /* Reduz ícone no mobile */
      }
    }

    &:hover {
      background-color: #00a5e8;
      color: #ffffff;
    }

    @media (max-width: 768px) {
      font-size: 1.2rem; /* Reduz texto no mobile */
      padding: 10px 16px;
    }
  }

  .spacer {
    flex-grow: 1;
  }

  .logout-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 1.5rem;
    font-weight: 700;
    color: #ffffff;
    background: none;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease;

    svg {
      font-size: 1.5rem;
      @media (max-width: 768px) {
        font-size: 1.2rem;
      }
    }

    &:hover {
      background-color: #00a5e8;
      color: #ffffff;
    }

    @media (max-width: 768px) {
      font-size: 1.2rem; 
      padding: 10px 16px;
    }
  }

  /* Em telas menores, o Menu se comporta como menu móvel "fora" da grid */
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: ${({ isOpen }) => (isOpen ? '0' : '-100%')};
    width: 220px; /* Tamanho do menu no mobile */
    height: 100vh;
    z-index: 9999;
    border-right: none;
  }
`;
