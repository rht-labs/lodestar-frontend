import React, { useState } from 'react';
import {
  InputGroup,
  Button,
  Select,
  SelectOption,
  SelectOptionObject,
  SelectVariant,
} from '@patternfly/react-core';
import { GlobeIcon } from '@patternfly/react-icons';

export interface EngagementRegionSelectProps {
  selectedOptions: string[];
  regions: Array<{ label: string; value: string }>;
  onChange: (option: string) => void;
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
        variant={SelectVariant.checkbox}
        toggleId="region_dropdown"
        selections={props?.selectedOptions}
        onSelect={(_, selection: string | SelectOptionObject) => {
          setIsOpen(!isOpen);
          props.onChange(selection as string);
        }}
      >
        {[
          <SelectOption key="any" value="any">
            Any
          </SelectOption>,
          ...props.regions.map(region => {
            return (
              <SelectOption
                key={region.value}
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
