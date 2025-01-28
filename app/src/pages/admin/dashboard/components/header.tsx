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

export function Header() {
  const matches = useMatches();
  const [userName, setUserName] = useState<string | null>(null);

  const routeLabels: Record<string, string> = {
    dashboard: "Dashboard",
    home: "Página Inicial",
    finances: "Finanças",
    budget: "Orçamento",
    profile: "Perfil",
    history: "Histórico",
  };

  const capitalizeFirstLetter = (string: string): string =>
    string.charAt(0).toUpperCase() + string.slice(1);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await getUserName();
        setUserName(response.user_name); // Atualiza o estado com o nome do usuário
      } catch (error) {
        console.error("Erro ao obter nome do usuário:", error);
      }
    };

    fetchUserName();
  }, []);

  return (
    <HeaderStyle>
      <Breadcrumb>
        <BreadcrumbList>
          {matches.map((match, index) => {
            const key = match.pathname.split("/").pop() || "";
            const breadcrumbLabel = routeLabels[key] || capitalizeFirstLetter(key);

            return (
              <div
                key={index}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={match.pathname}
                    style={{ fontWeight: "500" }}
                  >
                    {breadcrumbLabel}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {index < matches.length - 1 && <BreadcrumbSeparator />}
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="user-container">
        <h1>{userName ? `${userName}` : "Carregando..."}</h1>
      </div>
    </HeaderStyle>
  );
}

const HeaderStyle = styled.div`
  height: 100%;
  width: 100%;
  background-color: white;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1); /* Sombra forte apenas na parte inferior */
  display: flex;
  justify-content: space-between;
  padding: 25px;
  align-items: center;

  .user-container {
    margin-left: auto;
    margin-right: 2%;
    font-size: 1.1rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .user-container p {
    font-weight: 500;
    color: rgba(0, 0, 0, 0.7);
  }
`;
