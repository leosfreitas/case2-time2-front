import { menuItems } from "../constants/menu-items";
import styled from "styled-components";
import { TrendUp } from "@phosphor-icons/react";
import { logout } from '../../auth/logout/api/logout';
import { SignOut } from '@phosphor-icons/react';
import { toast } from "react-hot-toast";

export const Menu = () => {
    const handleLogout = async () => {
        try {
            toast.loading("Realizando logout...");
            await logout();
            toast.dismiss();
            toast.success("Logout realizado com sucesso!");
            window.location.href = '/auth/login/select'; 
        } catch (error) {
            toast.dismiss(); 
            toast.error("Não foi possível realizar o logout. Tente novamente.");
            console.error('Erro ao fazer logout:', error);
        }
    };

    return (
        <MenuStyles>
            <h1>
                <TrendUp weight="bold" className="icon" />
                <span>TeleConnect</span>
            </h1>
            {menuItems.map((item, index) => (
                <a key={index} href={item.href}>
                    {item.icon}
                    {item.label}
                </a>
            ))}
            <button onClick={handleLogout} className="logout-btn">
                <SignOut />
                Sair
            </button>
        </MenuStyles>
    );
};

const MenuStyles = styled.div`
    grid-column: 1;
    grid-row: 1 / span 2;
    background-color: #1c2434;
    padding: 20px 30px;
    border-right: 1px solid #ddd;
    display: flex;
    flex-direction: column;
    gap: 20px;

    h1 {
        font-size: 1.8rem;
        margin-bottom: 25px;
        margin-left: 10px;
        font-weight: 650;
        color: #ffffff;
        display: flex;
        align-items: center;
        gap: 15px;

        .icon {
            font-size: 2.0rem;
            color: #ffffff;
            background-color: #3c50e0;
            border-radius: 15%;
            margin-top: 3px;
            padding: 2px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }
    }

    a { 
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 1.0rem;
        font-weight: 500;
        color: #d9dce8;
        text-decoration: none;
        background: none;
        transition: background-color 0.3s ease, color 0.3s ease;

        svg {
            font-size: 1.5rem;
        }

        &:hover {
            background-color: #3c50e0;
            color: #ffffff;
        }
    }

    .logout-btn {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 1.0rem;
        font-weight: 500;
        color: #d9dce8;
        background: none;
        border: none;
        cursor: pointer;
        transition: background-color 0.3s ease, color 0.3s ease;

        svg {
            font-size: 1.5rem;
        }

        &:hover {
            background-color: #3c50e0;
            color: #ffffff;
        }
    }
`;
