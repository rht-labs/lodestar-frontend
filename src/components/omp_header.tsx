import React, { useContext } from 'react';

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
  Link,
  useLocation
} from 'react-router-dom';
        
import {
  CogsIcon,
  ListUlIcon,
  HomeIcon,
  HandPaperIcon,
} from '@patternfly/react-icons';

import avatarImg from '../assets/images/avatar.svg';
import { UserDropdown } from './user_dropdown';
import { FeedbackContext } from '../context/feedback_context';

function _OMPHeader() {
  const iconPad: React.CSSProperties = {
    paddingBottom: 0,
    paddingTop: 0,
  };

  const feedbackContext = useContext(FeedbackContext);

  const { pathname } = useLocation();

  const showLoader = () => {
    feedbackContext.showLoader();
  }

  return (
    <PageHeader
      logo={
        <div>
          <Toolbar>
            <Brand
              alt="Open Innovation Labs"
              src={`${process.env.PUBLIC_URL}/oil_logo.png`}
            ></Brand>
            <div style={{ width: 50 }} />
          </Toolbar>
        </div>
      }
      toolbar={
        <Toolbar>
          <ToolbarGroup>
            <Nav theme="dark">
              <NavList variant={NavVariants.horizontal}>
                <NavItem id="homeLink" itemId={0} isActive={pathname === '/dashboard'}>
                  <Link to="/app" style={iconPad}>
                    <HomeIcon size="md" title="Home" />
                  </Link>
                </NavItem>
                <NavItem onClick={showLoader} id="engagementPaneLink" itemId={1} isActive={pathname === '/engagements'}>
                  <Link style={iconPad} to="/app/engagements" >
                    <ListUlIcon size="md" title="Engagements" />
                  </Link>
                </NavItem>
                <NavItem id="adminLink" itemId={3} isActive={pathname === '/admin'}>
                  <Link style={iconPad} to="/app/admin">
                    <CogsIcon size="md" title="Administration" />
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
                <HandPaperIcon size="md" title="Feature Request" />
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
      avatar={<Avatar src={avatarImg} alt={'User Avatar'} />}
    ></PageHeader>
  );
}

export const OMPHeader = React.memo(_OMPHeader);