import React, { useState, useEffect } from 'react';
import { Select, SelectVariant, SelectOption } from '@patternfly/react-core';
import { useEngagementCollection } from '../../context/engagement_collection_context/engagement_collection_context';
import { useServiceProviders } from '../../context/service_provider_context/service_provider_context';
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
      onSelect={handleSelect}
      maxHeight={400}
      isCreatable={true}
      selections={props.selectedValue}
      variant={SelectVariant.typeahead}
      placeholderText={props.placeholder}
      onClear={() => props.onSelect(undefined)}
      toggleId="customer_dropdown"
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
  const { engagementService } = useServiceProviders();
  const { engagements, getEngagements } = useEngagementCollection({
    engagementService,
  });
  const customerNames = Array.from(
    new Set(
      engagements?.filter(e => !!e.customer_name).map(e => e.customer_name) ??
        []
    )
  );
  const [hasFetched, setHasFetched] = useState(false);
  const CUSTOMER_DROPDOWN = _CustomerSelectDropdown;
  useEffect(() => {
    if (!hasFetched) {
      getEngagements();
      setHasFetched(true);
    }
  }, [hasFetched, getEngagements]);
  return (
    <CUSTOMER_DROPDOWN
      onSelect={props.onSelect}
      options={customerNames}
      placeholder={props.placeholder}
      selectedValue={props.selectedValue}
    />
  );
}
