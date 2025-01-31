import React, { useEffect } from "react";
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

  // Removido o estado do userName e o fetch, já que não exibiremos mais o nome
  // Caso precise manter a lógica, apenas comente:
  // const [userName, setUserName] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchUserName = async () => {
  //     try {
  //       const response = await getUserName();
  //       setUserName(response.user_name);
  //     } catch (error) {
  //       console.error("Erro ao obter nome do usuário:", error);
  //     }
  //   };
  //   fetchUserName();
  // }, []);

  const routeLabels: Record<string, string> = {
    dashboard: "Dashboard",
    home: "Página Inicial",
    profile: "Perfil",
    pacotes: "Pacotes",
    contato: "Contato",
  };

  // Funcionalidade de capitalizar (mantida caso queira usar em label)
  const capitalizeFirstLetter = (str: string): string =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <HeaderStyle>
      {/* Breadcrumbs horizontal */}
      <div className="breadcrumb-container">
        <Breadcrumb>
          {/* Forçamos exibição em linha */}
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

  /* Container geral do breadcrumb */
  .breadcrumb-container {
    flex: 1;
    display: flex;
    align-items: center;
  }

  /* Forçamos o breadcrumb ficar em linha (horizontal) */
  .breadcrumb-horizontal {
    display: flex;
    align-items: center;
    gap: 1rem; /* Espaço entre cada item */
  }

  /* Ajusta a cor/tamanho de cada link do breadcrumb */
  .breadcrumb-link {
    font-size: 1.4rem;
    font-weight: 500;
    color: #333;
    text-decoration: none;
  }

  .breadcrumb-separator {
    font-size: 1.4rem;
    color: #777;
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
