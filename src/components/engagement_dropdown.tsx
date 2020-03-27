import React, { useContext, useState } from 'react';
import { Dropdown, DropdownToggle, DropdownItem } from '@patternfly/react-core';
import { EngagementContext } from '../context/engagement_context';
export function EngagementDropdown() {
  const engagementContext = useContext(EngagementContext);
  const dropdownItems = engagementContext.engagements.map(engagement => {
    return <DropdownItem>{engagement.name}</DropdownItem>;
  });
  const [isOpen, setIsOpen] = useState<boolean>(true);

  console.log(dropdownItems);
  return (
    <Dropdown
      isPlain
      dropdownItems={dropdownItems}
      isOpen={isOpen}
      onSelect={() => setIsOpen(!isOpen)}
      toggle={
        <DropdownToggle onToggle={() => setIsOpen(!isOpen)}>
          Select Engagement
        </DropdownToggle>
      }
    ></Dropdown>
  );
}
