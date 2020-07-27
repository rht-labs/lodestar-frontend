import React from 'react';
import { UserDropdown } from './user_dropdown';
import { Link, useLocation } from 'react-router-dom';
import { Notification } from './notification';
import {
  Brand,
  Nav,
  NavItem,
  NavList,
  PageHeader,
  PageHeaderTools,
  PageHeaderToolsGroup,
  PageHeaderToolsItem,
  TooltipPosition,
} from '@patternfly/react-core';
import { Tooltip } from '@patternfly/react-core';

import { HelpIcon, LightbulbIcon } from '@patternfly/react-icons';

export interface HeaderProps {
  isDrawerOpen: boolean;
  onNavToggle: () => void;
  onNotificationClick: () => void;
}

export function Header(props: HeaderProps) {
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
        <Brand
          alt="Open Innovation Labs"
          src={`${process.env.PUBLIC_URL}/oil_logo.png`}
        />
      }
      headerTools={
        <PageHeaderTools>
          <PageHeaderToolsGroup>
            <PageHeaderToolsItem>
              <Nav theme="dark" variant="horizontal">
                <NavList>
                  <NavItem
                    id="aboutLink"
                    itemId={2}
                    isActive={pathname === '/about'}
                  >
                    <Link style={iconPad} to="/app/about" data-cy={'about_link'}>
                      <Tooltip
                        content={'About'}
                        entryDelay={0}
                        exitDelay={10}
                        position={TooltipPosition.bottom}>
                        <HelpIcon title="About" />
                      </Tooltip>
                    </Link>
                  </NavItem>
                  <NavItem
                    id="feedback"
                    itemId={3}
                    isActive={pathname === '/about'}
                  >
                    <Link
                      to="/app/requestfeature"
                      title="Feedback and Feature Request"
                    >
                      <Tooltip
                        content={'Feedback and Feature Request'}
                        entryDelay={0}
                        exitDelay={10}
                        position={TooltipPosition.bottom}>
                        <LightbulbIcon />
                      </Tooltip>
                    </Link>
                  </NavItem>
                  <NavItem id="notifications" itemId={4}>
                    <Tooltip
                      content={'Notifications'}
                      entryDelay={0}
                      exitDelay={10}
                      position={TooltipPosition.bottom}
                    >
                      <Notification
                        onNotificationClick={props.onNotificationClick}
                      />
                    </Tooltip>
                  </NavItem>
                </NavList>
              </Nav>
            </PageHeaderToolsItem>
            <PageHeaderToolsItem>
              <UserDropdown />
            </PageHeaderToolsItem>
          </PageHeaderToolsGroup>
        </PageHeaderTools>
      }
    />
  );
}
