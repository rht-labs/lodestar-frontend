import React from 'react';

import {
  PageHeader,
  Brand,
  Toolbar,
  ToolbarItem,
  ToolbarGroup,
  Nav,
  NavItem,
  NavList,
} from '@patternfly/react-core';

import { Link, useLocation } from 'react-router-dom';

import {
  CogsIcon,
  ListUlIcon,
  HomeIcon,
  HandPaperIcon,
} from '@patternfly/react-icons';

import { UserDropdown } from './user_dropdown';

function _OMPHeader() {
  const iconPad: React.CSSProperties = {
    paddingBottom: 0,
    paddingTop: 0,
  };

  const { pathname } = useLocation();

  return (
    <PageHeader
  showNavToggle
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
  headerTools={
    <Toolbar>
      <ToolbarGroup>
        <Nav theme="dark" variant="horizontal">
          <NavList>
            <NavItem
              id="homeLink"
              itemId={0}
              isActive={pathname === '/dashboard'}
            >
              <Link to="/app" style={iconPad}>
                <HomeIcon size="md" title="Home"/>
              </Link>
            </NavItem>
            <NavItem
              id="engagementPaneLink"
              itemId={1}
              isActive={pathname === '/engagements'}
            >
              <Link style={iconPad} to="/app/engagements">
                <ListUlIcon size="md" title="Engagements"/>
              </Link>
            </NavItem>
            <NavItem
              id="adminLink"
              itemId={3}
              isActive={pathname === '/admin'}
            >
              <Link style={iconPad} to="/app/admin">
                <CogsIcon size="md" title="Administration"/>
              </Link>
            </NavItem>
          </NavList>
        </Nav>
      </ToolbarGroup>
      <ToolbarGroup>
        <ToolbarItem>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfcKY5eKwDYSxIF9oYeDDVyYCqwcq_AD0eqhY4uLtpcCgfWwA/viewform"
            target="_blank"
            rel="noopener noreferrer"
          >
            <HandPaperIcon size="md" title="Feature Request"/>
          </a>
        </ToolbarItem>
      </ToolbarGroup>
      <ToolbarGroup>
        <ToolbarItem>
          <UserDropdown/>
        </ToolbarItem>
      </ToolbarGroup>
    </Toolbar>
  }
  />
  );
}

export const OMPHeader = React.memo(_OMPHeader);
