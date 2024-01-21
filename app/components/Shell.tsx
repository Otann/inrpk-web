import { Notification, UserAvatar } from '@carbon/icons-react';
import {
  Content,
  Header,
  HeaderContainer,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderMenuButton,
  HeaderName,
  HeaderNavigation,
  HeaderSideNavItems,
  SideNav,
  SideNavItems,
  SkipToContent,
} from '@carbon/react';
import { useMatches } from '@remix-run/react';
import React, { useState } from 'react';
import RemixedHeaderMenuItem from './remixed/RemixedHeaderMenuItem';

const HeaderMenuItems = (
  <>
    <RemixedHeaderMenuItem to="/schedule">Расписание</RemixedHeaderMenuItem>
    <RemixedHeaderMenuItem to="/group">Группы</RemixedHeaderMenuItem>
    <RemixedHeaderMenuItem to="/telegram">Телеграм</RemixedHeaderMenuItem>
    <RemixedHeaderMenuItem to="/zoom">Зум</RemixedHeaderMenuItem>
    {/* <HeaderMenu aria-label="Телеграм" menuLinkName="Телеграм">
      <HeaderMenuItem href="#one">Sub-link 1</HeaderMenuItem>
      <HeaderMenuItem href="#two">Sub-link 2</HeaderMenuItem>
      <HeaderMenuItem href="#three">Sub-link 3</HeaderMenuItem>
    </HeaderMenu> */}
  </>
);

const Shell: React.FC<React.PropsWithChildren> = (props) => {
  const matches = useMatches();
  const match = matches.length > 0 ? matches[matches.length - 1] : null;
  const page = match?.pathname;

  return (
    <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <>
          <Header aria-label="Панель управления ботом ИнРПК">
            <SkipToContent />
            <HeaderMenuButton
              aria-label={isSideNavExpanded ? 'Close menu' : 'Open menu'}
              onClick={onClickSideNavExpand}
              isActive={isSideNavExpanded}
              aria-expanded={isSideNavExpanded}
            />
            <HeaderName href="#" prefix="Проект">
              ИнРПК Бот
            </HeaderName>
            <HeaderNavigation aria-label="ИнРПК Бот">
              {HeaderMenuItems}
            </HeaderNavigation>
            <HeaderGlobalBar>
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
            <SideNav
              aria-label="Side navigation"
              isPersistent={false}
              expanded={isSideNavExpanded}
              onSideNavBlur={onClickSideNavExpand}
              href="#main-content"
              placeholder={'noop'}
            >
              <SideNavItems>
                <HeaderSideNavItems>{HeaderMenuItems}</HeaderSideNavItems>
                {/* <SideNavLink renderIcon={Fade}>Link</SideNavLink> */}
              </SideNavItems>
            </SideNav>
          </Header>
          <Content id="main-content">{props.children}</Content>
        </>
      )}
    />
  );
};

export default Shell;
