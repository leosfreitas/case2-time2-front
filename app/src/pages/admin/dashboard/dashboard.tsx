import { Route, Routes } from 'react-router-dom';
import { Header } from './components/header';
import { Menu } from './components/menu';
import styled from 'styled-components';
import { Home } from './nested/home/homepage';
import { Profile } from './nested/profile/profile';
import { Contato } from './nested/contato/contato';
import { Pacotes } from './nested/pacotes/pacotes';
import { Sac } from './nested/sac/sac';

export const Dashboard = () => {
    return (
        <DashboardStyles>
            <Header/>
            <Menu/>
            <Routes>
                <Route path="home" element={<Home />}/>
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
    grid-template-columns: 35vh 1fr; /* Largura da sidebar padrão */
    grid-template-rows: 15vh 1fr;
    height: 100vh;
    width: 100vw;
    background-color: #eff3f7;

    @media (max-width: 768px) {
        grid-template-columns: 250px 1fr; /* Sidebar menor em telas médias */
    }

    @media (max-width: 480px) {
        grid-template-columns: 200px 1fr; /* Sidebar ainda menor em telas pequenas */
    }
`;
