import React from 'react';
import { Nav, NavExpandable, NavItem, NavList } from '@patternfly/react-core';
import { Link, useLocation } from 'react-router-dom';
import {AsleepIcon, OnRunningIcon, PendingIcon, TachometerAltIcon, PlusIcon} from "@patternfly/react-icons";

export const EngagementNavigation = () => {
  const { pathname } = useLocation();

  return (
    <div>
      <Nav theme="dark">
        <NavItem
          title="Dashboard"
          itemId="dashboard"
          isActive={pathname.includes('/app/dashboard')}
        >
          <Link to="/app/dashboard">Dashboard</Link>
        </NavItem>
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
              isActive={pathname === '/app/engagements/all'}
            >
              <Link to="/app/engagements/all">
                <TachometerAltIcon style={{marginRight: '1rem'}}/>
                Overview
              </Link>
            </NavItem>
            <NavItem
              id="upcoming"
              itemId={0}
              isActive={pathname === '/app/engagements/upcoming'}
            >
              <Link to="/app/engagements/upcoming">
                <PendingIcon style={{marginRight: '1rem'}}/>
                Upcoming
              </Link>
            </NavItem>
            <NavItem
              id="Active"
              itemId={0}
              isActive={pathname === '/app/engagements/active'}
            >
              <Link to="/app/engagements/active">
                <OnRunningIcon style={{marginRight: '1rem'}}/>
                Active
              </Link>
            </NavItem>
            <NavItem
              id="Past"
              itemId={0}
              isActive={pathname === '/app/engagements/past'}
            >
              <Link to="/app/engagements/past">
                <AsleepIcon style={{marginRight: '1rem'}}/>
                Past
              </Link>
            </NavItem>
            <NavItem
              id="New"
              itemId={0}
              isActive={pathname === '/app/engagements/new'}
            >
              <Link to="/app/engagements/new">
                <PlusIcon style={{marginRight: '1rem'}}/>
                Create New
              </Link>
            </NavItem>
          </NavExpandable>
        </NavList>
      </Nav>
    </div>
  );
};
