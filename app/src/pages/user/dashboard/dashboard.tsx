import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import styled from 'styled-components';

import { Header } from './components/header';
import { Menu } from './components/menu';

import { Home } from './nested/home/homepage';
import { Profile } from './nested/profile/profile';
import { Contato } from './nested/contato/contato';
import { Pacotes } from './nested/pacotes/pacotes';

export const Dashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <DashboardStyles>
      <Header onToggleMenu={toggleMobileMenu} />
      <Menu isMobileMenuOpen={isMobileMenuOpen} />
      <Routes>
        <Route path="home" element={<Home />} />
        <Route path="profile" element={<Profile />} />
        <Route path="contato" element={<Contato />} />
        <Route path="pacotes" element={<Pacotes />} />
      </Routes>
    </DashboardStyles>
  );
};

const DashboardStyles = styled.div`
  display: grid;
  grid-template-columns: 35vh 1fr; /* Largura da sidebar padrão */
  grid-template-rows: 15vh 1fr;
  min-height: 100vh;
  width: 100vw;
  background-color: #eff3f7;

  /* 
    Em telas grandes (a partir de 1024px) limitamos a altura total a 100vh, 
    mas abaixo disso deixamos a altura livre (none) para permitir rolagem maior que 100vh.
  */
  @media (min-width: 1024px) {
    max-height: 100vh;
  }

  @media (max-width: 1024px) {
    max-height: none;
  }

  @media (max-width: 768px) {
    /* Em telas menores, 
       o Header fica em cima e o conteúdo embaixo (apenas 1 coluna),
       e o Menu é controlado pela posição fixa dentro do próprio menu.tsx
    */
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }

  @media (max-width: 480px) {
    /* Mantemos 1 coluna e 2 linhas */
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
`;
