import React, { useState } from 'react';
import {
  Button,
  InputGroup,
  Select,
  SelectOption,
} from '@patternfly/react-core';
import { EngagementStatus } from '../../../schemas/engagement';
import { EngagementFilterProps } from '../engagement_filter_bar';
import { FilterIcon } from '@patternfly/react-icons';

export function EngagementStatusSelect({
  onChange,
  filter,
}: EngagementFilterProps) {
  const [isStatusSelectOpen, setIsStatusSelectOpen] = useState<boolean>(false);

  const getStatusDisplayValue = (status: EngagementStatus) => {
    if (status === EngagementStatus.active) {
      return 'Active';
    } else if (status === EngagementStatus.past) {
      return 'Past';
    } else if (status === EngagementStatus.upcoming) {
      return 'Upcoming';
    }
  };
  return (
    <>
      <InputGroup>
        <Button variant="control" aria-label="search button for search input">
          <FilterIcon />
        </Button>
        <Select
          placeholderText="Engagement Status"
          toggleId={'filter_dropdown'}
          isOpen={isStatusSelectOpen}
          onToggle={() => setIsStatusSelectOpen(!isStatusSelectOpen)}
          selections={filter?.allowedStatuses}
          onSelect={(_, status: EngagementStatus) =>
            onChange({
              ...filter,
              allowedStatuses: status ? [status] : undefined,
            })
          }
        >
          {[
            <SelectOption key="any" value={undefined}>
              Any
            </SelectOption>,
          ].concat(
            Object.keys(EngagementStatus).map(statusKey => (
              <SelectOption key={statusKey}
                            value={EngagementStatus[statusKey]}
                            data-testid={EngagementStatus[statusKey]}>
                {getStatusDisplayValue(EngagementStatus[statusKey])}
              </SelectOption>
            ))
          )}
        </Select>
      </InputGroup>
    </>
  );
}
