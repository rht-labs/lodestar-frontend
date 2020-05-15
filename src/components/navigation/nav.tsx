import React from 'react';
import { Nav, NavItem, NavList } from '@patternfly/react-core';
import { Link, useLocation } from 'react-router-dom';
import { FeatureRequestPopup } from './feature_request_popup';
export const NavDefaultList = () => {
  const { pathname } = useLocation();

  return (
    <Nav theme="dark">
      <NavList>
        <NavItem id="engagementFormLink" itemId={0} isActive={pathname === '/'}>
          <Link to="/app">Engagement Form</Link>
        </NavItem>
        <FeatureRequestPopup>
          <NavItem
            id="engagementFormLink"
            itemId={1}
            isActive={pathname === '/feature-request'}
          >
            <Link to="/app/feature-request">Feature Requests</Link>
          </NavItem>
        </FeatureRequestPopup>
      </NavList>
    </Nav>
  );
};
