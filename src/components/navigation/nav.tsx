import React, { useContext } from 'react';
import { Nav, NavItem, NavList, Popover, Button } from '@patternfly/react-core';
import { Link, useLocation } from 'react-router-dom';
import PopupContext from '../../context/popup_context';

export const NavDefaultList = () => {
  const popupContext = useContext(PopupContext);
  const { pathname } = useLocation();

  return (
    <Nav theme="dark">
      <NavList>
        <NavItem id="engagementFormLink" itemId={0} isActive={pathname === '/'}>
          <Link to="/">Engagement Form</Link>
        </NavItem>
        <Popover
          isVisible={!popupContext.hasBeenShown}
          headerContent={<span>We're trying to improve</span>}
          shouldClose={popupContext.onDismissed}
          distance={0}
          bodyContent={
            <div>
              <div>
                Tell us about a feature you would like to see included in Open
                Management Portal.
              </div>
              <Button onClick={popupContext.onDismissed}>Ok, got it</Button>
            </div>
          }
        >
          <NavItem
            id="engagementFormLink"
            itemId={1}
            isActive={pathname === '/feature-request'}
          >
            <Link to="/feature-request">Feature Requests</Link>
          </NavItem>
        </Popover>
      </NavList>
    </Nav>
  );
};
