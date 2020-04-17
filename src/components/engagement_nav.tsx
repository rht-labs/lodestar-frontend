import React, { useContext, useState, useEffect } from 'react';
import { Nav, NavItem, NavList } from '@patternfly/react-core';

import { EngagementContext } from '../context/engagement_context';
function _EngagementNav() {
  const engagementContext = useContext(EngagementContext);
  const [hasFetchedEngagements, setHasFetchedEngagements] = useState<boolean>(
    false
  );
  useEffect(() => {
    if (!hasFetchedEngagements) {
      setHasFetchedEngagements(true);
      engagementContext.getEngagements();
    }
  }, [engagementContext, hasFetchedEngagements]);
  const navItems = engagementContext.engagements.map(engagement => {
    return (
      <NavItem key={engagement.name}>
        {engagement.name}
      </NavItem>
    );
  });
  // const [selectedValue, setSelectedValue] = useState<string>(
  //   'Selected Engagement'
  // );

  // const onSelect = (_: any, value: any) => {
  //   setSelectedValue(value as string);
  // };

  return (
    <Nav>
      <NavList>
        {navItems}
      </NavList>
    </Nav>
  );
}

export const EngagementNav = React.memo(_EngagementNav);
