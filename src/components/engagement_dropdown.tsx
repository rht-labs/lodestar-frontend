import React, { useContext, useState, useEffect } from 'react';
import { ContextSelector, ContextSelectorItem } from '@patternfly/react-core';
import { EngagementContext } from '../context/engagement_context';
function _EngagementDropdown() {
  const engagementContext = useContext(EngagementContext);
  const [hasFetchedEngagements, setHasFetchedEngagements] = useState<boolean>(
    false
  );
  useEffect(() => {
    if (!hasFetchedEngagements) {
      setHasFetchedEngagements(true);
      engagementContext.getEngagements();
    }
    console.log(engagementContext.engagements);
  }, [engagementContext, hasFetchedEngagements]);
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

export const EngagementDropdown = React.memo(_EngagementDropdown);
