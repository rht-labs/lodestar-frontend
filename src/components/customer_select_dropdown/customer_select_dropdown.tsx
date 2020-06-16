import React, { useState, useEffect } from 'react';
import { Select, SelectVariant, SelectOption } from '@patternfly/react-core';
import { Logger } from '../../utilities/logger';
import { useEngagements } from '../../context/engagement_context/engagement_hook';
export interface CustomerSelectDropdownProps {
  onSelect: (selectedOption: string) => void;
  selectedValue?: string;
  placeholder?: string;
}
export interface HasOptions {
  options?: string[];
}
export function _CustomerSelectDropdown(
  props: CustomerSelectDropdownProps & HasOptions
) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleSelect = (_, selection) => {
    props.onSelect(selection);
    setIsOpen(false);
  };
  return (
    <Select
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      onCreateOption={option => Logger.info(option)}
      onSelect={handleSelect}
      isCreatable={true}
      selections={props.selectedValue}
      maxHeight={100}
      variant={SelectVariant.typeahead}
      placeholderText={props.placeholder}
      onClear={() => props.onSelect(undefined)}
    >
      {props.options
        ?.concat([props.selectedValue])
        .filter(v => !!v)
        .map(value => (
          <SelectOption data-testid={value} value={value} key={value} />
        ))}
    </Select>
  );
}

export function CustomerSelectDropdown(props: CustomerSelectDropdownProps) {
  const { engagements, getEngagements } = useEngagements();
  const customerNames = Array.from(
    new Set(
      engagements?.filter(e => !!e.customer_name).map(e => e.customer_name) ??
        []
    )
  );
  const CUSTOMER_DROPDOWN = _CustomerSelectDropdown;
  useEffect(() => {
    if (engagements === undefined) {
      getEngagements();
    }
  }, [engagements, getEngagements]);
  return (
    <CUSTOMER_DROPDOWN
      onSelect={props.onSelect}
      options={customerNames}
      placeholder={props.placeholder}
      selectedValue={props.selectedValue}
    />
  );
}
