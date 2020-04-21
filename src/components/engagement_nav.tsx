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
    paddingTop: 8,
    paddingBottom: 8,
    borderBottom: '1px solid #AFBAC4',
    backgroundColor: '#EDEDED',
    fontWeight: 'bold',
  };

// set style .pf-c-nav__link:active::after to width 75%

  const navSub: React.CSSProperties = {
    color: '#AFBAC4',
    fontSize: 12
  }

  const navDisplay: React.CSSProperties = {
    display: 'block',
  }
  
  const [selectedEngagement, setSelectedEngagement] = useState<number>(0);
  
  const onNavSelect = result => {
    setSelectedEngagement(result.itemId);
    console.log(engagementContext.engagements[result.itemId])
    engagementContext.setActiveEngagement(engagementContext.engagements[result.itemId]);
  };

  useEffect(() => {
    if (!hasFetchedEngagements) {
      setHasFetchedEngagements(true);
      engagementContext.getEngagements();
    }
  }, [engagementContext, hasFetchedEngagements]);
  const navItems = engagementContext.engagements.sort(function(a, b) {
      var textA = a.customer_name.toUpperCase();
      var textB = b.customer_name.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  }).map((engagement, index) => {
    return (
      <NavItem
        style={navDisplay}
        key={index}
        itemId= {index}
        isActive={selectedEngagement === index}
      >
        <div>{engagement.project_name}</div><span style={navSub}>{engagement.customer_name}</span>
      </NavItem>
    );
  });

  return (
    <Nav onSelect={onNavSelect}>
      <div style={ columnHeaderStyle }>ENGAGEMENTS</div>
      <NavList>
        {navItems}
      </NavList>
    </Nav>
  );
}

export const EngagementNav = React.memo(_EngagementNav);
