import React, { useEffect, useState } from "react";
import { useMatches } from "react-router-dom";
import styled from "styled-components";
import { getUserName } from "./api/header";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../../../../components/ui/breadcrumb";

/* Tipagem para receber a função de toggle do menu */
interface HeaderProps {
  onToggleMenu?: () => void;
}

export function Header({ onToggleMenu }: HeaderProps) {
  const matches = useMatches();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // Reintroduzindo a lógica de obter o nome do usuário
    async function fetchUserNameData() {
      try {
        const response = await getUserName();
        setUserName(response.user_name);
      } catch (error) {
        console.error("Erro ao obter nome do usuário:", error);
      }
    }
    fetchUserNameData();
  }, []);

  const routeLabels: Record<string, string> = {
    dashboard: "Dashboard",
    home: "Página Inicial",
    profile: "Perfil",
    pacotes: "Pacotes",
    contato: "Contato",
  };

  const capitalizeFirstLetter = (str: string): string =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <HeaderStyle>
      {/* Breadcrumbs horizontal */}
      <div className="breadcrumb-container">
        <Breadcrumb>
          <BreadcrumbList className="breadcrumb-horizontal">
            {matches.map((match, index) => {
              const key = match.pathname.split("/").pop() || "";
              const breadcrumbLabel =
                routeLabels[key] || capitalizeFirstLetter(key);

              return (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href={match.pathname}
                      className="breadcrumb-link"
                    >
                      {breadcrumbLabel}
                    </BreadcrumbLink>
                  </BreadcrumbItem>

                  {/* Separador (aparece se não for o último item) */}
                  {index < matches.length - 1 && (
                    <BreadcrumbSeparator className="breadcrumb-separator" />
                  )}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Nome do usuário: só aparece em telas maiores que 768px */}
      {userName && (
        <div className="userName-container">
          {/* Ajuste de estilo livre */}
          <span className="userName-text">{userName}</span>
        </div>
      )}

      {/* Botão Hamburger (somente para mobile) */}
      <button className="hamburger" onClick={onToggleMenu}>
        <svg
          className="hamburger-icon"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </HeaderStyle>
  );
}

const HeaderStyle = styled.div`
  height: 100%;
  width: 100%;
  background-color: white;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px;

  .breadcrumb-container {
    flex: 1;
    display: flex;
    align-items: center;
  }

  .breadcrumb-horizontal {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .breadcrumb-link {
    font-size: 1.6rem; /* Tamanho fixo para todas as telas */
    font-weight: 500;
    color: #333;
    text-decoration: none;
  }

  .breadcrumb-separator {
    font-size: 1.6rem; /* Mantém o mesmo tamanho sempre */
    color: #777;
  }

  /* Nome do usuário visível apenas em telas maiores */
  .userName-container {
    margin-right: 16px;

    @media (max-width: 768px) {
      display: none; /* Esconde o nome do usuário em telas pequenas */
    }
  }

  .userName-text {
    font-size: 1.6rem; /* Nome do usuário sempre do mesmo tamanho */
    font-weight: 600;
    color: #333;
  }

  /* Botão hamburger (escondido em desktop) */
  .hamburger {
    display: none;
    background: transparent;
    border: none;
    cursor: pointer;

    @media (max-width: 768px) {
      display: block;
    }
  }

  .hamburger-icon {
    width: 28px;
    height: 28px;
    color: #333;

    @media (max-width: 768px) {
      width: 24px;
      height: 24px;
    }
  }
`;
