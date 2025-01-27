import { House } from '@phosphor-icons/react';
import { User } from '@phosphor-icons/react';
import { Money } from '@phosphor-icons/react';
import { Clock } from '@phosphor-icons/react';
import { Calculator } from '@phosphor-icons/react';

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
        label: 'Finanças',
        icon: <Money />,
        href: '/user/dashboard/finances',
    },

    {
        label: 'Orçamentos',
        icon: <Calculator />,
        href: '/user/dashboard/budget',
    },

    {
        label: 'Histórico',
        icon: <Clock />,
        href: '/user/dashboard/history',
    },
];

