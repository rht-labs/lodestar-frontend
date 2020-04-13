import React, { useState } from 'react';
import { Tabs, Tab } from '@patternfly/react-core';

export function EngagementPane() {
  const [activeTabKey , setActiveTabKey] = useState<number>(0);

  const contentPane: React.CSSProperties = {
    backgroundColor: '#EDEDED',
    height: '100vh'
  };

  const handleTabClick = function (this: any, event:any, tabIndex:any) {
    setActiveTabKey(tabIndex);
    console.log(activeTabKey);
  };

  return (
    <>
      <div style={contentPane}>
        <Tabs isFilled activeKey={activeTabKey} onSelect={handleTabClick}>
          <Tab eventKey={0} title="Tab item 1">
            Tab 1 section
          </Tab>
          <Tab eventKey={1} title="Tab item 2">
            Tab 2 section
          </Tab>
          <Tab eventKey={2} title="Tab item 3">
            Tab 3 section
          </Tab>
          <Tab eventKey={3} title="Tab item 4">
            Tab 4 section
          </Tab>
          <Tab eventKey={4} title="Tab item 5">
            Tab 5 section
          </Tab>
        </Tabs>
      </div>
    </>
  );
}
