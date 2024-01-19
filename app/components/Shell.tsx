import React from 'react';
import {
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderMenu,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
} from '@carbon/react';
import { Notification, UserAvatar } from '@carbon/react/icons/index.js';
import RemixedHeaderMenuItem from './remixed/RemixedHeaderMenuItem';
import { useMatches } from '@remix-run/react';

const Shell: React.FC<React.PropsWithChildren> = (props) => {
  const matches = useMatches();
  const match = matches.length > 0 ? matches[matches.length - 1] : null;
  const page = match?.pathname;

  return (
    <div className="container">
      <Header aria-label="Carbon Remix">
        <HeaderName href="/" prefix="Проект">
          ИнРПК Бот
        </HeaderName>
        <HeaderNavigation aria-label="Carbon Remix">
          <RemixedHeaderMenuItem to="/timeline">
            Расписание
          </RemixedHeaderMenuItem>
          <RemixedHeaderMenuItem to="/groups">Группы</RemixedHeaderMenuItem>
        </HeaderNavigation>
        <HeaderGlobalBar>
          {/* <HeaderGlobalAction aria-label="Search" onClick={() => {}}>
            <Search size={20} />
          </HeaderGlobalAction> */}
          <HeaderGlobalAction
            aria-label="Профиль"
            href="/profile"
            isActive={page === '/profile'}
          >
            <UserAvatar size={20} />
          </HeaderGlobalAction>
          <HeaderGlobalAction aria-label="Уведомления" onClick={() => {}}>
            <Notification size={20} />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </Header>
      <main style={{ paddingTop: '3rem' }}>{props.children}</main>
    </div>
  );
};

export default Shell;
