import React, { useState } from 'react';
import {
  InputGroup,
  Button,
  Select,
  SelectOption,
  SelectOptionObject,
  SelectVariant,
} from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons';

export interface EngagementTypeSelectProps {
  selectedOptions: string[];
  types: Array<{ label: string; value: string }>;
  onChange: (option: string) => void;
}
export function EngagementTypeSelect(props: EngagementTypeSelectProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <InputGroup>
      <Button variant="control" aria-label="engagement types">
      <FilterIcon />
      </Button>
      <Select
        data-testid="type"
        placeholderText="Type"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        variant={SelectVariant.checkbox}
        toggleId="type_dropdown"
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
          ...props.types.map(type => {
            return (
              <SelectOption
                key={type.value}
                data-testid={`engagement_type`}
                value={type.value}
              >
                {type.label}
              </SelectOption>
            );
          }),
        ]}
      </Select>
    </InputGroup>
  );
}
