import React from 'react';
import { Nav, NavExpandable, NavItem, NavList } from '@patternfly/react-core';
import { Link, useLocation } from 'react-router-dom';

export const EngagementNavigation = () => {
  const { pathname } = useLocation();

  return (
    <div>
      <Nav theme="dark">
        <NavList>
          <NavExpandable
            title={'Engagements'}
            isActive={pathname.includes('/app/engagements')}
            isExpanded
            id="navExpandableEngagement"
          >
            <NavItem
              id="Overview"
              itemId={0}
              isActive={pathname === '/app/engagements/overview'}
            >
              <Link to="/app/engagements/all">Overview</Link>
            </NavItem>
            <NavItem
              id="upcoming"
              itemId={0}
              isActive={pathname === '/app/engagements/upcoming'}
            >
              <Link to="/app/engagements/upcoming">Upcoming</Link>
            </NavItem>
            <NavItem
              id="Active"
              itemId={0}
              isActive={pathname === '/app/engagements/active'}
            >
              <Link to="/app/engagements/active">Active</Link>
            </NavItem>
            <NavItem
              id="Past"
              itemId={0}
              isActive={pathname === '/app/engagements/past'}
            >
              <Link to="/app/engagements/past">Past</Link>
            </NavItem>
            <hr className="pf-c-divider" />
            <NavItem
              id="New"
              itemId={0}
              isActive={pathname === '/app/engagements/new'}
            >
              <Link to="/app/engagements/new">+ Create New</Link>
            </NavItem>
          </NavExpandable>
        </NavList>
      </Nav>
    </div>
  );
};
