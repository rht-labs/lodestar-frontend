import React from 'react';
import {UserDropdown} from './user_dropdown';
import {Link, useLocation} from 'react-router-dom';
import {Notification} from "./notification";
import {
  Brand,
  Nav,
  NavItem,
  NavList,
  PageHeader,
  PageHeaderTools,
  PageHeaderToolsGroup,
  PageHeaderToolsItem
} from '@patternfly/react-core';

import {HelpIcon} from '@patternfly/react-icons';

export interface HeaderProps {
  isDrawerOpen: boolean;
  onNavToggle: () => void;
}

export function Header(props: HeaderProps) {

  const iconPad: React.CSSProperties = {
    paddingBottom: 0,
    paddingTop: 0,
  };
  const {pathname} = useLocation();
  return (
    <PageHeader
      showNavToggle
      isNavOpen={props.isDrawerOpen}
      onNavToggle={props.onNavToggle}
      logo={
        <Brand
          alt="Open Innovation Labs"
          src={`${process.env.PUBLIC_URL}/oil_logo.png`}
        />
      }
      headerTools={
        <PageHeaderTools>
          <PageHeaderToolsGroup>
            <PageHeaderToolsItem>
              <Notification/>
            </PageHeaderToolsItem>
            <PageHeaderToolsItem>
              <Nav theme="dark" variant="horizontal">
                <NavList>
                  <NavItem
                    id="aboutLink"
                    itemId={3}
                    isActive={pathname === '/about'}
                  >
                    <Link style={iconPad} to="/app/about">
                      <HelpIcon title="About"/>
                    </Link>
                  </NavItem>
                </NavList>
              </Nav>
            </PageHeaderToolsItem>
            <PageHeaderToolsItem>
              <UserDropdown/>
            </PageHeaderToolsItem>
          </PageHeaderToolsGroup>
        </PageHeaderTools>
      }
    />
  );
}
