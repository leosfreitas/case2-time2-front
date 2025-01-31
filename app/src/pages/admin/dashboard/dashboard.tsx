import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import styled from 'styled-components';

import { Header } from './components/header';
import { Menu } from './components/menu';

import { Home } from './nested/home/homepage';
import { Profile } from './nested/profile/profile';
import { Contato } from './nested/contato/contato';
import { Pacotes } from './nested/pacotes/pacotes';
import { Users } from './nested/users/users';
import { Sac } from './nested/sac/sac';

export const Dashboard = () => {
    // Estado para controlar se o menu mobile está aberto ou fechado
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Função de toggle para abrir/fechar o menu no mobile
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <DashboardStyles>
            {/* Passamos a função de toggle para o Header */}
            <Header onToggleMenu={toggleMobileMenu} />

            {/* E passamos o estado do menu para o componente Menu */}
            <Menu isMobileMenuOpen={isMobileMenuOpen} />

            <Routes>
                <Route path="home" element={<Home />}/>
                <Route path="users" element={<Users />}/>
                <Route path="profile" element={<Profile />}/>
                <Route path="contato" element={<Contato />}/>
                <Route path="pacotes" element={<Pacotes />}/>
                <Route path="sac" element={<Sac />}/>
            </Routes>
        </DashboardStyles>
    )
}

const DashboardStyles = styled.div`
    display: grid;
    grid-template-columns: 35vh 1fr;
    grid-template-rows: 15vh 1fr;

    /* Faz o background ocupar pelo menos a altura da tela em desktops */
    min-height: 100vh;
    width: 100vw;
    background-color: #eff3f7;

    /* Se quiser manter o max-height no desktop, coloque num @media (min-width) */
    @media (min-width: 1024px) {
        /* Mantém em desktops grandes a altura travada, se for desejado */
        max-height: 100vh;
    }

    /* Em telas menores, deixa a altura livre para crescer além de 100vh */
    @media (max-width: 1024px) {
        max-height: none;
    }

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
    }

    @media (max-width: 480px) {
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
    }
`;
