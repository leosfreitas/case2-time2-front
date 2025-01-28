import { House } from '@phosphor-icons/react';
import { User } from '@phosphor-icons/react';
import { Envelope, Package, Headset } from '@phosphor-icons/react';

export const menuItems = [
    {
        label: 'Página Inicial',
        icon: <House />,
        href: '/user/dashboard/home',
    },
    {
        label: 'Perfil',
        icon: <User />,
        href: '/user/dashboard/profile',
    },
    {
        label: 'Pacotes',
        icon: <Package />,
        href: '/user/dashboard/pacotes',
    },
    {
        label: 'Contato',
        icon: <Envelope />,
        href: '/user/dashboard/contato',
    },
];

