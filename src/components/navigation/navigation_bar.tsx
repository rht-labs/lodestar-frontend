import React from 'react';
import avatarImg from '../../assets/images/avatar.svg';
import { UserDropdown } from './user_dropdown';
import { Link, useLocation } from 'react-router-dom';
import {
  PageHeader,
  Brand,
  Toolbar,
  ToolbarItem,
  ToolbarGroup,
  Nav,
  NavItem,
  NavList,
  NavVariants,
  Avatar,
} from '@patternfly/react-core';

import {
  CogIcon,
} from '@patternfly/react-icons';

export interface NavigationBarProps{
  isDrawerOpen: boolean;
  onNavToggle: ()=>void;
}
export function NavigationBar(props:NavigationBarProps) {

  const iconPad: React.CSSProperties = {
    paddingBottom: 0,
    paddingTop: 0,
  };
  const { pathname } = useLocation();
  return (
    <PageHeader
      showNavToggle
      isNavOpen={props.isDrawerOpen}
      onNavToggle={props.onNavToggle}
      logo={
        <div>
          <Toolbar>
            <Brand
              alt="Open Innovation Labs"
              src={`${process.env.PUBLIC_URL}/oil_logo.png`}
            />
            <div style={{width: 50}}/>
          </Toolbar>
        </div>
      }
      toolbar={
        <Toolbar>
          <ToolbarGroup>
            <Nav theme="dark">
              <NavList variant={NavVariants.horizontal}>
                <NavItem
                  id="adminLink"
                  itemId={3}
                  isActive={pathname === '/admin'}
                >
                  <Link style={iconPad} to="/app/admin">
                    <CogIcon size="md" title="Administration" />
                  </Link>
                </NavItem>
              </NavList>
            </Nav>
          </ToolbarGroup>

          <ToolbarGroup>
            <ToolbarItem>
              <UserDropdown />
            </ToolbarItem>
          </ToolbarGroup>
        </Toolbar>
      }
      avatar={<Avatar src={avatarImg} alt={'User Avatar'} />}
    />
  );
}
