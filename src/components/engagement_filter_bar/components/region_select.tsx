import React, { useState } from 'react';
import { EngagementFilter } from '../../../schemas/engagement_filter';
import {
  InputGroup,
  Button,
  Select,
  SelectOption,
} from '@patternfly/react-core';
import { GlobeIcon } from '@patternfly/react-icons';

export interface EngagementRegionSelectProps {
  filter: EngagementFilter;
  regions: Array<{ label: string; value: string }>;
  onChange: (filter: EngagementFilter) => void;
}
export function EngagementRegionSelect(props: EngagementRegionSelectProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <InputGroup>
      <Button variant="control" aria-label="engagement regions">
        <GlobeIcon />
      </Button>
      <Select
        data-testid="region"
        placeholderText="Engagement Region"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        toggleId="region_dropdown"
        selections={props?.filter?.engagementRegions}
        onSelect={(_, selection: string) => {
          setIsOpen(!isOpen);
          if (selection === 'any') {
            return props.onChange({
              ...props.filter,
              engagementRegions: undefined,
            });
          }
          props.onChange({
            ...props.filter,
            engagementRegions: [selection],
          });
        }}
      >
        {[
          <SelectOption value="any">Any</SelectOption>,
          ...props.regions.map(region => {
            return (
              <SelectOption
                data-testid={`engagement_region`}
                value={region.value}
              >
                {region.label}
              </SelectOption>
            );
          }),
        ]}
      </Select>
    </InputGroup>
  );
}
