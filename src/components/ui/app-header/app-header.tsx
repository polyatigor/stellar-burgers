import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
  Logo,
} from '@krgaa/react-developer-burger-ui-components';

import { NavLink, useLocation } from 'react-router-dom';

import type { TAppHeaderUIProps } from './type';

import styles from './app-header.module.css';

const linkStyle = {
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  color: 'inherit',
} as const;

export const AppHeaderUI = ({ userName }: TAppHeaderUIProps): React.JSX.Element => {
  const { pathname } = useLocation();

  const isConstructorActive = pathname === '/' || pathname.startsWith('/ingredients/');

  const isFeedActive = pathname === '/feed' || pathname.startsWith('/feed/');

  const isProfileActive = pathname === '/profile' || pathname.startsWith('/profile/');

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink to="/" style={linkStyle}>
            <BurgerIcon type={isConstructorActive ? 'primary' : 'secondary'} />
            <p
              className={`text text_type_main-default ml-2 mr-10 ${
                !isConstructorActive ? 'text_color_inactive' : ''
              }`}
            >
              Конструктор
            </p>
          </NavLink>

          <NavLink to="/feed" style={linkStyle}>
            <ListIcon type={isFeedActive ? 'primary' : 'secondary'} />
            <p
              className={`text text_type_main-default ml-2 ${
                !isFeedActive ? 'text_color_inactive' : ''
              }`}
            >
              Лента заказов
            </p>
          </NavLink>
        </div>

        <div className={styles.logo}>
          <NavLink to="/" style={linkStyle}>
            <Logo className="" />
          </NavLink>
        </div>

        <div className={styles.link_position_last}>
          <NavLink to="/profile" style={linkStyle}>
            <ProfileIcon type={isProfileActive ? 'primary' : 'secondary'} />
            <p
              className={`text text_type_main-default ml-2 ${
                !isProfileActive ? 'text_color_inactive' : ''
              }`}
            >
              {userName || 'Личный кабинет'}
            </p>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
