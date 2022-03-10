import React, { useState } from 'react';
import {
  Button,
  InputGroup,
  Select,
  SelectOption,
} from '@patternfly/react-core';
import { EngagementStatus } from '../../../schemas/engagement';
import { FilterIcon } from '@patternfly/react-icons';

export interface EngagementStatusSelectProps {
  selectedStatuses: EngagementStatus[],
  onChange:(status: EngagementStatus) => void
}
export function EngagementStatusSelect({
  onChange,
  selectedStatuses,
}: EngagementStatusSelectProps) {
  const [isStatusSelectOpen, setIsStatusSelectOpen] = useState<boolean>(false);

  const getStatusDisplayValue = (status: EngagementStatus) => {
    if (status === EngagementStatus.active) {
      return 'Active';
    } else if (status === EngagementStatus.past) {
      return 'Past';
    } else if (status === EngagementStatus.upcoming) {
      return 'Upcoming';
    } else if (status === EngagementStatus.terminating) {
      return 'Terminating';
    }
  };

  return (
    <>
      <InputGroup>
        <Button variant="control" aria-label="search button for search input">
          <FilterIcon />
        </Button>
        <Select
          placeholderText="Status"
          toggleId={'filter_dropdown'}
          isOpen={isStatusSelectOpen}
          onToggle={() => setIsStatusSelectOpen(!isStatusSelectOpen)}
          selections={selectedStatuses}
          onSelect={(_, status: EngagementStatus) =>
            onChange(status)
          }
        >
          {[
            <SelectOption key="any" value={undefined}>
              Any
            </SelectOption>,
          ].concat(
            Object.keys(EngagementStatus).map(statusKey => (
              <SelectOption
                key={statusKey}
                value={EngagementStatus[statusKey]}
                data-testid={EngagementStatus[statusKey]}
              >
                {getStatusDisplayValue(EngagementStatus[statusKey])}
              </SelectOption>
            ))
          )}
        </Select>
      </InputGroup>
    </>
  );
}
