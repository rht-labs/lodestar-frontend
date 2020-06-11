import React, { useState } from 'react';
import { EngagementViewProps } from '.';
import { Loading } from './Loading';
import { Tabs, Tab } from '@patternfly/react-core';

interface EngagementTabViewProps extends EngagementViewProps {}

export function EngagementTabView({ engagement }: EngagementTabViewProps) {
  const [currentTab, setCurrentTab] = useState(0);
  const handleTabSelect = (e, tabIndex) => setCurrentTab(tabIndex);
  if (!engagement) {
    return <Loading />;
  }
  return (
    <Tabs activeKey={currentTab} onSelect={handleTabSelect}>
      <Tab title="Overview" eventKey={0}>
        Hello
      </Tab>
      <Tab title="Basic Information" eventKey={1}></Tab>
      <Tab title="Users" eventKey={2}></Tab>
      <Tab title="Cluster Information" eventKey={3}></Tab>
    </Tabs>
  );
}
