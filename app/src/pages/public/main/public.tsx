import { Route, Routes } from 'react-router-dom';
import { Header } from './components/header';
import styled from 'styled-components';
import { Home } from './nested/home/home';
import { About } from './nested/about/about';
import { Clients } from './nested/clients/clients';
import { Company } from './nested/company/company';
import { Contact } from './nested/contact/contact';

export const Public = () => {
    return (
        <PublicStyles>
            <Header />
            <main>
                <Routes>
                    <Route path="home" element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="clients" element={<Clients />} />
                    <Route path="company" element={<Company />} />
                    <Route path="contact" element={<Contact />} />
                </Routes>
            </main>
        </PublicStyles>
    );
};

const PublicStyles = styled.div`
    display: grid;
    grid-template-rows: auto 1fr;
    grid-template-columns: 1fr;
    height: 100vh;
    width: 100vw;
    background-color: #eff3f7;

    main {
        padding: 16px;
        overflow-y: auto;
    }

    @media (max-width: 768px) {
        main {
            padding: 12px;
        }
    }
`;
