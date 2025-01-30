import { House } from '@phosphor-icons/react';
import { User } from '@phosphor-icons/react';
import { Envelope, Package, Headset, Users } from '@phosphor-icons/react';

export const menuItems = [
    {
        label: 'Página Inicial',
        icon: <House />,
        href: '/admin/dashboard/home',
    },
    {
        label: 'Usuários',
        icon: <Users />,
        href: '/admin/dashboard/users',
    },
    {
        label: 'Perfil',
        icon: <User />,
        href: '/admin/dashboard/profile',
    },
    {
        label: 'Pacotes',
        icon: <Package />,
        href: '/admin/dashboard/pacotes',
    },
    {
        label: 'Contato',
        icon: <Envelope />,
        href: '/admin/dashboard/contato',
    },
    {
        label: 'SAC',
        icon: <Headset />,
        href: '/admin/dashboard/sac',
    },
];
