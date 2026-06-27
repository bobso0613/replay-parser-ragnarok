import { NavLink } from 'react-router-dom';
import type { FC } from 'react';
import type { HeaderProps } from '@/types';
import { ENV } from '@/constants';
import React from 'react';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `transition-colors ${isActive ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-gray-900'}`;

const Header: FC<HeaderProps> = ({ logoText = ENV.APPLICATION_NAME, routes }) => {
  const navItems = routes
    .filter((route) => typeof route.path === 'string' && route.path !== '*')
    .map((route) => {
      const path = route.path as string;
      const label =
        route.handle?.label ||
        (path === '/' ? 'Home' : path.replace(/^\//, '').replace(/\//g, ' /')) ||
        'Link';

      return (
        <NavLink key={path} to={path} className={linkClass}>
          {label}
        </NavLink>
      );
    });

  return (
    <header className="sticky top-0 left-0 right-0 w-full z-50 bg-blue-900/40 border-l-sky-400 shadow-sm">
      <div className="mx-auto flex items-center justify-between gap-4 px-12 py-3">
        <div className="text-lg font-bold text-amber-300">{logoText}</div>
        <nav className="flex flex-wrap items-center gap-4">{navItems}</nav>
      </div>
    </header>
  );
};

export default React.memo(Header);
