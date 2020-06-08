import React from 'react';
import {Nav, NavExpandable, NavItem, NavList} from '@patternfly/react-core';
import {Link, useLocation} from 'react-router-dom';

export const EngagementNavigation = () => {
  const {pathname} = useLocation();

  return (
    <Nav theme="dark">
      <NavList>
        <NavExpandable title={"Engagements"} isActive={pathname.includes('/app/engagements')} isExpanded>
          <NavItem id="Pre-launch" itemId={0} isActive={pathname === '/app/engagements/pre-launch'}>
            <Link to="/app/engagements/pre-launch">Pre-launch</Link>
          </NavItem>
          <NavItem id="Active" itemId={0} isActive={pathname === '/app/engagements/active'}>
            <Link to="/app/engagements/active">Active</Link>
          </NavItem>
          <NavItem id="Past" itemId={0} isActive={pathname === '/app/engagements/past'}>
            <Link to="/app/engagements/past">Past</Link>
          </NavItem>
          <NavItem id="New" itemId={0} isActive={pathname === '/app/engagements/new'}>
            <Link to="/app/engagements/new">New</Link>
          </NavItem>
        </NavExpandable>
      </NavList>
    </Nav>
  );
};
