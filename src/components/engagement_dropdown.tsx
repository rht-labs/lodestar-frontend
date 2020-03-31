import React, { useContext, useState } from 'react';
import { ContextSelector, ContextSelectorItem } from '@patternfly/react-core';
import { EngagementContext } from '../context/engagement_context';
export function EngagementDropdown() {
  const engagementContext = useContext(EngagementContext);
  const dropdownItems = engagementContext.engagements.map(engagement => {
    return (
      <ContextSelectorItem key={engagement.name}>
        {engagement.name}
      </ContextSelectorItem>
    );
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<string>(
    'Selected Engagement'
  );

  const onSelect = (_: any, value: any) => {
    setSelectedValue(value as string);
    setIsOpen(false);
  };

  console.log(dropdownItems);
  return (
    <ContextSelector
      screenReaderLabel={'Selected Engagement'}
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      onSelect={onSelect}
      toggleText={selectedValue}
    >
      {dropdownItems}
    </ContextSelector>
  );
}
