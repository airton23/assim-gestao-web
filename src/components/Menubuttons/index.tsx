import Link from 'next/link';
import React from 'react';
import { BiSolidHome } from 'react-icons/bi';
import { FaBuildingUser, FaCity } from 'react-icons/fa6';
import { GrSchedules } from 'react-icons/gr';
import { HiUsers } from 'react-icons/hi';
import { PiStorefrontLight } from 'react-icons/pi';
import { TbHomeSearch } from 'react-icons/tb';

import S from './styles.module.scss';

const MenuOptions = () => {
  const [role, setRole] = React.useState('');

  React.useEffect(() => {
    const roles = localStorage.getItem('@roles');
    if (roles) {
      const parsedRoles = JSON.parse(roles);
      if (parsedRoles.length > 0) {
        setRole(parsedRoles[0].nome);
      }
    }
  }, []);

  const menuOptions: Array<{
    icon: React.ReactNode;
    name: string;
    route: string;
    roles: string[];
  }> = [
    {
      icon: <TbHomeSearch className={S.associationIcon} />,
      name: 'Associações',
      route: '/associacoes',
      roles: ['administrador'],
    },
    {
      icon: <FaBuildingUser />,
      name: 'Organização de Controle Social',
      route: '/ocs',
      roles: ['administrador', 'presidente'],
    },
    {
      icon: <GrSchedules />,
      name: 'Reuniões',
      route: '/reunioes',
      roles: ['administrador', 'secretario', 'presidente'],
    },
    {
      icon: <BiSolidHome />,
      name: 'Bairros',
      route: '/bairros',
      roles: ['administrador', 'secretario', 'presidente'],
    },
    {
      icon: <FaCity />,
      name: 'Cidades',
      route: '/cidades',
      roles: ['administrador', 'presidente'],
    },
    {
      icon: <PiStorefrontLight />,
      name: 'Feiras',
      route: '/feiras',
      roles: ['administrador', 'presidente'],
    },
    {
      icon: <HiUsers />,
      name: 'Usuários',
      route: '/usuarios',
      roles: ['administrador', 'secretario', 'presidente'],
    },
  ];

  const visibleOptions = menuOptions.filter((option) =>
    option.roles.includes(role),
  );

  return (
    <ul className={S.menuList}>
      {visibleOptions.map((option) => (
        <li key={option.name} className={S.menuOption}>
          <Link href={option.route}>
            {option.icon}
            <p>{option.name}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default MenuOptions;
