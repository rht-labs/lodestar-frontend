import React, { useContext, useState, useEffect } from 'react';
import { Nav, NavItem, NavList } from '@patternfly/react-core';

import { EngagementContext } from '../context/engagement_context';
function _EngagementNav() {
  const engagementContext = useContext(EngagementContext);
  const [hasFetchedEngagements, setHasFetchedEngagements] = useState<boolean>(
    false
  );

  const columnHeaderStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#AFBAC4',
    paddingTop: 8,
    paddingBottom: 8,
    borderBottom: '1px solid #AFBAC4'
  };

  useEffect(() => {
    if (!hasFetchedEngagements) {
      setHasFetchedEngagements(true);
      engagementContext.getEngagements();
    }
  }, [engagementContext, hasFetchedEngagements]);
  const navItems = engagementContext.engagements.map(engagement => {
    return (
      <NavItem key={engagement.project_id}>
        {engagement.project_name}
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
    // <Nav onSelect={this.onSelect}>
    <Nav>
      <div style={ columnHeaderStyle }>ENGAGEMENTS</div>
      <NavList>
        {navItems}
      </NavList>
    </Nav>
  );
}

export const EngagementNav = React.memo(_EngagementNav);
